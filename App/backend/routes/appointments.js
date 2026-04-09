const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');
const router = express.Router();

// GET /api/appointments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, hospital_id, patient_id, date_from, date_to } = req.query;
    const where = {};

    if (req.user.role === 'patient') {
      const patient = await prisma.patients.findFirst({ where: { user_id: req.user.id } });
      if (!patient) return res.json({ success: true, data: { appointments: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } } });
      where.patient_id = patient.id;
    } else if (req.user.role === 'hospital_admin') {
      const hospital = await prisma.hospitals.findFirst({ where: { admin_id: req.user.id } });
      if (!hospital) return res.json({ success: true, data: { appointments: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } } });
      where.hospital_id = hospital.id;
    }

    if (status) where.status = status;
    if (hospital_id && req.user.role === 'super_admin') where.hospital_id = parseInt(hospital_id);
    if (patient_id && ['super_admin', 'hospital_admin'].includes(req.user.role)) where.patient_id = parseInt(patient_id);
    if (date_from) where.appointment_date = { ...where.appointment_date, gte: new Date(date_from) };
    if (date_to) where.appointment_date = { ...where.appointment_date, lte: new Date(date_to) };

    const [appointments, total] = await Promise.all([
      prisma.appointments.findMany({
        where,
        include: {
          hospitals: { select: { name: true, city: true, address: true } },
          patients: { include: { users: { select: { name: true, email: true } } } },
        },
        orderBy: [{ appointment_date: 'desc' }, { appointment_time: 'desc' }],
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.appointments.count({ where }),
    ]);

    const result = appointments.map(a => ({
      ...a,
      hospital_name: a.hospitals?.name,
      hospital_city: a.hospitals?.city,
      hospital_address: a.hospitals?.address,
      patient_name: a.patients?.users?.name,
      patient_email: a.patients?.users?.email,
      hospitals: undefined,
      patients: undefined,
    }));

    res.json({ success: true, data: { appointments: result, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } } });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get appointments' });
  }
});

// GET /api/appointments/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await prisma.appointments.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        hospitals: { select: { name: true, address: true, city: true, phone: true } },
        patients: { include: { users: { select: { name: true, email: true, phone: true } } } },
        payments: true,
      },
    });

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (req.user.role === 'patient' && appointment.patients?.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (req.user.role === 'hospital_admin' && appointment.hospitals && req.user.hospital_id !== appointment.hospital_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { appointment } });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to get appointment' });
  }
});

// POST /api/appointments
router.post('/', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { hospital_id, appointment_date, appointment_time, type, reason, notes, consultation_fee } = req.body;

    if (!reason?.trim()) return res.status(400).json({ success: false, message: 'Reason for appointment is required' });

    const patient = await prisma.patients.findFirst({ where: { user_id: req.user.id } });
    if (!patient) return res.status(400).json({ success: false, message: 'Patient profile not found' });

    const hospital = await prisma.hospitals.findFirst({ where: { id: parseInt(hospital_id), status: 'active' } });
    if (!hospital) return res.status(400).json({ success: false, message: 'Hospital not found or inactive' });

    const conflict = await prisma.appointments.findFirst({
      where: {
        patient_id: patient.id,
        appointment_date: new Date(appointment_date),
        appointment_time: new Date(`1970-01-01T${appointment_time}`),
        status: { notIn: ['cancelled', 'completed'] },
      },
    });
    if (conflict) return res.status(400).json({ success: false, message: 'You already have an appointment at this date and time' });

    const appointment = await prisma.appointments.create({
      data: {
        patient_id: patient.id,
        hospital_id: parseInt(hospital_id),
        appointment_date: new Date(appointment_date),
        appointment_time: new Date(`1970-01-01T${appointment_time}`),
        type: type || 'consultation',
        reason,
        notes: notes || null,
        consultation_fee: consultation_fee || null,
        status: 'pending',
      },
      include: { hospitals: { select: { name: true, city: true } } },
    });

    res.status(201).json({ success: true, message: 'Appointment created successfully', data: { appointment } });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create appointment' });
  }
});

// PUT /api/appointments/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);
    const { appointment_date, appointment_time, reason, notes, status } = req.body;

    const appointment = await prisma.appointments.findUnique({
      where: { id: appointmentId },
      include: { patients: { select: { user_id: true } } },
    });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    let canUpdate = false;
    if (req.user.role === 'patient' && appointment.patients?.user_id === req.user.id) {
      if (appointment.status !== 'pending') return res.status(400).json({ success: false, message: 'Can only modify pending appointments' });
      canUpdate = true;
    } else if (req.user.role === 'hospital_admin' && req.user.hospital_id === appointment.hospital_id) {
      canUpdate = true;
    } else if (req.user.role === 'super_admin') {
      canUpdate = true;
    }
    if (!canUpdate) return res.status(403).json({ success: false, message: 'Access denied' });

    const data = {};
    if (appointment_date) data.appointment_date = new Date(appointment_date);
    if (appointment_time) data.appointment_time = new Date(`1970-01-01T${appointment_time}`);
    if (reason !== undefined) data.reason = reason;
    if (notes !== undefined) data.notes = notes;
    if (status && req.user.role !== 'patient') data.status = status;

    const updated = await prisma.appointments.update({
      where: { id: appointmentId },
      data,
      include: { hospitals: { select: { name: true, city: true } } },
    });

    res.json({ success: true, message: 'Appointment updated successfully', data: { appointment: updated } });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id);

    const appointment = await prisma.appointments.findUnique({
      where: { id: appointmentId },
      include: { patients: { select: { user_id: true } } },
    });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    let canCancel = false;
    if (req.user.role === 'patient' && appointment.patients?.user_id === req.user.id) canCancel = true;
    else if (req.user.role === 'hospital_admin' && req.user.hospital_id === appointment.hospital_id) canCancel = true;
    else if (req.user.role === 'super_admin') canCancel = true;
    if (!canCancel) return res.status(403).json({ success: false, message: 'Access denied' });

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel this appointment' });
    }

    await prisma.appointments.update({ where: { id: appointmentId }, data: { status: 'cancelled' } });
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
  }
});

module.exports = router;
