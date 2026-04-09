const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');
const { uploadSingle, getFileUrl, deleteFile } = require('../middleware/upload');
const router = express.Router();

const parseJson = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return []; }
};

const formatHospital = (h) => ({
  ...h,
  specialties: parseJson(h.specialties),
  accreditations: parseJson(h.accreditations),
});

// GET /api/hospitals/search
router.get('/search', async (req, res) => {
  try {
    const { page = 1, limit = 100, name, location, specialization, city, state } = req.query;

    const where = { status: 'active' };
    if (name) where.name = { contains: name };
    if (location || city) where.city = { contains: location || city };
    if (state) where.state = { contains: state };

    const [hospitals, total] = await Promise.all([
      prisma.hospitals.findMany({
        where,
        include: { users: { select: { name: true, email: true } } },
        orderBy: { name: 'asc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.hospitals.count({ where }),
    ]);

    let results = hospitals.map(h => ({
      ...formatHospital(h),
      admin_name: h.users?.name || null,
      admin_email: h.users?.email || null,
      users: undefined,
    }));

    // Filter by specialization in JS (JSON field)
    if (specialization) {
      results = results.filter(h =>
        h.specialties.some(s => s.toLowerCase().includes(specialization.toLowerCase()))
      );
    }

    res.json({
      success: true,
      data: {
        hospitals: results,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
      }
    });
  } catch (error) {
    console.error('Search hospitals error:', error);
    res.status(500).json({ success: false, message: 'Failed to search hospitals' });
  }
});

// GET /api/hospitals
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, city, state, country, specialty, status = 'active' } = req.query;

    const where = { status };
    if (city) where.city = { contains: city };
    if (state) where.state = { contains: state };
    if (country) where.country = { contains: country };

    const [hospitals, total] = await Promise.all([
      prisma.hospitals.findMany({
        where,
        include: { users: { select: { name: true, email: true } } },
        orderBy: { created_at: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.hospitals.count({ where }),
    ]);

    let results = hospitals.map(h => ({
      ...formatHospital(h),
      admin_name: h.users?.name || null,
      admin_email: h.users?.email || null,
      users: undefined,
    }));

    if (specialty) {
      results = results.filter(h =>
        h.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }

    res.json({
      success: true,
      data: {
        hospitals: results,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
      }
    });
  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({ success: false, message: 'Failed to get hospitals' });
  }
});

// GET /api/hospitals/:id
router.get('/:id', async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id);

    const hospital = await prisma.hospitals.findUnique({
      where: { id: hospitalId },
      include: { users: { select: { name: true, email: true } } },
    });

    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    const stats = await prisma.appointments.aggregate({
      where: { hospital_id: hospitalId },
      _count: { id: true },
    });

    const completed = await prisma.appointments.count({
      where: { hospital_id: hospitalId, status: 'completed' },
    });

    res.json({
      success: true,
      data: {
        hospital: {
          ...formatHospital(hospital),
          admin_name: hospital.users?.name || null,
          admin_email: hospital.users?.email || null,
          users: undefined,
        },
        doctors: [],
        statistics: {
          total_appointments: stats._count.id,
          completed_appointments: completed,
          total_patients: 0,
          total_revenue: 0,
        }
      }
    });
  } catch (error) {
    console.error('Get hospital error:', error);
    res.status(500).json({ success: false, message: 'Failed to get hospital' });
  }
});

// POST /api/hospitals
router.post('/', authenticateToken, authorize('super_admin'), uploadSingle('logo'), async (req, res) => {
  try {
    const { name, email, phone, address, city, state, country = 'India',
      specialties, accreditations = [], commission_rate = 8.00, description, admin_id } = req.body;

    let logo_url = null;
    if (req.file) logo_url = getFileUrl(req, req.file.filename);

    if (admin_id) {
      const adminUser = await prisma.users.findFirst({
        where: { id: parseInt(admin_id), role: 'hospital_admin' }
      });
      if (!adminUser) return res.status(400).json({ success: false, message: 'Invalid admin user ID or user is not a hospital admin' });
    }

    const hospital = await prisma.hospitals.create({
      data: {
        name, email, phone, address, city, state, country,
        specialties: JSON.stringify(Array.isArray(specialties) ? specialties : []),
        accreditations: JSON.stringify(Array.isArray(accreditations) ? accreditations : []),
        logo_url, description,
        admin_id: admin_id ? parseInt(admin_id) : null,
        status: 'pending',
      }
    });

    res.status(201).json({ success: true, message: 'Hospital created successfully', data: { hospital: formatHospital(hospital) } });
  } catch (error) {
    console.error('Create hospital error:', error);
    res.status(500).json({ success: false, message: 'Failed to create hospital' });
  }
});

// PUT /api/hospitals/:id
router.put('/:id', authenticateToken, uploadSingle('logo'), async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id);
    const { name, email, phone, address, city, state, country,
      specialties, accreditations, description } = req.body;

    const existing = await prisma.hospitals.findUnique({ where: { id: hospitalId } });
    if (!existing) return res.status(404).json({ success: false, message: 'Hospital not found' });

    if (req.user.role === 'hospital_admin' && existing.admin_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    } else if (!['hospital_admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    let logo_url = existing.logo_url;
    if (req.file) {
      if (logo_url) deleteFile(logo_url.replace(`${req.protocol}://${req.get('host')}/`, './'));
      logo_url = getFileUrl(req, req.file.filename);
    }

    const hospital = await prisma.hospitals.update({
      where: { id: hospitalId },
      data: {
        name, email, phone, address, city, state, country,
        specialties: JSON.stringify(Array.isArray(specialties) ? specialties : []),
        accreditations: JSON.stringify(Array.isArray(accreditations) ? accreditations : []),
        logo_url, description,
      }
    });

    res.json({ success: true, message: 'Hospital updated successfully', data: { hospital: formatHospital(hospital) } });
  } catch (error) {
    console.error('Update hospital error:', error);
    res.status(500).json({ success: false, message: 'Failed to update hospital' });
  }
});

// PUT /api/hospitals/:id/status
router.put('/:id/status', authenticateToken, authorize('super_admin'), async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id);
    const { status } = req.body;

    if (!['active', 'pending', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await prisma.hospitals.update({ where: { id: hospitalId }, data: { status } });
    res.json({ success: true, message: 'Hospital status updated successfully' });
  } catch (error) {
    console.error('Update hospital status error:', error);
    res.status(500).json({ success: false, message: 'Failed to update hospital status' });
  }
});

// DELETE /api/hospitals/:id
router.delete('/:id', authenticateToken, authorize('super_admin'), async (req, res) => {
  try {
    const hospitalId = parseInt(req.params.id);
    const hospital = await prisma.hospitals.findUnique({ where: { id: hospitalId } });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    await prisma.hospitals.delete({ where: { id: hospitalId } });

    if (hospital.logo_url) {
      deleteFile(hospital.logo_url.replace(`${req.protocol}://${req.get('host')}/`, './'));
    }

    res.json({ success: true, message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error('Delete hospital error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete hospital' });
  }
});

module.exports = router;
