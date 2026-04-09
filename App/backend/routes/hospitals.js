const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorize, authorizeHospitalAdmin } = require('../middleware/auth');
const { validateHospitalCreation, validateId, validatePagination } = require('../middleware/validation');
const { uploadSingle, getFileUrl, deleteFile } = require('../middleware/upload');
const router = express.Router();

// @route   GET /api/hospitals/search
// @desc    Search hospitals
// @access  Public
router.get('/search', validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, name, location, specialization, city, state } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT h.*, u.name as admin_name, u.email as admin_email 
      FROM hospitals h 
      LEFT JOIN users u ON h.admin_id = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM hospitals h';
    let queryParams = [];
    let conditions = ['h.status = "active"'];

    // Add search filters
    if (name) {
      conditions.push('h.name LIKE ?');
      queryParams.push(`%${name}%`);
    }
    if (location || city) {
      const searchLocation = location || city;
      conditions.push('(h.city LIKE ? OR h.address LIKE ?)');
      queryParams.push(`%${searchLocation}%`, `%${searchLocation}%`);
    }
    if (state) {
      conditions.push('h.state LIKE ?');
      queryParams.push(`%${state}%`);
    }
    if (specialization) {
      conditions.push('h.specialties LIKE ?');
      queryParams.push(`%${specialization}%`);
    }

    const whereClause = ' WHERE ' + conditions.join(' AND ');
    query += whereClause;
    countQuery += whereClause;

    query += ` ORDER BY h.name ASC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

    // Get hospitals
    const [hospitals] = await pool.execute(query, queryParams);
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, queryParams);
    const total = countResult[0].total;

    // Parse JSON fields safely
    hospitals.forEach(hospital => {
      if (hospital.specialties) {
        try {
          hospital.specialties = JSON.parse(hospital.specialties);
        } catch (e) {
          console.warn('Invalid JSON in specialties:', hospital.specialties);
          hospital.specialties = [];
        }
      } else {
        hospital.specialties = [];
      }
      
      if (hospital.accreditations) {
        try {
          hospital.accreditations = JSON.parse(hospital.accreditations);
        } catch (e) {
          console.warn('Invalid JSON in accreditations:', hospital.accreditations);
          hospital.accreditations = [];
        }
      } else {
        hospital.accreditations = [];
      }
    });

    res.json({
      success: true,
      data: {
        hospitals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Search hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search hospitals'
    });
  }
});

// @route   GET /api/hospitals
// @desc    Get all hospitals
// @access  Public
router.get('/', validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, city, state, country, specialty, status = 'active' } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT h.*, u.name as admin_name, u.email as admin_email 
      FROM hospitals h 
      LEFT JOIN users u ON h.admin_id = u.id
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM hospitals h';
    let queryParams = [];
    let conditions = ['h.status = ?'];
    queryParams.push(status);

    // Add filters
    if (city) {
      conditions.push('h.city LIKE ?');
      queryParams.push(`%${city}%`);
    }
    if (state) {
      conditions.push('h.state LIKE ?');
      queryParams.push(`%${state}%`);
    }
    if (country) {
      conditions.push('h.country LIKE ?');
      queryParams.push(`%${country}%`);
    }
    if (specialty) {
      conditions.push('JSON_CONTAINS(h.specialties, ?)');
      queryParams.push(`"${specialty}"`);
    }

    const whereClause = ' WHERE ' + conditions.join(' AND ');
    query += whereClause;
    countQuery += whereClause;

    query += ` ORDER BY h.created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    // Get hospitals
    const [hospitals] = await pool.execute(query, queryParams);
    
    // Get total count
    const [countResult] = await pool.execute(countQuery, queryParams);
    const total = countResult[0].total;

    // Parse JSON fields safely
    hospitals.forEach(hospital => {
      if (hospital.specialties) {
        try {
          hospital.specialties = JSON.parse(hospital.specialties);
        } catch (e) {
          hospital.specialties = [];
        }
      } else {
        hospital.specialties = [];
      }
      
      if (hospital.accreditations) {
        try {
          hospital.accreditations = JSON.parse(hospital.accreditations);
        } catch (e) {
          hospital.accreditations = [];
        }
      } else {
        hospital.accreditations = [];
      }
    });

    res.json({
      success: true,
      data: {
        hospitals,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hospitals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/hospitals/:id
// @desc    Get hospital by ID
// @access  Public
router.get('/:id', validateId, async (req, res) => {
  try {
    const hospitalId = req.params.id;

    const [hospitals] = await pool.execute(`
      SELECT h.*, u.name as admin_name, u.email as admin_email 
      FROM hospitals h 
      LEFT JOIN users u ON h.admin_id = u.id 
      WHERE h.id = ?
    `, [hospitalId]);

    if (hospitals.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    const hospital = hospitals[0];

    // Parse JSON fields safely
    if (hospital.specialties) {
      try {
        hospital.specialties = JSON.parse(hospital.specialties);
      } catch (e) {
        console.warn('Invalid JSON in specialties:', hospital.specialties);
        hospital.specialties = [];
      }
    } else {
      hospital.specialties = [];
    }
    
    if (hospital.accreditations) {
      try {
        hospital.accreditations = JSON.parse(hospital.accreditations);
      } catch (e) {
        console.warn('Invalid JSON in accreditations:', hospital.accreditations);
        hospital.accreditations = [];
      }
    } else {
      hospital.accreditations = [];
    }

    // Get hospital statistics
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT p.id) as total_patients,
        COUNT(DISTINCT a.id) as total_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
        COALESCE(SUM(pay.amount), 0) as total_revenue
      FROM hospitals h
      LEFT JOIN appointments a ON h.id = a.hospital_id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN payments pay ON a.id = pay.appointment_id AND pay.payment_status = 'completed'
      WHERE h.id = ?
    `, [hospitalId]);

    res.json({
      success: true,
      data: {
        hospital,
        doctors: [],
        statistics: stats[0]
      }
    });

  } catch (error) {
    console.error('Get hospital error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get hospital'
    });
  }
});

// @route   POST /api/hospitals
// @desc    Create new hospital
// @access  Private (Super Admin)
router.post('/', 
  authenticateToken, 
  authorize('super_admin'), 
  uploadSingle('logo'),
  validateHospitalCreation, 
  async (req, res) => {
    try {
      const {
        name, email, phone, address, city, state, country = 'India',
        specialties, accreditations = [], commission_rate = 8.00,
        description, admin_id
      } = req.body;

      let logo_url = null;
      if (req.file) {
        logo_url = getFileUrl(req, req.file.filename);
      }

      // Verify admin user exists and is hospital_admin
      if (admin_id) {
        const [adminUsers] = await pool.execute(
          'SELECT id, role FROM users WHERE id = ? AND role = "hospital_admin"',
          [admin_id]
        );

        if (adminUsers.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Invalid admin user ID or user is not a hospital admin'
          });
        }
      }

      // Insert hospital
      const [result] = await pool.execute(`
        INSERT INTO hospitals 
        (name, email, phone, address, city, state, country, specialties, accreditations, 
         commission_rate, logo_url, description, admin_id, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `, [
        name, email, phone, address, city, state, country,
        JSON.stringify(specialties), JSON.stringify(accreditations),
        commission_rate, logo_url, description, admin_id
      ]);

      const hospitalId = result.insertId;

      // Get created hospital
      const [hospitals] = await pool.execute(
        'SELECT * FROM hospitals WHERE id = ?',
        [hospitalId]
      );

      const hospital = hospitals[0];
      
      // Parse JSON fields safely
      if (hospital.specialties) {
        try {
          hospital.specialties = JSON.parse(hospital.specialties);
        } catch (e) {
          console.warn('Invalid JSON in specialties:', hospital.specialties);
          hospital.specialties = [];
        }
      } else {
        hospital.specialties = [];
      }
      
      if (hospital.accreditations) {
        try {
          hospital.accreditations = JSON.parse(hospital.accreditations);
        } catch (e) {
          console.warn('Invalid JSON in accreditations:', hospital.accreditations);
          hospital.accreditations = [];
        }
      } else {
        hospital.accreditations = [];
      }

      res.status(201).json({
        success: true,
        message: 'Hospital created successfully',
        data: { hospital }
      });

    } catch (error) {
      console.error('Create hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create hospital'
      });
    }
  }
);

// @route   PUT /api/hospitals/:id
// @desc    Update hospital
// @access  Private (Super Admin or Hospital Admin)
router.put('/:id', 
  authenticateToken, 
  validateId,
  uploadSingle('logo'),
  async (req, res) => {
    try {
      const hospitalId = req.params.id;
      const {
        name, email, phone, address, city, state, country,
        specialties, accreditations, commission_rate, description
      } = req.body;

      // Check authorization
      if (req.user.role === 'hospital_admin') {
        const [hospitals] = await pool.execute(
          'SELECT admin_id FROM hospitals WHERE id = ?',
          [hospitalId]
        );

        if (hospitals.length === 0 || hospitals[0].admin_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }
      } else if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      // Get current hospital data
      const [currentHospitals] = await pool.execute(
        'SELECT logo_url FROM hospitals WHERE id = ?',
        [hospitalId]
      );

      if (currentHospitals.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found'
        });
      }

      let logo_url = currentHospitals[0].logo_url;

      // Handle logo upload
      if (req.file) {
        // Delete old logo if exists
        if (logo_url) {
          const oldLogoPath = logo_url.replace(`${req.protocol}://${req.get('host')}/`, './');
          deleteFile(oldLogoPath);
        }
        logo_url = getFileUrl(req, req.file.filename);
      }

      // Update hospital
      await pool.execute(`
        UPDATE hospitals SET 
        name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, country = ?,
        specialties = ?, accreditations = ?, commission_rate = ?, logo_url = ?, 
        description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        name, email, phone, address, city, state, country,
        JSON.stringify(specialties), JSON.stringify(accreditations),
        commission_rate, logo_url, description, hospitalId
      ]);

      // Get updated hospital
      const [hospitals] = await pool.execute(
        'SELECT * FROM hospitals WHERE id = ?',
        [hospitalId]
      );

      const hospital = hospitals[0];
      
      // Parse JSON fields safely
      if (hospital.specialties) {
        try {
          hospital.specialties = JSON.parse(hospital.specialties);
        } catch (e) {
          console.warn('Invalid JSON in specialties:', hospital.specialties);
          hospital.specialties = [];
        }
      } else {
        hospital.specialties = [];
      }
      
      if (hospital.accreditations) {
        try {
          hospital.accreditations = JSON.parse(hospital.accreditations);
        } catch (e) {
          console.warn('Invalid JSON in accreditations:', hospital.accreditations);
          hospital.accreditations = [];
        }
      } else {
        hospital.accreditations = [];
      }

      res.json({
        success: true,
        message: 'Hospital updated successfully',
        data: { hospital }
      });

    } catch (error) {
      console.error('Update hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update hospital'
      });
    }
  }
);

// @route   PUT /api/hospitals/:id/status
// @desc    Update hospital status
// @access  Private (Super Admin only)
router.put('/:id/status', 
  authenticateToken, 
  authorize('super_admin'),
  validateId,
  async (req, res) => {
    try {
      const hospitalId = req.params.id;
      const { status } = req.body;

      if (!['active', 'pending', 'suspended'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be active, pending, or suspended'
        });
      }

      // Update hospital status
      const [result] = await pool.execute(
        'UPDATE hospitals SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, hospitalId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found'
        });
      }

      res.json({
        success: true,
        message: 'Hospital status updated successfully'
      });

    } catch (error) {
      console.error('Update hospital status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update hospital status'
      });
    }
  }
);

// @route   DELETE /api/hospitals/:id
// @desc    Delete hospital
// @access  Private (Super Admin only)
router.delete('/:id', 
  authenticateToken, 
  authorize('super_admin'),
  validateId,
  async (req, res) => {
    try {
      const hospitalId = req.params.id;

      // Get hospital data for cleanup
      const [hospitals] = await pool.execute(
        'SELECT logo_url FROM hospitals WHERE id = ?',
        [hospitalId]
      );

      if (hospitals.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found'
        });
      }

      // Delete hospital (cascade will handle related records)
      await pool.execute('DELETE FROM hospitals WHERE id = ?', [hospitalId]);

      // Delete logo file if exists
      if (hospitals[0].logo_url) {
        const logoPath = hospitals[0].logo_url.replace(`${req.protocol}://${req.get('host')}/`, './');
        deleteFile(logoPath);
      }

      res.json({
        success: true,
        message: 'Hospital deleted successfully'
      });

    } catch (error) {
      console.error('Delete hospital error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete hospital'
      });
    }
  }
);

// @route   GET /api/hospitals/:id/dashboard
// @desc    Get hospital dashboard data
// @access  Private (Hospital Admin or Super Admin)
router.get('/:id/dashboard', 
  authenticateToken,
  validateId,
  async (req, res) => {
    try {
      const hospitalId = req.params.id;

      // Check authorization
      if (req.user.role === 'hospital_admin') {
        const [hospitals] = await pool.execute(
          'SELECT admin_id FROM hospitals WHERE id = ?',
          [hospitalId]
        );

        if (hospitals.length === 0 || hospitals[0].admin_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }
      } else if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      // Get dashboard statistics
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(DISTINCT p.id) as total_patients,
          COUNT(DISTINCT a.id) as total_appointments,
          COUNT(DISTINCT CASE WHEN a.status = 'scheduled' THEN a.id END) as scheduled_appointments,
          COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
          COUNT(DISTINCT CASE WHEN a.status = 'cancelled' THEN a.id END) as cancelled_appointments,
          COUNT(DISTINCT d.id) as total_doctors,
          COUNT(DISTINCT e.id) as total_employees,
          COALESCE(SUM(CASE WHEN pay.payment_status = 'completed' THEN pay.amount END), 0) as total_revenue,
          COALESCE(SUM(CASE WHEN pay.payment_status = 'completed' THEN pay.commission_amount END), 0) as total_commission
        FROM hospitals h
        LEFT JOIN appointments a ON h.id = a.hospital_id
        LEFT JOIN patients p ON a.patient_id = p.id
        LEFT JOIN doctors d ON h.id = d.hospital_id AND d.status = 'active'
        LEFT JOIN hospital_employees e ON h.id = e.hospital_id AND e.status = 'active'
        LEFT JOIN payments pay ON a.id = pay.appointment_id
        WHERE h.id = ?
      `, [hospitalId]);

      // Get recent appointments
      const [recentAppointments] = await pool.execute(`
        SELECT a.*, p.user_id, u.name as patient_name, d.name as doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE a.hospital_id = ?
        ORDER BY a.created_at DESC
        LIMIT 10
      `, [hospitalId]);

      // Get monthly revenue data (last 12 months)
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

      res.json({
        success: true,
        data: {
          statistics: stats[0],
          recentAppointments,
          monthlyRevenue
        }
      });

    } catch (error) {
      console.error('Get hospital dashboard error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get hospital dashboard data'
      });
    }
  }
);

module.exports = router;