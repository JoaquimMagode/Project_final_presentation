const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isHospital) {
      const hospital = await prisma.hospitals.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, status: true }
      });

      if (!hospital) return res.status(401).json({ success: false, message: 'Invalid token - hospital not found' });
      if (hospital.status !== 'active') return res.status(401).json({ success: false, message: 'Hospital account is inactive' });

      req.user = { id: hospital.id, email: hospital.email, name: hospital.name, role: 'hospital_admin', status: hospital.status, isHospital: true, hospital_id: hospital.id };
    } else {
      const user = await prisma.users.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, role: true, status: true }
      });

      if (!user) return res.status(401).json({ success: false, message: 'Invalid token - user not found' });
      if (user.status !== 'active') return res.status(401).json({ success: false, message: 'Account is inactive' });

      req.user = { ...user };

      if (user.role === 'hospital_admin') {
        let hospital = await prisma.hospitals.findFirst({
          where: { admin_id: user.id },
          select: { id: true }
        });
        // Fallback: employee lookup by email scoped to active records
        if (!hospital) {
          const emp = await prisma.hospital_employees.findFirst({
            where: { email: user.email, status: { not: 'terminated' } }
          });
          if (emp) {
            hospital = { id: emp.hospital_id };
            req.user.employee_position = emp.position;
          }
        }
        req.user.hospital_id = hospital ? hospital.id : null;
      }
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expired' });
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    next();
  };
};

const authorizeHospitalAdmin = async (req, res, next) => {
  try {
    if (req.user.role === 'super_admin') return next();

    if (req.user.role !== 'hospital_admin') {
      return res.status(403).json({ success: false, message: 'Hospital admin access required' });
    }

    if (req.user.isHospital) req.user.hospital_id = req.user.id;

    if (!req.user.hospital_id) {
      return res.status(403).json({ success: false, message: 'No hospital associated with this admin account. Please contact super admin.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authorization check failed' });
  }
};

const authorizePatient = async (req, res, next) => {
  try {
    if (req.user.role === 'super_admin') return next();

    if (req.user.role !== 'patient') {
      return res.status(403).json({ success: false, message: 'Patient access required' });
    }

    const patientId = req.params.patientId || req.body.patientId;
    if (patientId) {
      const patient = await prisma.patients.findFirst({
        where: { id: parseInt(patientId), user_id: req.user.id },
        select: { id: true }
      });
      if (!patient) return res.status(403).json({ success: false, message: 'Access denied - not authorized for this patient record' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Authorization check failed' });
  }
};

module.exports = { generateToken, authenticateToken, authorize, authorizeHospitalAdmin, authorizePatient };
