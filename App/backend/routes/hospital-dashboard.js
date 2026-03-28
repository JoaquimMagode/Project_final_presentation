const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorizeHospitalAdmin } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/hospital-dashboard/stats
// @desc    Get hospital dashboard statistics
// @access  Private (Hospital Admin)
router.get('/stats', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT p.id) as total_patients,
        COUNT(DISTINCT a.id) as total_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'pending' THEN a.id END) as pending_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'confirmed' THEN a.id END) as confirmed_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'cancelled' THEN a.id END) as cancelled_appointments,
        COUNT(DISTINCT he.id) as total_employees,
        COALESCE(SUM(CASE WHEN pay.payment_status = 'completed' THEN pay.amount END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN pay.payment_status = 'completed' THEN pay.amount END), 0) as avg_consultation_fee
      FROM hospitals h
      LEFT JOIN appointments a ON h.id = a.hospital_id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN hospital_employees he ON h.id = he.hospital_id AND he.status = 'active'
      LEFT JOIN payments pay ON a.id = pay.appointment_id
      WHERE h.id = ?
    `, [hospitalId]);

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    console.error('Get hospital stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to get hospital statistics' });
  }
});

// @route   GET /api/hospital-dashboard/patients
// @desc    Get hospital patients
// @access  Private (Hospital Admin)
router.get('/patients', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT DISTINCT p.*, u.name, u.email, u.phone,
        COUNT(a.id) as total_appointments,
        MAX(a.appointment_date) as last_visit,
        SUM(CASE WHEN pay.payment_status = 'completed' THEN pay.amount ELSE 0 END) as total_paid
      FROM patients p
      JOIN users u ON p.user_id = u.id
      JOIN appointments a ON p.id = a.patient_id
      LEFT JOIN payments pay ON a.id = pay.appointment_id
      WHERE a.hospital_id = ?
    `;
    
    let queryParams = [hospitalId];
    
    if (search) {
      query += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    query += ` GROUP BY p.id ORDER BY MAX(a.appointment_date) DESC LIMIT ${limit} OFFSET ${offset}`;

    const [patients] = await pool.execute(query, queryParams);
    
    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM patients p
      JOIN users u ON p.user_id = u.id
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.hospital_id = ?
    `;
    
    let countParams = [hospitalId];
    if (search) {
      countQuery += ` AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    const [countResult] = await pool.execute(countQuery, countParams);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          pages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get hospital patients error:', error);
    res.status(500).json({ success: false, message: 'Failed to get patients' });
  }
});

// @route   GET /api/hospital-dashboard/appointments
// @desc    Get hospital appointments
// @access  Private (Hospital Admin)
router.get('/appointments', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { page = 1, limit = 10, status, date } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, p.user_id, u.name as patient_name, u.email as patient_email, u.phone as patient_phone
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.hospital_id = ?
    `;
    
    let queryParams = [hospitalId];
    
    if (status) {
      query += ` AND a.status = ?`;
      queryParams.push(status);
    }
    
    if (date) {
      query += ` AND a.appointment_date = ?`;
      queryParams.push(date);
    }
    
    query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ${limit} OFFSET ${offset}`;

    const [appointments] = await pool.execute(query, queryParams);

    res.json({ success: true, data: { appointments } });
  } catch (error) {
    console.error('Get hospital appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get appointments' });
  }
});

// @route   GET /api/hospital-dashboard/payments
// @desc    Get hospital payments
// @access  Private (Hospital Admin)
router.get('/payments', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT pay.*, a.appointment_date, a.appointment_time, a.reason,
        u.name as patient_name, u.email as patient_email
      FROM payments pay
      JOIN appointments a ON pay.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.hospital_id = ?
    `;
    
    let queryParams = [hospitalId];
    
    if (status) {
      query += ` AND pay.payment_status = ?`;
      queryParams.push(status);
    }
    
    query += ` ORDER BY pay.payment_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const [payments] = await pool.execute(query, queryParams);

    res.json({ success: true, data: { payments } });
  } catch (error) {
    console.error('Get hospital payments error:', error);
    res.status(500).json({ success: false, message: 'Failed to get payments' });
  }
});

// @route   GET /api/hospital-dashboard/employees
// @desc    Get hospital employees
// @access  Private (Hospital Admin)
router.get('/employees', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const [employees] = await pool.execute(`
      SELECT he.*, u.name, u.email, u.phone
      FROM hospital_employees he
      JOIN users u ON he.user_id = u.id
      WHERE he.hospital_id = ? AND he.status = 'active'
      ORDER BY he.created_at DESC
    `, [hospitalId]);

    res.json({ success: true, data: { employees } });
  } catch (error) {
    console.error('Get hospital employees error:', error);
    res.status(500).json({ success: false, message: 'Failed to get employees' });
  }
});

// @route   GET /api/hospital-dashboard/activity
// @desc    Get hospital activity logs
// @access  Private (Hospital Admin)
router.get('/activity', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    const [activities] = await pool.execute(`
      SELECT 
        'appointment' as type,
        a.id as reference_id,
        CONCAT('Appointment ', a.status, ' for ', u.name) as description,
        a.updated_at as activity_date,
        u.name as patient_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.hospital_id = ?
      
      UNION ALL
      
      SELECT 
        'payment' as type,
        pay.id as reference_id,
        CONCAT('Payment ', pay.payment_status, ' - ₹', pay.amount) as description,
        pay.payment_date as activity_date,
        u.name as patient_name
      FROM payments pay
      JOIN appointments a ON pay.appointment_id = a.id
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.hospital_id = ?
      
      ORDER BY activity_date DESC
      LIMIT 50
    `, [hospitalId, hospitalId]);

    res.json({ success: true, data: { activities } });
  } catch (error) {
    console.error('Get hospital activity error:', error);
    res.status(500).json({ success: false, message: 'Failed to get activity logs' });
  }
});

// @route   GET /api/hospital-dashboard/statistics
// @desc    Get detailed hospital statistics
// @access  Private (Hospital Admin)
router.get('/statistics', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;

    // Monthly revenue data
    const [monthlyRevenue] = await pool.execute(`
      SELECT 
        DATE_FORMAT(pay.payment_date, '%Y-%m') as month,
        COALESCE(SUM(pay.amount), 0) as revenue,
        COUNT(pay.id) as transactions
      FROM payments pay
      JOIN appointments a ON pay.appointment_id = a.id
      WHERE a.hospital_id = ? AND pay.payment_status = 'completed'
        AND pay.payment_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(pay.payment_date, '%Y-%m')
      ORDER BY month DESC
    `, [hospitalId]);

    // Appointment status distribution
    const [appointmentStats] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM appointments
      WHERE hospital_id = ?
      GROUP BY status
    `, [hospitalId]);

    // Patient demographics
    const [patientDemographics] = await pool.execute(`
      SELECT 
        CASE 
          WHEN TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) < 18 THEN 'Under 18'
          WHEN TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) BETWEEN 18 AND 35 THEN '18-35'
          WHEN TIMESTAMPDIFF(YEAR, p.date_of_birth, CURDATE()) BETWEEN 36 AND 55 THEN '36-55'
          ELSE 'Over 55'
        END as age_group,
        COUNT(DISTINCT p.id) as count
      FROM patients p
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.hospital_id = ? AND p.date_of_birth IS NOT NULL
      GROUP BY age_group
    `, [hospitalId]);

    res.json({
      success: true,
      data: {
        monthlyRevenue,
        appointmentStats,
        patientDemographics
      }
    });
  } catch (error) {
    console.error('Get hospital statistics error:', error);
    res.status(500).json({ success: false, message: 'Failed to get statistics' });
  }
});

module.exports = router;