const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateAppointmentCreation, validateId, validatePagination } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/appointments
// @desc    Get appointments (filtered by user role)
// @access  Private
router.get('/', 
  authenticateToken,
  validatePagination,
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status, hospital_id, patient_id, date_from, date_to } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT a.*, 
               p.user_id as patient_user_id, pu.name as patient_name, pu.email as patient_email,
               h.name as hospital_name, h.city as hospital_city, h.address as hospital_address
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN hospitals h ON a.hospital_id = h.id
      `;
      
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN hospitals h ON a.hospital_id = h.id
      `;

      let queryParams = [];
      let conditions = [];

      // Role-based filtering
      if (req.user.role === 'patient') {
        conditions.push('p.user_id = ?');
        queryParams.push(req.user.id);
      } else if (req.user.role === 'hospital_admin') {
        // Get hospitals managed by this admin
        const [adminHospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ?',
          [req.user.id]
        );
        
        if (adminHospitals.length === 0) {
          return res.json({
            success: true,
            data: {
              appointments: [],
              pagination: { page: 1, limit: 10, total: 0, pages: 0 }
            }
          });
        }
        
        const hospitalIds = adminHospitals.map(h => h.id);
        conditions.push(`a.hospital_id IN (${hospitalIds.map(() => '?').join(',')})`);
        queryParams.push(...hospitalIds);
      }

      // Add additional filters
      if (status) {
        conditions.push('a.status = ?');
        queryParams.push(status);
      }
      if (hospital_id && req.user.role === 'super_admin') {
        conditions.push('a.hospital_id = ?');
        queryParams.push(hospital_id);
      }
      if (patient_id && ['super_admin', 'hospital_admin'].includes(req.user.role)) {
        conditions.push('a.patient_id = ?');
        queryParams.push(patient_id);
      }
      if (date_from) {
        conditions.push('a.appointment_date >= ?');
        queryParams.push(date_from);
      }
      if (date_to) {
        conditions.push('a.appointment_date <= ?');
        queryParams.push(date_to);
      }

      if (conditions.length > 0) {
        const whereClause = ' WHERE ' + conditions.join(' AND ');
        query += whereClause;
        countQuery += whereClause;
      }

      query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;

      // Get appointments
      const [appointments] = await pool.execute(query, queryParams);
      
      // Get total count
      const [countResult] = await pool.execute(countQuery, queryParams);
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
      console.error('Get appointments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get appointments'
      });
    }
  }
);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', 
  authenticateToken,
  validateId,
  async (req, res) => {
    try {
      const appointmentId = req.params.id;

      const [appointments] = await pool.execute(`
        SELECT a.*, 
               p.user_id as patient_user_id, pu.name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
               h.name as hospital_name, h.address as hospital_address, h.city as hospital_city, h.phone as hospital_phone
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.id = ?
      `, [appointmentId]);

      if (appointments.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      const appointment = appointments[0];

      // Check authorization
      if (req.user.role === 'patient' && appointment.patient_user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      } else if (req.user.role === 'hospital_admin') {
        const [adminHospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ? AND id = ?',
          [req.user.id, appointment.hospital_id]
        );
        
        if (adminHospitals.length === 0) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }
      }

      // Get related payments
      const [payments] = await pool.execute(
        'SELECT * FROM payments WHERE appointment_id = ?',
        [appointmentId]
      );

      res.json({
        success: true,
        data: {
          appointment,
          payments
        }
      });

    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get appointment'
      });
    }
  }
);

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private (Patient)
router.post('/', 
  authenticateToken,
  authorize('patient'),
  validateAppointmentCreation,
  async (req, res) => {
    try {
      const {
        hospital_id, appointment_date, appointment_time,
        type, reason, notes, consultation_fee
      } = req.body;

      // Validate required fields
      if (!reason || !reason.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Reason for appointment is required'
        });
      }

      // Get patient ID
      const [patients] = await pool.execute(
        'SELECT id FROM patients WHERE user_id = ?',
        [req.user.id]
      );

      if (patients.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Patient profile not found'
        });
      }

      const patient_id = patients[0].id;

      // Verify hospital exists and is active
      const [hospitals] = await pool.execute(
        'SELECT id, name FROM hospitals WHERE id = ? AND status = "active"',
        [hospital_id]
      );

      if (hospitals.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Hospital not found or inactive'
        });
      }

      // Check for appointment conflicts (same patient, same date/time)
      const [conflicts] = await pool.execute(`
        SELECT id FROM appointments 
        WHERE patient_id = ? AND appointment_date = ? AND appointment_time = ? 
        AND status NOT IN ('cancelled', 'completed')
      `, [patient_id, appointment_date, appointment_time]);

      if (conflicts.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'You already have an appointment at this date and time'
        });
      }

      // Create appointment
      const [result] = await pool.execute(`
        INSERT INTO appointments 
        (patient_id, hospital_id, appointment_date, appointment_time, type, reason, notes, consultation_fee, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `, [patient_id, hospital_id, appointment_date, appointment_time, type || 'consultation', reason, notes, consultation_fee]);

      const appointmentId = result.insertId;

      // Get created appointment with details
      const [newAppointments] = await pool.execute(`
        SELECT a.*, 
               h.name as hospital_name, h.city as hospital_city
        FROM appointments a
        JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.id = ?
      `, [appointmentId]);

      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: {
          appointment: newAppointments[0]
        }
      });

    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create appointment'
      });
    }
  }
);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', 
  authenticateToken,
  validateId,
  async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const { appointment_date, appointment_time, reason, notes, status } = req.body;

      // Get appointment details
      const [appointments] = await pool.execute(`
        SELECT a.*, p.user_id as patient_user_id
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.id = ?
      `, [appointmentId]);

      if (appointments.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      const appointment = appointments[0];

      // Check authorization
      let canUpdate = false;
      if (req.user.role === 'patient' && appointment.patient_user_id === req.user.id) {
        canUpdate = true;
        // Patients can only update date, time, notes, and reason, and only if appointment is pending
        if (appointment.status !== 'pending') {
          return res.status(400).json({
            success: false,
            message: 'Can only modify pending appointments'
          });
        }
      } else if (req.user.role === 'hospital_admin') {
        const [adminHospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ? AND id = ?',
          [req.user.id, appointment.hospital_id]
        );
        canUpdate = adminHospitals.length > 0;
      } else if (req.user.role === 'super_admin') {
        canUpdate = true;
      }

      if (!canUpdate) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Build update query
      let updateFields = [];
      let updateValues = [];

      if (appointment_date) {
        updateFields.push('appointment_date = ?');
        updateValues.push(appointment_date);
      }
      if (appointment_time) {
        updateFields.push('appointment_time = ?');
        updateValues.push(appointment_time);
      }
      if (reason !== undefined) {
        updateFields.push('reason = ?');
        updateValues.push(reason);
      }
      if (notes !== undefined) {
        updateFields.push('notes = ?');
        updateValues.push(notes);
      }
      if (status && req.user.role !== 'patient') {
        if (!['pending', 'confirmed', 'completed', 'cancelled', 'no_show'].includes(status)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid status'
          });
        }
        updateFields.push('status = ?');
        updateValues.push(status);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      updateValues.push(appointmentId);

      // Update appointment
      await pool.execute(
        `UPDATE appointments SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Get updated appointment
      const [updatedAppointments] = await pool.execute(`
        SELECT a.*, 
               h.name as hospital_name, h.city as hospital_city
        FROM appointments a
        JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.id = ?
      `, [appointmentId]);

      res.json({
        success: true,
        message: 'Appointment updated successfully',
        data: {
          appointment: updatedAppointments[0]
        }
      });

    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update appointment'
      });
    }
  }
);

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', 
  authenticateToken,
  validateId,
  async (req, res) => {
    try {
      const appointmentId = req.params.id;

      // Get appointment details
      const [appointments] = await pool.execute(`
        SELECT a.*, p.user_id as patient_user_id
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE a.id = ?
      `, [appointmentId]);

      if (appointments.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      const appointment = appointments[0];

      // Check authorization
      let canCancel = false;
      if (req.user.role === 'patient' && appointment.patient_user_id === req.user.id) {
        canCancel = true;
      } else if (req.user.role === 'hospital_admin') {
        const [adminHospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ? AND id = ?',
          [req.user.id, appointment.hospital_id]
        );
        canCancel = adminHospitals.length > 0;
      } else if (req.user.role === 'super_admin') {
        canCancel = true;
      }

      if (!canCancel) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if appointment can be cancelled
      if (['completed', 'cancelled'].includes(appointment.status)) {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel this appointment'
        });
      }

      // Cancel appointment
      await pool.execute(
        'UPDATE appointments SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [appointmentId]
      );

      res.json({
        success: true,
        message: 'Appointment cancelled successfully'
      });

    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel appointment'
      });
    }
  }
);

// @route   GET /api/appointments/available-slots
// @desc    Get available appointment slots
// @access  Private
router.get('/available-slots', 
  authenticateToken,
  async (req, res) => {
    try {
      const { hospital_id, date } = req.query;

      if (!hospital_id || !date) {
        return res.status(400).json({
          success: false,
          message: 'Hospital ID and date are required'
        });
      }

      // Get existing appointments for the date
      const [bookedSlots] = await pool.execute(`
        SELECT appointment_time 
        FROM appointments 
        WHERE hospital_id = ? AND appointment_date = ? 
        AND status NOT IN ('cancelled', 'no_show')
      `, [hospital_id, date]);

      const bookedTimes = bookedSlots.map(slot => slot.appointment_time);

      // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
      const availableSlots = [];
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
          if (!bookedTimes.includes(timeSlot)) {
            availableSlots.push({
              time: timeSlot,
              display: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            });
          }
        }
      }

      res.json({
        success: true,
        data: {
          date,
          availableSlots
        }
      });

    } catch (error) {
      console.error('Get available slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get available slots'
      });
    }
  }
);

module.exports = router;