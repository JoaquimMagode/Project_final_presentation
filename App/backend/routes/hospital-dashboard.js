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
        include: {
          users: { select: { name: true, email: true, phone: true } },
          appointments: {
            where: { hospital_id: hospitalId },
            select: { appointment_date: true, status: true, consultation_fee: true },
            orderBy: { appointment_date: 'desc' },
          },
          payments: {
            where: { hospital_id: hospitalId, payment_status: 'completed' },
            select: { amount: true },
          },
        },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.patients.count({ where }),
    ]);

    const result = patients.map(p => ({
      id: p.id,
      name: p.users?.name,
      email: p.users?.email,
      phone: p.users?.phone,
      gender: p.gender,
      date_of_birth: p.date_of_birth,
      address: p.address,
      blood_group: p.blood_group,
      allergies: p.allergies,
      medical_history: p.medical_history,
      emergency_contact_name: p.emergency_contact_name,
      emergency_contact_phone: p.emergency_contact_phone,
      total_appointments: p.appointments.length,
      last_visit: p.appointments[0]?.appointment_date || null,
      total_paid: p.payments.reduce((sum, pay) => sum + Number(pay.amount), 0),
    }));

    res.json({
      success: true,
      data: { patients: result, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) {
    console.error('Get hospital patients error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patients' });
  }
});

// GET /api/hospital-dashboard/patients/:id
router.get('/patients/:id', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const patientId = parseInt(req.params.id);

    const patient = await prisma.patients.findUnique({
      where: { id: patientId },
      include: {
        users: { select: { name: true, email: true, phone: true } },
        appointments: {
          where: { hospital_id: hospitalId },
          orderBy: { appointment_date: 'desc' },
        },
        payments: {
          where: { hospital_id: hospitalId },
          orderBy: { created_at: 'desc' },
        },
        patient_documents: {
          orderBy: { uploaded_at: 'desc' },
        },
        medical_reports: {
          where: { hospital_id: hospitalId },
          orderBy: { report_date: 'desc' },
          select: {
            id: true,
            title: true,
            report_type: true,
            file_url: true,
            file_type: true,
            report_date: true,
            description: true,
          },
        },
      },
    });

    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

    res.json({
      success: true,
      data: {
        patient: {
          id: patient.id,
          name: patient.users?.name,
          email: patient.users?.email,
          phone: patient.users?.phone,
          gender: patient.gender,
          date_of_birth: patient.date_of_birth,
          address: patient.address,
          blood_group: patient.blood_group,
          allergies: patient.allergies,
          medical_history: patient.medical_history,
          emergency_contact_name: patient.emergency_contact_name,
          emergency_contact_phone: patient.emergency_contact_phone,
          total_appointments: patient.appointments.length,
          last_visit: patient.appointments[0]?.appointment_date || null,
          total_paid: patient.payments
            .filter(p => p.payment_status === 'completed')
            .reduce((sum, p) => sum + Number(p.amount), 0),
          appointments: patient.appointments,
          payments: patient.payments,
          documents: patient.patient_documents.map(d => ({
            id: d.id,
            filename: d.filename,
            original_name: d.original_name,
            category: d.category,
            mimetype: d.mimetype,
            file_size: d.file_size,
            uploaded_at: d.uploaded_at,
            url: `/uploads/documents/${d.filename}`,
          })),
          medical_reports: patient.medical_reports,
        }
      }
    });
  } catch (error) {
    console.error('Get hospital patient detail error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patient details' });
  }
});

// GET /api/hospital-dashboard/appointments
router.get('/appointments', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { page = 1, limit = 10, status, date } = req.query;

    const where = { hospital_id: hospitalId };
    if (status) where.status = status;
    if (date) {
      const start = new Date(date + 'T00:00:00.000Z');
      const end   = new Date(date + 'T23:59:59.999Z');
      where.appointment_date = { gte: start, lte: end };
    }

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
      patient_country: a.patients?.country,
      patient_city: a.patients?.city,
      patient_address: a.patients?.address,
      patient_gender: a.patients?.gender,
      patient_dob: a.patients?.date_of_birth,
      patient_blood_group: a.patients?.blood_group,
      patient_insurance_provider: a.patients?.insurance_provider,
      patient_insurance_policy: a.patients?.insurance_policy_number,
      patient_allergies: a.patients?.allergies,
      patient_medical_history: a.patients?.medical_history,
      patient_emergency_contact_name: a.patients?.emergency_contact_name,
      patient_emergency_contact_phone: a.patients?.emergency_contact_phone,
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

// GET /api/hospital-dashboard/hospital-info
// Returns hospital name, location, admin name for the welcome header
router.get('/hospital-info', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const hospital = await prisma.hospitals.findUnique({
      where: { id: hospitalId },
      include: { users: { select: { name: true } } },
    });

    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    res.json({
      success: true,
      data: {
        id: hospital.id,
        name: hospital.name,
        city: hospital.city,
        state: hospital.state,
        country: hospital.country,
        email: hospital.email,
        phone: hospital.phone,
        description: hospital.description,
        logo_url: hospital.logo_url || null,
        admin_name: hospital.users?.name || req.user.name || null,
      }
    });
  } catch (error) {
    console.error('Get hospital info error:', error);
    res.status(500).json({ success: false, message: 'Failed to get hospital info' });
  }
});

// GET /api/hospital-dashboard/chart-data?period=week|month|year
// Returns real patient trend data for the statistics chart
router.get('/chart-data', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { period = 'week' } = req.query;

    const now = new Date();
    let startDate;
    let labels = [];

    if (period === 'week') {
      // Last 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (period === 'month') {
      // Last 4 weeks
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 27);
      startDate.setHours(0, 0, 0, 0);
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      // Year — current year by month
      startDate = new Date(now.getFullYear(), 0, 1);
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    const appointments = await prisma.appointments.findMany({
      where: {
        hospital_id: hospitalId,
        appointment_date: { gte: startDate },
      },
      select: {
        appointment_date: true,
        patient_id: true,
        created_at: true,
      },
    });

    // Bucket appointments into the right label slots
    const totalBuckets = labels.length;
    const newPatients = new Array(totalBuckets).fill(0);
    const returning   = new Array(totalBuckets).fill(0);

    // Track first-ever appointment date per patient for this hospital
    const allPatientFirstVisit = await prisma.appointments.groupBy({
      by: ['patient_id'],
      where: { hospital_id: hospitalId },
      _min: { appointment_date: true },
    });
    const firstVisitMap = {};
    allPatientFirstVisit.forEach(p => {
      firstVisitMap[p.patient_id] = p._min.appointment_date;
    });

    appointments.forEach(a => {
      const apptDate = new Date(a.appointment_date);
      let bucketIndex = -1;

      if (period === 'week') {
        // 0 = Mon of the week window … bucket by day-of-week offset from startDate
        const diffDays = Math.floor((apptDate - startDate) / (1000 * 60 * 60 * 24));
        bucketIndex = diffDays >= 0 && diffDays < 7 ? diffDays : -1;
        // Map to Mon-Sun labels (startDate is 6 days ago, may not be Monday)
        // Use actual day-of-week relative to label array
        const dayOfWeek = apptDate.getDay(); // 0=Sun,1=Mon,...,6=Sat
        const dayMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
        bucketIndex = diffDays >= 0 && diffDays < 7 ? dayMap[dayOfWeek] : -1;
      } else if (period === 'month') {
        const diffDays = Math.floor((apptDate - startDate) / (1000 * 60 * 60 * 24));
        bucketIndex = Math.min(Math.floor(diffDays / 7), 3);
        if (diffDays < 0) bucketIndex = -1;
      } else {
        bucketIndex = apptDate.getMonth(); // 0–11
      }

      if (bucketIndex < 0 || bucketIndex >= totalBuckets) return;

      const firstVisit = firstVisitMap[a.patient_id];
      const isNew = firstVisit &&
        Math.abs(new Date(firstVisit) - apptDate) < 1000 * 60 * 60 * 24; // same day = first visit

      if (isNew) {
        newPatients[bucketIndex]++;
      } else {
        returning[bucketIndex]++;
      }
    });

    res.json({
      success: true,
      data: { labels, newPatients, returning, period }
    });
  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ success: false, message: 'Failed to get chart data' });
  }
});

// GET /api/hospital-dashboard/today-schedule
// Returns today's appointments as the schedule panel
router.get('/today-schedule', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay   = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const appointments = await prisma.appointments.findMany({
      where: {
        hospital_id: hospitalId,
        appointment_date: { gte: startOfDay, lte: endOfDay },
        status: { in: ['pending', 'confirmed'] },
      },
      include: {
        patients: { include: { users: { select: { name: true } } } },
      },
      orderBy: { appointment_time: 'asc' },
      take: 10,
    });

    const schedule = appointments.map(a => {
      let timeStr = '00:00';
      if (a.appointment_time) {
        if (a.appointment_time instanceof Date) {
          timeStr = a.appointment_time.toISOString().substring(11, 16);
        } else {
          // MySQL TIME string: "HH:MM:SS" or "HH:MM"
          timeStr = String(a.appointment_time).substring(0, 5);
        }
      }
      const [hh, mm] = timeStr.split(':').map(Number);
      const suffix = hh >= 12 ? 'pm' : 'am';
      const h12 = hh % 12 || 12;
      const endH = (hh + 1) % 24;
      const endSuffix = endH >= 12 ? 'pm' : 'am';
      const endH12 = endH % 12 || 12;
      return {
        id: a.id,
        time: `${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
        title: `${a.type ? a.type.charAt(0).toUpperCase() + a.type.slice(1).replace('_', ' ') : 'Appointment'} – ${a.patients?.users?.name || 'Patient'}`,
        duration: `${String(h12).padStart(2, '0')}:${String(mm).padStart(2, '0')}${suffix} – ${String(endH12).padStart(2, '0')}:${String(mm).padStart(2, '0')}${endSuffix}`,
        reason: a.reason,
        status: a.status,
        patient_name: a.patients?.users?.name || null,
        type: a.type,
      };
    });

    res.json({ success: true, data: { schedule, date: todayStr } });
  } catch (error) {
    console.error('Get today schedule error:', error);
    res.status(500).json({ success: false, message: 'Failed to get today\'s schedule' });
  }
});

// GET /api/hospital-dashboard/recent-reports
// Returns the most recent medical reports for this hospital
router.get('/recent-reports', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const reports = await prisma.medical_reports.findMany({
      where: { hospital_id: hospitalId },
      include: {
        patients: { include: { users: { select: { name: true } } } },
      },
      orderBy: { created_at: 'desc' },
      take: 5,
    });

    const result = reports.map(r => ({
      id: r.id,
      title: r.title,
      report_type: r.report_type,
      patient_name: r.patients?.users?.name || 'Unknown',
      created_at: r.created_at,
      file_url: r.file_url || null,
    }));

    res.json({ success: true, data: { reports: result } });
  } catch (error) {
    console.error('Get recent reports error:', error);
    res.status(500).json({ success: false, message: 'Failed to get recent reports' });
  }
});

module.exports = router;
