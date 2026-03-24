const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('role')
    .isIn(['patient', 'hospital_admin'])
    .withMessage('Role must be either patient or hospital_admin'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  // Patient-specific fields (optional for registration)
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('bloodType')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Valid blood type is required'),
  body('country')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Country must be at least 2 characters long'),
  body('medicalHistory')
    .optional()
    .isArray()
    .withMessage('Medical history must be an array'),
  body('allergies')
    .optional()
    .isString()
    .withMessage('Allergies must be a string'),
  body('currentMedications')
    .optional()
    .isString()
    .withMessage('Current medications must be a string'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Hospital creation validation
const validateHospitalCreation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Hospital name must be at least 2 characters long'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('country')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Country must be at least 2 characters long'),
  body('specialties')
    .isArray({ min: 1 })
    .withMessage('At least one specialty is required'),
  body('commission_rate')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Commission rate must be between 0 and 100'),
  handleValidationErrors
];

// Patient profile validation
const validatePatientProfile = [
  body('date_of_birth')
    .optional()
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('blood_group')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Valid blood group is required'),
  body('emergency_contact_phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid emergency contact phone is required'),
  handleValidationErrors
];

// Doctor creation validation
const validateDoctorCreation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Doctor name must be at least 2 characters long'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),
  body('experience_years')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience years must be between 0 and 50'),
  body('consultation_fee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a positive number'),
  handleValidationErrors
];

// Appointment creation validation
const validateAppointmentCreation = [
  body('hospital_id')
    .isInt({ min: 1 })
    .withMessage('Valid hospital ID is required'),
  body('doctor_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid doctor ID is required'),
  body('appointment_date')
    .isISO8601()
    .withMessage('Valid appointment date is required'),
  body('appointment_time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Valid appointment time is required (HH:MM format)'),
  body('type')
    .isIn(['consultation', 'procedure', 'follow_up', 'telemedicine'])
    .withMessage('Valid appointment type is required'),
  handleValidationErrors
];

// Payment validation
const validatePayment = [
  body('appointment_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid appointment ID is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('payment_method')
    .isIn(['card', 'bank_transfer', 'cash', 'insurance'])
    .withMessage('Valid payment method is required'),
  body('transaction_id')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Transaction ID cannot be empty'),
  handleValidationErrors
];

// Medical report validation
const validateMedicalReport = [
  body('title')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Report title must be at least 2 characters long'),
  body('report_type')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Report type must be at least 2 characters long'),
  body('report_date')
    .optional()
    .isISO8601()
    .withMessage('Valid report date is required'),
  handleValidationErrors
];

// Employee validation
const validateEmployee = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Employee name must be at least 2 characters long'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required'),
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Department must be at least 2 characters long'),
  body('hire_date')
    .optional()
    .isISO8601()
    .withMessage('Valid hire date is required'),
  body('salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary must be a positive number'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateHospitalCreation,
  validatePatientProfile,
  validateDoctorCreation,
  validateAppointmentCreation,
  validatePayment,
  validateMedicalReport,
  validateEmployee,
  validateId,
  validatePagination,
  handleValidationErrors
};