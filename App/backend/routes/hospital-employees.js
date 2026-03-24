const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { authenticateToken, authorize } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/hospital-employees
// @desc    Get employees for the current hospital
// @access  Private (Hospital Admin only)
router.get('/', 
  authenticateToken,
  authorize('hospital_admin'),
  async (req, res) => {
    try {
      const { page = 1, limit = 10, search, department, status } = req.query;
      const offset = (page - 1) * limit;

      // Get hospital ID based on user type
      let hospitalId;
      if (req.user.isHospital) {
        hospitalId = req.user.id;
      } else {
        // Get hospital ID from admin_id
        const [hospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ?',
          [req.user.id]
        );
        if (hospitals.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Hospital not found'
          });
        }
        hospitalId = hospitals[0].id;
      }

      let query = `
        SELECT he.*, h.name as hospital_name
        FROM hospital_employees he
        JOIN hospitals h ON he.hospital_id = h.id
        WHERE he.hospital_id = ?
      `;
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM hospital_employees he
        WHERE he.hospital_id = ?
      `;
      let queryParams = [hospitalId];

      // Add search filter
      if (search) {
        query += ' AND (he.name LIKE ? OR he.email LIKE ? OR he.position LIKE ?)';
        countQuery += ' AND (he.name LIKE ? OR he.email LIKE ? OR he.position LIKE ?)';
        queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Add department filter
      if (department) {
        query += ' AND he.department LIKE ?';
        countQuery += ' AND he.department LIKE ?';
        queryParams.push(`%${department}%`);
      }

      // Add status filter
      if (status) {
        query += ' AND he.status = ?';
        countQuery += ' AND he.status = ?';
        queryParams.push(status);
      }

      query += ' ORDER BY he.created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(parseInt(limit), parseInt(offset));

      // Get employees
      const [employees] = await pool.execute(query, queryParams);
      
      // Get total count
      const [countResult] = await pool.execute(countQuery, queryParams.slice(0, -2));
      const total = countResult[0].total;

      res.json({
        success: true,
        data: {
          employees,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get hospital employees error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get hospital employees'
      });
    }
  }
);

// @route   POST /api/hospital-employees
// @desc    Add new employee to hospital
// @access  Private (Hospital Admin only)
router.post('/', 
  authenticateToken,
  authorize('hospital_admin'),
  async (req, res) => {
    try {
      const {
        name, email, phone, position, department, employee_id,
        hire_date, salary, employment_type, shift, qualifications,
        emergency_contact_name, emergency_contact_phone, address
      } = req.body;

      // Validation
      if (!name || !position || !department) {
        return res.status(400).json({
          success: false,
          message: 'Name, position, and department are required'
        });
      }

      // Get hospital ID based on user type
      let hospitalId;
      if (req.user.isHospital) {
        hospitalId = req.user.id;
      } else {
        const [hospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ?',
          [req.user.id]
        );
        if (hospitals.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Hospital not found'
          });
        }
        hospitalId = hospitals[0].id;
      }

      // Check if employee_id already exists in this hospital
      if (employee_id) {
        const [existingEmployee] = await pool.execute(
          'SELECT id FROM hospital_employees WHERE hospital_id = ? AND employee_id = ?',
          [hospitalId, employee_id]
        );
        if (existingEmployee.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Employee ID already exists in this hospital'
          });
        }
      }

      // Create employee
      const [result] = await pool.execute(`
        INSERT INTO hospital_employees (
          hospital_id, name, email, phone, position, department, employee_id,
          hire_date, salary, employment_type, shift, qualifications,
          emergency_contact_name, emergency_contact_phone, address, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        hospitalId, name, email, phone, position, department, employee_id,
        hire_date, salary, employment_type || 'full_time', shift || 'morning',
        qualifications, emergency_contact_name, emergency_contact_phone, address, 'active'
      ]);

      // Get created employee with hospital details
      const [newEmployee] = await pool.execute(`
        SELECT he.*, h.name as hospital_name
        FROM hospital_employees he
        JOIN hospitals h ON he.hospital_id = h.id
        WHERE he.id = ?
      `, [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Employee added successfully',
        data: {
          employee: newEmployee[0]
        }
      });

    } catch (error) {
      console.error('Add hospital employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add employee'
      });
    }
  }
);

// @route   GET /api/hospital-employees/:id
// @desc    Get employee by ID (only from own hospital)
// @access  Private (Hospital Admin only)
router.get('/:id', 
  authenticateToken,
  authorize('hospital_admin'),
  async (req, res) => {
    try {
      const employeeId = req.params.id;

      // Get hospital ID based on user type
      let hospitalId;
      if (req.user.isHospital) {
        hospitalId = req.user.id;
      } else {
        const [hospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ?',
          [req.user.id]
        );
        if (hospitals.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Hospital not found'
          });
        }
        hospitalId = hospitals[0].id;
      }

      // Get employee (only from own hospital)
      const [employees] = await pool.execute(`
        SELECT he.*, h.name as hospital_name
        FROM hospital_employees he
        JOIN hospitals h ON he.hospital_id = h.id
        WHERE he.id = ? AND he.hospital_id = ?
      `, [employeeId, hospitalId]);

      if (employees.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      res.json({
        success: true,
        data: {
          employee: employees[0]
        }
      });

    } catch (error) {
      console.error('Get hospital employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get employee'
      });
    }
  }
);

// @route   PUT /api/hospital-employees/:id
// @desc    Update employee (only from own hospital)
// @access  Private (Hospital Admin only)
router.put('/:id', 
  authenticateToken,
  authorize('hospital_admin'),
  async (req, res) => {
    try {
      const employeeId = req.params.id;
      const {
        name, email, phone, position, department, employee_id,
        hire_date, termination_date, salary, employment_type, shift,
        qualifications, emergency_contact_name, emergency_contact_phone,
        address, status
      } = req.body;

      // Get hospital ID based on user type
      let hospitalId;
      if (req.user.isHospital) {
        hospitalId = req.user.id;
      } else {
        const [hospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ?',
          [req.user.id]
        );
        if (hospitals.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Hospital not found'
          });
        }
        hospitalId = hospitals[0].id;
      }

      // Check if employee exists and belongs to this hospital
      const [existingEmployee] = await pool.execute(
        'SELECT id FROM hospital_employees WHERE id = ? AND hospital_id = ?',
        [employeeId, hospitalId]
      );

      if (existingEmployee.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Check if employee_id already exists (excluding current employee)
      if (employee_id) {
        const [duplicateEmployee] = await pool.execute(
          'SELECT id FROM hospital_employees WHERE hospital_id = ? AND employee_id = ? AND id != ?',
          [hospitalId, employee_id, employeeId]
        );
        if (duplicateEmployee.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Employee ID already exists in this hospital'
          });
        }
      }

      // Update employee
      await pool.execute(`
        UPDATE hospital_employees SET 
        name = ?, email = ?, phone = ?, position = ?, department = ?, employee_id = ?,
        hire_date = ?, termination_date = ?, salary = ?, employment_type = ?, shift = ?,
        qualifications = ?, emergency_contact_name = ?, emergency_contact_phone = ?,
        address = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        name, email, phone, position, department, employee_id,
        hire_date, termination_date, salary, employment_type, shift,
        qualifications, emergency_contact_name, emergency_contact_phone,
        address, status, employeeId
      ]);

      // Get updated employee
      const [updatedEmployee] = await pool.execute(`
        SELECT he.*, h.name as hospital_name
        FROM hospital_employees he
        JOIN hospitals h ON he.hospital_id = h.id
        WHERE he.id = ?
      `, [employeeId]);

      res.json({
        success: true,
        message: 'Employee updated successfully',
        data: {
          employee: updatedEmployee[0]
        }
      });

    } catch (error) {
      console.error('Update hospital employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update employee'
      });
    }
  }
);

// @route   DELETE /api/hospital-employees/:id
// @desc    Delete employee (only from own hospital)
// @access  Private (Hospital Admin only)
router.delete('/:id', 
  authenticateToken,
  authorize('hospital_admin'),
  async (req, res) => {
    try {
      const employeeId = req.params.id;

      // Get hospital ID based on user type
      let hospitalId;
      if (req.user.isHospital) {
        hospitalId = req.user.id;
      } else {
        const [hospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ?',
          [req.user.id]
        );
        if (hospitals.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Hospital not found'
          });
        }
        hospitalId = hospitals[0].id;
      }

      // Check if employee exists and belongs to this hospital
      const [existingEmployee] = await pool.execute(
        'SELECT id FROM hospital_employees WHERE id = ? AND hospital_id = ?',
        [employeeId, hospitalId]
      );

      if (existingEmployee.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      // Delete employee
      await pool.execute(
        'DELETE FROM hospital_employees WHERE id = ?',
        [employeeId]
      );

      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });

    } catch (error) {
      console.error('Delete hospital employee error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete employee'
      });
    }
  }
);

// @route   GET /api/hospital-employees/stats/dashboard
// @desc    Get employee statistics for hospital dashboard
// @access  Private (Hospital Admin only)
router.get('/stats/dashboard', 
  authenticateToken,
  authorize('hospital_admin'),
  async (req, res) => {
    try {
      // Get hospital ID based on user type
      let hospitalId;
      if (req.user.isHospital) {
        hospitalId = req.user.id;
      } else {
        const [hospitals] = await pool.execute(
          'SELECT id FROM hospitals WHERE admin_id = ?',
          [req.user.id]
        );
        if (hospitals.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Hospital not found'
          });
        }
        hospitalId = hospitals[0].id;
      }

      // Get employee statistics
      const [stats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_employees,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_employees,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_employees,
          COUNT(CASE WHEN status = 'on_leave' THEN 1 END) as on_leave_employees,
          COUNT(CASE WHEN employment_type = 'full_time' THEN 1 END) as full_time_employees,
          COUNT(CASE WHEN employment_type = 'part_time' THEN 1 END) as part_time_employees,
          COUNT(DISTINCT department) as total_departments
        FROM hospital_employees 
        WHERE hospital_id = ?
      `, [hospitalId]);

      // Get department breakdown
      const [departments] = await pool.execute(`
        SELECT 
          department,
          COUNT(*) as employee_count,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
        FROM hospital_employees 
        WHERE hospital_id = ?
        GROUP BY department
        ORDER BY employee_count DESC
      `, [hospitalId]);

      res.json({
        success: true,
        data: {
          statistics: stats[0],
          departments
        }
      });

    } catch (error) {
      console.error('Get employee stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get employee statistics'
      });
    }
  }
);

module.exports = router;