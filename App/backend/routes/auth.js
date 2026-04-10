const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { generateToken, authenticateToken, authorize } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const router = express.Router();

// POST /api/auth/register
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { email, password, name, phone, role, dateOfBirth, gender, bloodType, country,
      medicalHistory, allergies, currentMedications, hasInsurance,
      insuranceProvider, insurancePolicyNumber, insuranceExpiryDate } = req.body;

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.users.create({
      data: { email, password: hashedPassword, name, phone, role }
    });

    if (role === 'patient') {
      await prisma.patients.create({
        data: {
          user_id: user.id,
          date_of_birth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender: gender || null,
          blood_group: bloodType || null,
          country: country || null,
          medical_history: medicalHistory ? JSON.stringify(medicalHistory) : null,
          allergies: allergies || null,
          current_medications: currentMedications || null,
          insurance_provider: (hasInsurance && insuranceProvider) ? insuranceProvider : null,
          insurance_policy_number: (hasInsurance && insurancePolicyNumber) ? insurancePolicyNumber : null,
          insurance_expiry_date: (hasInsurance && insuranceExpiryDate) ? new Date(insuranceExpiryDate) : null,
        }
      });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const { password: _, ...safeUser } = user;
    res.status(201).json({ success: true, message: 'User registered successfully', data: { user: safeUser, token } });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({ where: { email } });

    if (user) {
      if (user.status !== 'active') return res.status(401).json({ success: false, message: 'Account is inactive. Please contact support.' });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

      const token = generateToken({ userId: user.id, email: user.email, role: user.role });

      const { password: _, ...safeUser } = user;
      let additionalData = {};

      if (user.role === 'patient') {
        const patient = await prisma.patients.findFirst({ where: { user_id: user.id } });
        if (patient?.medical_history) {
          try { patient.medical_history = JSON.parse(patient.medical_history); } catch { patient.medical_history = []; }
        }
        additionalData.patient = patient || null;

      } else if (user.role === 'hospital_admin') {
        let hospital = await prisma.hospitals.findFirst({ where: { admin_id: user.id } });
        // Fallback: employee lookup scoped to own hospital
        if (!hospital) {
          const emp = await prisma.hospital_employees.findFirst({
            where: { email: user.email, status: { not: 'terminated' } }
          });
          if (emp) {
            hospital = await prisma.hospitals.findFirst({ where: { id: emp.hospital_id } });
            safeUser.employee_position = emp.position;
          }
        }
        additionalData.hospital = hospital || null;
        if (hospital) safeUser.hospital_id = hospital.id;
      }

      return res.json({ success: true, message: 'Login successful', data: { user: safeUser, token, ...additionalData } });
    }

    // Fallback: hospital direct login (legacy)
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, phone: true, role: true, status: true, created_at: true, updated_at: true }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let additionalData = {};

    if (user.role === 'patient') {
      const patient = await prisma.patients.findFirst({ where: { user_id: user.id } });
      if (patient?.medical_history) {
        try { patient.medical_history = JSON.parse(patient.medical_history); } catch { patient.medical_history = []; }
      }
      additionalData.patient = patient || null;

    } else if (user.role === 'hospital_admin') {
      let hospital = await prisma.hospitals.findFirst({ where: { admin_id: user.id } });
      // Fallback: employee lookup scoped to own hospital
      if (!hospital) {
        const emp = await prisma.hospital_employees.findFirst({
          where: { email: user.email, status: { not: 'terminated' } }
        });
        if (emp) {
          hospital = await prisma.hospitals.findFirst({ where: { id: emp.hospital_id } });
          user.employee_position = emp.position;
        }
      }
      additionalData.hospital = hospital || null;
      if (hospital) user.hospital_id = hospital.id;
    }

    res.json({ success: true, data: { user, ...additionalData } });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user profile' });
  }
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: { name, phone },
      select: { id: true, email: true, name: true, phone: true, role: true, status: true, created_at: true, updated_at: true }
    });

    res.json({ success: true, message: 'Profile updated successfully', data: { user } });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// PUT /api/auth/change-password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Current and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

    const user = await prisma.users.findUnique({ where: { id: req.user.id }, select: { password: true } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.users.update({ where: { id: req.user.id }, data: { password: hashed } });

    res.json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/users (Super Admin only)
router.get('/users', authenticateToken, authorize('super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        select: { id: true, email: true, name: true, phone: true, role: true, status: true, created_at: true, updated_at: true },
        orderBy: { created_at: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.users.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
});

module.exports = router;
