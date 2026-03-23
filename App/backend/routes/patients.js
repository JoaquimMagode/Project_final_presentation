const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorize, authorizePatient } = require('../middleware/auth');
const { validatePatientProfile, validateId, validatePagination } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private (Super Admin or Hospital Admin)
router.get('/', 
  authenticateToken, 
  authorize('super_admin', 'hospital_admin'),
  validatePagination,
  async (req, res) => {
    try {
      const { page = 1, limit = 10, search, city, state } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT p.*, u.name, u.email, u.phone, u.status, u.created_at as user_created_at
        FROM patients p
        JOIN users u ON p.user_id = u.id
      `;
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM patients p
        JOIN users u ON p.user_id = u.id
      `;
      let queryParams = [];
      let conditions = [];

      // Add search filter
      if (search) {
        conditions.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Add location filters
      if (city) {
        conditions.push('p.city LIKE ?');
        queryParams.push(`%${city}%`);
      }
      if (state) {
        conditions.push('p.state LIKE ?');
        queryParams.push(`%${state}%`);
      }

      if (conditions.length > 0) {
        const whereClause = ' WHERE ' + conditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
      }

      query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));

      // Get patients
      const [patients] = await pool.execute(query, queryParams);
      
      // Get total count
      const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          patients,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get patients'
      });
    }
  }
);

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private (Patient themselves, Hospital Admin, or Super Admin)
router.get('/:id', 
  authenticateToken,
  validateId,
  async (req, res) => {
    try {
      const patientId = req.params.id;

      // Get patient data
      const [patients] = await pool.execute(`
        SELECT p.*, u.name, u.email, u.phone, u.status, u.created_at as user_created_at
        FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `, [patientId]);

      if (patients.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      const patient = patients[0];

      // Check authorization
      if (req.user.role === 'patient') {
        if (patient.user_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }
      } else if (!['super_admin', 'hospital_admin'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      // Get patient's appointments
      const [appointments] = await pool.execute(`
        SELECT a.*, h.name as hospital_name, d.name as doctor_name
        FROM appointments a
        JOIN hospitals h ON a.hospital_id = h.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE a.patient_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
        LIMIT 10
      `, [patientId]);

      // Get patient's medical reports
      const [reports] = await pool.execute(`
        SELECT mr.*, h.name as hospital_name, d.name as doctor_name
        FROM medical_reports mr
        LEFT JOIN hospitals h ON mr.hospital_id = h.id
        LEFT JOIN doctors d ON mr.doctor_id = d.id
        WHERE mr.patient_id = ?
        ORDER BY mr.report_date DESC, mr.created_at DESC
        LIMIT 10
      `, [patientId]);

      // Get patient's payments
      const [payments] = await pool.execute(`
        SELECT p.*, h.name as hospital_name
        FROM payments p
        JOIN hospitals h ON p.hospital_id = h.id
        WHERE p.patient_id = ?
        ORDER BY p.created_at DESC
        LIMIT 10
      `, [patientId]);

      res.json({
        success: true,
        data: {
          patient,
          appointments,
          reports,
          payments
        }
      });

    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get patient'
      });
    }
  }
);

// @route   PUT /api/patients/:id
// @desc    Update patient profile
// @access  Private (Patient themselves or Super Admin)
router.put('/:id', 
  authenticateToken,
  validateId,
  validatePatientProfile,
  async (req, res) => {
    try {
      const patientId = req.params.id;
      const {
        date_of_birth, gender, blood_group, address, city, state, country,
        emergency_contact_name, emergency_contact_phone, medical_history,
        allergies, current_medications, insurance_provider, insurance_policy_number
      } = req.body;

      // Get patient data for authorization check
      const [patients] = await pool.execute(
        'SELECT user_id FROM patients WHERE id = ?',
        [patientId]
      );

      if (patients.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      // Check authorization
      if (req.user.role === 'patient' && patients[0].user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      } else if (req.user.role !== 'super_admin' && req.user.role !== 'patient') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      // Update patient profile
      await pool.execute(`
        UPDATE patients SET 
        date_of_birth = ?, gender = ?, blood_group = ?, address = ?, city = ?, 
        state = ?, country = ?, emergency_contact_name = ?, emergency_contact_phone = ?,
        medical_history = ?, allergies = ?, current_medications = ?, 
        insurance_provider = ?, insurance_policy_number = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        date_of_birth, gender, blood_group, address, city, state, country,
        emergency_contact_name, emergency_contact_phone, medical_history,
        allergies, current_medications, insurance_provider, insurance_policy_number,
        patientId
      ]);

      // Get updated patient data
      const [updatedPatients] = await pool.execute(`
        SELECT p.*, u.name, u.email, u.phone, u.status
        FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
      `, [patientId]);

      res.json({
        success: true,
        message: 'Patient profile updated successfully',
        data: {
          patient: updatedPatients[0]
        }
      });

    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update patient profile'
      });
    }
  }
);

// @route   GET /api/patients/:id/appointments
// @desc    Get patient's appointments
// @access  Private (Patient themselves, Hospital Admin, or Super Admin)
router.get('/:id/appointments', 
  authenticateToken,
  validateId,
  validatePagination,
  async (req, res) => {
    try {
      const patientId = req.params.id;
      const { page = 1, limit = 10, status, hospital_id } = req.query;
      const offset = (page - 1) * limit;

      // Check patient exists and authorization
      const [patients] = await pool.execute(
        'SELECT user_id FROM patients WHERE id = ?',
        [patientId]
      );

      if (patients.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      if (req.user.role === 'patient' && patients[0].user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      let query = `
        SELECT a.*, h.name as hospital_name, h.city as hospital_city, 
               d.name as doctor_name, d.specialization
        FROM appointments a
        JOIN hospitals h ON a.hospital_id = h.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE a.patient_id = ?
      `;
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM appointments a
        WHERE a.patient_id = ?
      `;
      let queryParams = [patientId];

      // Add filters
      if (status) {
        query += ' AND a.status = ?';
        countQuery += ' AND a.status = ?';
        queryParams.push(status);
      }
      if (hospital_id) {
        query += ' AND a.hospital_id = ?';
        countQuery += ' AND a.hospital_id = ?';
        queryParams.push(hospital_id);
      }

      query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));

      // Get appointments
      const [appointments] = await pool.execute(query, queryParams);
      
      // Get total count
      const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          appointments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get patient appointments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get patient appointments'
      });
    }
  }
);

// @route   GET /api/patients/:id/reports
// @desc    Get patient's medical reports
// @access  Private (Patient themselves, Hospital Admin, or Super Admin)
router.get('/:id/reports', 
  authenticateToken,
  validateId,
  validatePagination,
  async (req, res) => {
    try {
      const patientId = req.params.id;
      const { page = 1, limit = 10, report_type, hospital_id } = req.query;
      const offset = (page - 1) * limit;

      // Check patient exists and authorization
      const [patients] = await pool.execute(
        'SELECT user_id FROM patients WHERE id = ?',
        [patientId]
      );

      if (patients.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      if (req.user.role === 'patient' && patients[0].user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      let query = `
        SELECT mr.*, h.name as hospital_name, d.name as doctor_name
        FROM medical_reports mr
        LEFT JOIN hospitals h ON mr.hospital_id = h.id
        LEFT JOIN doctors d ON mr.doctor_id = d.id
        WHERE mr.patient_id = ?
      `;
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM medical_reports mr
        WHERE mr.patient_id = ?
      `;
      let queryParams = [patientId];

      // Add filters
      if (report_type) {
        query += ' AND mr.report_type = ?';
        countQuery += ' AND mr.report_type = ?';
        queryParams.push(report_type);
      }
      if (hospital_id) {
        query += ' AND mr.hospital_id = ?';
        countQuery += ' AND mr.hospital_id = ?';
        queryParams.push(hospital_id);
      }

      query += ' ORDER BY mr.report_date DESC, mr.created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));

      // Get reports
      const [reports] = await pool.execute(query, queryParams);
      
      // Get total count
      const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          reports,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get patient reports error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get patient reports'
      });
    }
  }
);

// @route   GET /api/patients/:id/payments
// @desc    Get patient's payment history
// @access  Private (Patient themselves, Hospital Admin, or Super Admin)
router.get('/:id/payments', 
  authenticateToken,
  validateId,
  validatePagination,
  async (req, res) => {
    try {
      const patientId = req.params.id;
      const { page = 1, limit = 10, status, hospital_id } = req.query;
      const offset = (page - 1) * limit;

      // Check patient exists and authorization
      const [patients] = await pool.execute(
        'SELECT user_id FROM patients WHERE id = ?',
        [patientId]
      );

      if (patients.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      if (req.user.role === 'patient' && patients[0].user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      let query = `
        SELECT p.*, h.name as hospital_name, a.appointment_date, a.appointment_time
        FROM payments p
        JOIN hospitals h ON p.hospital_id = h.id
        LEFT JOIN appointments a ON p.appointment_id = a.id
        WHERE p.patient_id = ?
      `;
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM payments p
        WHERE p.patient_id = ?
      `;
      let queryParams = [patientId];

      // Add filters
      if (status) {
        query += ' AND p.payment_status = ?';
        countQuery += ' AND p.payment_status = ?';
        queryParams.push(status);
      }
      if (hospital_id) {
        query += ' AND p.hospital_id = ?';
        countQuery += ' AND p.hospital_id = ?';
        queryParams.push(hospital_id);
      }

      query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));

      // Get payments
      const [payments] = await pool.execute(query, queryParams);
      
      // Get total count
      const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          payments,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get patient payments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get patient payments'
      });
    }
  }
);

// @route   GET /api/patients/me
// @desc    Get current patient's profile
// @access  Private (Patient only)
router.get('/me', 
  authenticateToken,
  authorize('patient'),
  async (req, res) => {
    try {
      const userId = req.user.id;

      // Get patient data
      const [patients] = await pool.execute(`
        SELECT p.*, u.name, u.email, u.phone, u.status
        FROM patients p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
      `, [userId]);

      if (patients.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
      }

      res.json({
        success: true,
        data: {
          patient: patients[0]
        }
      });

    } catch (error) {
      console.error('Get current patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get patient profile'
      });
    }
  }
);

module.exports = router;