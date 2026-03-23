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

    // Get hospital ID from request params or body
    const hospitalId = req.params.hospitalId || req.body.hospitalId;
    
    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        message: 'Hospital ID required'
      });
    }

    // Check if user is admin of this hospital
    const [hospitals] = await pool.execute(
      'SELECT id FROM hospitals WHERE id = ? AND admin_id = ?',
      [hospitalId, req.user.id]
    );

    if (hospitals.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not authorized for this hospital'
      });
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