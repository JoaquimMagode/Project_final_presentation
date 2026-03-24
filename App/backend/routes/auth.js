const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken, authenticateToken, authorize } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone, 
      role,
      // Patient-specific fields
      dateOfBirth,
      gender,
      bloodType,
      country,
      medicalHistory,
      allergies,
      currentMedications
    } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone, role]
    );

    const userId = result.insertId;

    // If role is patient, create detailed patient profile
    if (role === 'patient') {
      const medicalHistoryJson = medicalHistory ? JSON.stringify(medicalHistory) : null;
      
      await pool.execute(
        `INSERT INTO patients (
          user_id, 
          date_of_birth, 
          gender, 
          blood_group, 
          country, 
          medical_history, 
          allergies, 
          current_medications
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          dateOfBirth || null,
          gender || null,
          bloodType || null,
          country || null,
          medicalHistoryJson,
          allergies || null,
          currentMedications || null
        ]
      );
    }

    // Generate token
    const token = generateToken({ userId, email, role });

    // Get user data (without password)
    const [users] = await pool.execute(
      'SELECT id, email, name, phone, role, status, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: users[0],
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user or hospital
// @access  Public
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // First try to find user in users table
    const [users] = await pool.execute(
      'SELECT id, email, password, name, phone, role, status FROM users WHERE email = ?',
      [email]
    );

    if (users.length > 0) {
      const user = users[0];

      // Check if account is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is inactive. Please contact support.'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = generateToken({ 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      });

      // Remove password from response
      delete user.password;

      // Get additional data based on role
      let additionalData = {};
      
      if (user.role === 'patient') {
        const [patients] = await pool.execute(
          'SELECT * FROM patients WHERE user_id = ?',
          [user.id]
        );
        if (patients[0] && patients[0].medical_history) {
          try {
            patients[0].medical_history = JSON.parse(patients[0].medical_history);
          } catch (e) {
            patients[0].medical_history = [];
          }
        }
        additionalData.patient = patients[0] || null;
      } else if (user.role === 'hospital_admin') {
        const [hospitals] = await pool.execute(
          'SELECT * FROM hospitals WHERE admin_id = ?',
          [user.id]
        );
        additionalData.hospital = hospitals[0] || null;
      }

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token,
          ...additionalData
        }
      });
    }

    // If not found in users table, try hospitals table
    const [hospitals] = await pool.execute(
      'SELECT id, name, contact_email as email, password, contact_phone as phone, status FROM hospitals WHERE contact_email = ?',
      [email]
    );

    if (hospitals.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const hospital = hospitals[0];

    // Check if hospital is active
    if (hospital.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Hospital account is inactive. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, hospital.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token for hospital
    const token = generateToken({ 
      userId: hospital.id, 
      email: hospital.email, 
      role: 'hospital_admin',
      isHospital: true
    });

    // Remove password from response
    delete hospital.password;

    res.json({
      success: true,
      message: 'Hospital login successful',
      data: {
        user: {
          id: hospital.id,
          email: hospital.email,
          name: hospital.name,
          phone: hospital.phone,
          role: 'hospital_admin',
          status: hospital.status
        },
        hospital,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user data
    const [users] = await pool.execute(
      'SELECT id, email, name, phone, role, status, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    let additionalData = {};

    // Get role-specific data
    if (user.role === 'patient') {
      const [patients] = await pool.execute(
        'SELECT * FROM patients WHERE user_id = ?',
        [userId]
      );
      if (patients[0] && patients[0].medical_history) {
        try {
          patients[0].medical_history = JSON.parse(patients[0].medical_history);
        } catch (e) {
          patients[0].medical_history = [];
        }
      }
      additionalData.patient = patients[0] || null;
    } else if (user.role === 'hospital_admin') {
      const [hospitals] = await pool.execute(
        'SELECT * FROM hospitals WHERE admin_id = ?',
        [userId]
      );
      additionalData.hospital = hospitals[0] || null;
    }

    res.json({
      success: true,
      data: {
        user,
        ...additionalData
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    // Update user basic info
    await pool.execute(
      'UPDATE users SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, phone, userId]
    );

    // Get updated user data
    const [users] = await pool.execute(
      'SELECT id, email, name, phone, role, status, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: users[0]
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get current password
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.execute(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is handled client-side by removing the token
  // Here we can log the logout action for audit purposes
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   GET /api/auth/users
// @desc    Get all users (Super Admin only)
// @access  Private (Super Admin)
router.get('/users', authenticateToken, authorize('super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, email, name, phone, role, status, created_at, updated_at FROM users';
    let countQuery = 'SELECT COUNT(*) as total FROM users';
    let queryParams = [];
    let conditions = [];

    // Add filters
    if (role) {
      conditions.push('role = ?');
      queryParams.push(role);
    }
    if (status) {
      conditions.push('status = ?');
      queryParams.push(status);
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));

    // Get users
    const [users] = await pool.execute(query, queryParams);
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
});

module.exports = router;