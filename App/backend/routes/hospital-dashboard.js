const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken, authorizeHospitalAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/hospital-dashboard/stats
router.get('/stats', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const [total_appointments, pending, confirmed, completed, cancelled, total_employees] = await Promise.all([
      prisma.appointments.count({ where: { hospital_id: hospitalId } }),
      prisma.appointments.count({ where: { hospital_id: hospitalId, status: 'pending' } }),
      prisma.appointments.count({ where: { hospital_id: hospitalId, status: 'confirmed' } }),
      prisma.appointments.count({ where: { hospital_id: hospitalId, status: 'completed' } }),
      prisma.appointments.count({ where: { hospital_id: hospitalId, status: 'cancelled' } }),
      prisma.hospital_employees.count({ where: { hospital_id: hospitalId, status: 'active' } }),
    ]);

    const revenueAgg = await prisma.payments.aggregate({
      where: { hospital_id: hospitalId, payment_status: 'completed' },
      _sum: { amount: true },
      _avg: { amount: true },
    });

    const total_patients = await prisma.appointments.findMany({
      where: { hospital_id: hospitalId },
      select: { patient_id: true },
      distinct: ['patient_id'],
    });

    res.json({
      success: true,
      data: {
        total_appointments,
        pending_appointments: pending,
        confirmed_appointments: confirmed,
        completed_appointments: completed,
        cancelled_appointments: cancelled,
        total_employees,
        total_patients: total_patients.length,
        total_revenue: revenueAgg._sum.amount || 0,
        avg_consultation_fee: revenueAgg._avg.amount || 0,
      }
    });
  } catch (error) {
    console.error('Get hospital stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get hospital statistics' });
  }
});

// GET /api/hospital-dashboard/patients
router.get('/patients', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { page = 1, limit = 10, search } = req.query;

    const patientIds = await prisma.appointments.findMany({
      where: { hospital_id: hospitalId },
      select: { patient_id: true },
      distinct: ['patient_id'],
    });
    const ids = patientIds.map(p => p.patient_id);

    const where = { id: { in: ids } };
    if (search) {
      where.users = { OR: [{ name: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }] };
    }

    const [patients, total] = await Promise.all([
      prisma.patients.findMany({
        where,
        include: { users: { select: { name: true, email: true, phone: true } } },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.patients.count({ where }),
    ]);

    res.json({
      success: true,
      data: { patients, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) {
    console.error('Get hospital patients error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patients' });
  }
});

// GET /api/hospital-dashboard/appointments
router.get('/appointments', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { page = 1, limit = 10, status, date } = req.query;

    const where = { hospital_id: hospitalId };
    if (status) where.status = status;
    if (date) where.appointment_date = new Date(date);

    const appointments = await prisma.appointments.findMany({
      where,
      include: {
        patients: { include: { users: { select: { name: true, email: true, phone: true } } } },
      },
      orderBy: [{ appointment_date: 'desc' }, { appointment_time: 'desc' }],
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    const result = appointments.map(a => ({
      ...a,
      patient_name: a.patients?.users?.name,
      patient_email: a.patients?.users?.email,
      patient_phone: a.patients?.users?.phone,
      patients: undefined,
    }));

    res.json({ success: true, data: { appointments: result } });
  } catch (error) {
    console.error('Get hospital appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get appointments' });
  }
});

// GET /api/hospital-dashboard/payments
router.get('/payments', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { page = 1, limit = 10, status } = req.query;

    const where = { hospital_id: hospitalId };
    if (status) where.payment_status = status;

    const payments = await prisma.payments.findMany({
      where,
      include: {
        appointments: { select: { appointment_date: true, appointment_time: true, reason: true } },
        patients: { include: { users: { select: { name: true, email: true } } } },
      },
      orderBy: { payment_date: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    const result = payments.map(p => ({
      ...p,
      patient_name: p.patients?.users?.name,
      patient_email: p.patients?.users?.email,
      patients: undefined,
    }));

    res.json({ success: true, data: { payments: result } });
  } catch (error) {
    console.error('Get hospital payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payments' });
  }
});

// GET /api/hospital-dashboard/employees
router.get('/employees', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const employees = await prisma.hospital_employees.findMany({
      where: { hospital_id: req.user.hospital_id, status: 'active' },
      orderBy: { created_at: 'desc' },
    });
    res.json({ success: true, data: { employees } });
  } catch (error) {
    console.error('Get hospital employees error:', error);
    res.status(500).json({ success: false, message: 'Failed to get employees' });
  }
});

// GET /api/hospital-dashboard/activity
router.get('/activity', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const appointments = await prisma.appointments.findMany({
      where: { hospital_id: hospitalId },
      include: { patients: { include: { users: { select: { name: true } } } } },
      orderBy: { updated_at: 'desc' },
      take: 25,
    });

    const activities = appointments.map(a => ({
      type: 'appointment',
      reference_id: a.id,
      description: `Appointment ${a.status} for ${a.patients?.users?.name}`,
      activity_date: a.updated_at,
      patient_name: a.patients?.users?.name,
    }));

    res.json({ success: true, data: { activities } });
  } catch (error) {
    console.error('Get hospital activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to get activity logs' });
  }
});

// GET /api/hospital-dashboard/statistics
router.get('/statistics', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const [appointmentStats] = await Promise.all([
      prisma.appointments.groupBy({
        by: ['status'],
        where: { hospital_id: hospitalId },
        _count: { id: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        monthlyRevenue: [],
        appointmentStats: appointmentStats.map(s => ({ status: s.status, count: s._count.id })),
        patientDemographics: [],
      }
    });
  } catch (error) {
    console.error('Get hospital statistics error:', error);
    res.status(500).json({ success: false, message: 'Failed to get statistics' });
  }
});

module.exports = router;
