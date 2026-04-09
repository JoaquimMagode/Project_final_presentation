const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');
const router = express.Router();

const parseHistory = (p) => {
  if (p?.medical_history) {
    try { p.medical_history = JSON.parse(p.medical_history); } catch { p.medical_history = []; }
  }
  return p;
};

// GET /api/patients/profile
router.get('/profile', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await prisma.patients.findFirst({
      where: { user_id: req.user.id },
      include: { users: { select: { name: true, email: true, phone: true, status: true } } },
    });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
    res.json({ success: true, data: { patient: parseHistory(patient) } });
  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patient profile' });
  }
});

// PUT /api/patients/profile
router.put('/profile', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { date_of_birth, gender, blood_group, address, city, state, country,
      emergency_contact_name, emergency_contact_phone, medical_history, allergies, current_medications } = req.body;

    const patient = await prisma.patients.findFirst({ where: { user_id: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });

    const updated = await prisma.patients.update({
      where: { id: patient.id },
      data: {
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender: gender || null,
        address: address || null,
        medical_history: medical_history ? JSON.stringify(medical_history) : null,
      },
      include: { users: { select: { name: true, email: true, phone: true, status: true } } },
    });

    res.json({ success: true, message: 'Patient profile updated successfully', data: { patient: parseHistory(updated) } });
  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update patient profile' });
  }
});

// GET /api/patients/appointments
router.get('/appointments', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await prisma.patients.findFirst({ where: { user_id: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });

    const appointments = await prisma.appointments.findMany({
      where: { patient_id: patient.id },
      include: { hospitals: { select: { name: true, city: true, address: true } } },
      orderBy: [{ appointment_date: 'desc' }, { appointment_time: 'desc' }],
    });

    const result = appointments.map(a => ({
      ...a,
      hospital_name: a.hospitals?.name,
      hospital_city: a.hospitals?.city,
      hospital_address: a.hospitals?.address,
      hospitals: undefined,
    }));

    res.json({ success: true, data: { appointments: result } });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patient appointments' });
  }
});

// POST /api/patients/appointments
router.post('/appointments', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { hospital_id, appointment_date, appointment_time, reason } = req.body;

    const patient = await prisma.patients.findFirst({ where: { user_id: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });

    const appointment = await prisma.appointments.create({
      data: {
        patient_id: patient.id,
        hospital_id: parseInt(hospital_id),
        appointment_date: new Date(appointment_date),
        appointment_time: new Date(`1970-01-01T${appointment_time}`),
        reason,
        notes: reason,
        status: 'pending',
        type: 'consultation',
      },
      include: { hospitals: { select: { name: true, city: true, address: true } } },
    });

    res.status(201).json({ success: true, message: 'Appointment created successfully', data: { appointment } });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create appointment' });
  }
});

// GET /api/patients/registration
router.get('/registration', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await prisma.patients.findFirst({
      where: { user_id: req.user.id },
      include: { users: { select: { name: true, email: true, phone: true } } },
    });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient registration not found' });
    res.json({ success: true, data: { registration: patient } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get patient registration' });
  }
});

// PUT /api/patients/registration
router.put('/registration', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { date_of_birth, gender, medical_history, emergency_contact_name } = req.body;
    const patient = await prisma.patients.findFirst({ where: { user_id: req.user.id } });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    const updated = await prisma.patients.update({
      where: { id: patient.id },
      data: {
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender: gender || null,
        medical_history: medical_history || null,
        emergency_contact: emergency_contact_name || null,
      },
      include: { users: { select: { name: true, email: true, phone: true } } },
    });

    res.json({ success: true, message: 'Patient registration updated successfully', data: { registration: updated } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update patient registration' });
  }
});

// POST /api/patients/registration
router.post('/registration', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { date_of_birth, gender, medical_history, emergency_contact_name } = req.body;

    const existing = await prisma.patients.findFirst({ where: { user_id: req.user.id } });
    if (existing) return res.status(400).json({ success: false, message: 'Patient registration already exists. Use update instead.' });

    const patient = await prisma.patients.create({
      data: {
        user_id: req.user.id,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender: gender || null,
        medical_history: medical_history || null,
        emergency_contact: emergency_contact_name || null,
      },
      include: { users: { select: { name: true, email: true, phone: true } } },
    });

    res.status(201).json({ success: true, message: 'Patient registration created successfully', data: { registration: patient } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create patient registration' });
  }
});

// GET /api/patients/documents
router.get('/documents', authenticateToken, authorize('patient'), async (req, res) => {
  res.json({ success: true, data: { documents: [] } });
});

// GET /api/patients
router.get('/', authenticateToken, authorize('super_admin', 'hospital_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const where = {};
    if (search) {
      where.users = { OR: [{ name: { contains: search } }, { email: { contains: search } }] };
    }

    const [patients, total] = await Promise.all([
      prisma.patients.findMany({
        where,
        include: { users: { select: { name: true, email: true, phone: true, status: true, created_at: true } } },
        orderBy: { users: { created_at: 'desc' } },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.patients.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        patients,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patients' });
  }
});

// GET /api/patients/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const patientId = parseInt(req.params.id);
    const patient = await prisma.patients.findUnique({
      where: { id: patientId },
      include: { users: { select: { name: true, email: true, phone: true, status: true } } },
    });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    if (req.user.role === 'patient' && patient.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [appointments, reports, payments] = await Promise.all([
      prisma.appointments.findMany({
        where: { patient_id: patientId },
        include: { hospitals: { select: { name: true } } },
        orderBy: { appointment_date: 'desc' },
        take: 10,
      }),
      prisma.medical_reports.findMany({
        where: { patient_id: patientId },
        include: { hospitals: { select: { name: true } } },
        orderBy: { report_date: 'desc' },
        take: 10,
      }),
      prisma.payments.findMany({
        where: { patient_id: patientId },
        include: { hospitals: { select: { name: true } } },
        orderBy: { created_at: 'desc' },
        take: 10,
      }),
    ]);

    res.json({ success: true, data: { patient: parseHistory(patient), appointments, reports, payments } });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patient' });
  }
});

module.exports = router;
