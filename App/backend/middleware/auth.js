const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if this is a hospital token
    if (decoded.isHospital) {
      // Get hospital from database
      const [hospitals] = await pool.execute(
        'SELECT id, name, contact_email as email, status FROM hospitals WHERE id = ?',
        [decoded.userId]
      );

      if (hospitals.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token - hospital not found'
        });
      }

      const hospital = hospitals[0];

      if (hospital.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Hospital account is inactive'
        });
      }

      req.user = {
        id: hospital.id,
        email: hospital.email,
        name: hospital.name,
        role: 'hospital_admin',
        status: hospital.status,
        isHospital: true
      };
    } else {
      // Get user from database
      const [users] = await pool.execute(
        'SELECT id, email, name, role, status FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token - user not found'
        });
      }

      const user = users[0];

      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is inactive'
        });
      }

      req.user = user;
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Hospital admin authorization (can only access their own hospital data)
const authorizeHospitalAdmin = async (req, res, next) => {
  try {
    if (req.user.role === 'super_admin') {
      return next(); // Super admin can access all hospitals
    }

    if (req.user.role !== 'hospital_admin') {
      return res.status(403).json({
        success: false,
        message: 'Hospital admin access required'
      });
    }

    // For hospital dashboard routes, get hospital ID from user's hospital association
    if (req.user.isHospital) {
      req.user.hospital_id = req.user.id;
    } else {
      // Get hospital ID from user's admin relationship
      const [hospitals] = await pool.execute(
        'SELECT id FROM hospitals WHERE admin_id = ?',
        [req.user.id]
      );

      if (hospitals.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'No hospital associated with this admin account'
        });
      }

      req.user.hospital_id = hospitals[0].id;
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

// Patient authorization (can only access their own data)
const authorizePatient = async (req, res, next) => {
  try {
    if (req.user.role === 'super_admin') {
      return next(); // Super admin can access all patient data
    }

    if (req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Patient access required'
      });
    }

    // Get patient ID from request params or body
    const patientId = req.params.patientId || req.body.patientId;
    
    if (patientId) {
      // Check if user owns this patient record
      const [patients] = await pool.execute(
        'SELECT id FROM patients WHERE id = ? AND user_id = ?',
        [patientId, req.user.id]
      );

      if (patients.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied - not authorized for this patient record'
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};

module.exports = {
  generateToken,
  authenticateToken,
  authorize,
  authorizeHospitalAdmin,
  authorizePatient
};