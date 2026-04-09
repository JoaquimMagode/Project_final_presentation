const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken, authorizeHospitalAdmin } = require('../middleware/auth');
const router = express.Router();

// GET /api/hospital-employees
router.get('/', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, status } = req.query;
    const hospitalId = req.user.hospital_id;

    const where = { hospital_id: hospitalId };
    if (status) where.status = status;
    if (department) where.department = { contains: department };
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }, { position: { contains: search } }];

    const [employees, total] = await Promise.all([
      prisma.hospital_employees.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.hospital_employees.count({ where }),
    ]);

    res.json({
      success: true,
      data: { employees, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ success: false, message: 'Failed to get employees' });
  }
});

// POST /api/hospital-employees
router.post('/', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const { name, email, phone, position, department, employee_id, hire_date, salary, employment_type, shift, qualifications, status = 'active' } = req.body;
    const hospitalId = req.user.hospital_id;

    if (employee_id) {
      const existing = await prisma.hospital_employees.findFirst({ where: { hospital_id: hospitalId, employee_id } });
      if (existing) return res.status(400).json({ success: false, message: 'Employee ID already exists' });
    }

    const employee = await prisma.hospital_employees.create({
      data: {
        hospital_id: hospitalId, name, email, phone, position, department,
        employee_id: employee_id || null,
        hire_date: hire_date ? new Date(hire_date) : null,
        salary: salary || null,
        status,
      }
    });

    res.status(201).json({ success: true, message: 'Employee created successfully', data: { employee } });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ success: false, message: 'Failed to create employee' });
  }
});

// PUT /api/hospital-employees/:id
router.put('/:id', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);
    const hospitalId = req.user.hospital_id;

    const existing = await prisma.hospital_employees.findFirst({ where: { id: employeeId, hospital_id: hospitalId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Employee not found' });

    const { name, email, phone, position, department, employee_id, hire_date, salary, status } = req.body;

    const employee = await prisma.hospital_employees.update({
      where: { id: employeeId },
      data: {
        name, email, phone, position, department,
        employee_id: employee_id || null,
        hire_date: hire_date ? new Date(hire_date) : null,
        salary: salary || null,
        status: status || undefined,
      }
    });

    res.json({ success: true, message: 'Employee updated successfully', data: { employee } });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ success: false, message: 'Failed to update employee' });
  }
});

// DELETE /api/hospital-employees/:id
router.delete('/:id', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);
    const hospitalId = req.user.hospital_id;

    const existing = await prisma.hospital_employees.findFirst({ where: { id: employeeId, hospital_id: hospitalId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Employee not found' });

    await prisma.hospital_employees.update({ where: { id: employeeId }, data: { status: 'terminated' } });
    res.json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove employee' });
  }
});

// GET /api/hospital-employees/stats
router.get('/stats', authenticateToken, authorizeHospitalAdmin, async (req, res) => {
  try {
    const hospitalId = req.user.hospital_id;
    const [total, active, departments] = await Promise.all([
      prisma.hospital_employees.count({ where: { hospital_id: hospitalId } }),
      prisma.hospital_employees.count({ where: { hospital_id: hospitalId, status: 'active' } }),
      prisma.hospital_employees.groupBy({
        by: ['department'],
        where: { hospital_id: hospitalId, status: 'active' },
        _count: { id: true },
      }),
    ]);
    res.json({ success: true, data: { total, active, departments: departments.map(d => ({ department: d.department, count: d._count.id })) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get employee stats' });
  }
});

module.exports = router;
