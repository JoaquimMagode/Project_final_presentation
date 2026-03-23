const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    './uploads',
    './uploads/profiles',
    './uploads/hospitals',
    './uploads/reports',
    './uploads/documents'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize upload directories
ensureUploadDirs();

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = './uploads/';
    
    // Determine upload path based on file type or route
    if (req.route.path.includes('profile')) {
      uploadPath += 'profiles/';
    } else if (req.route.path.includes('hospital')) {
      uploadPath += 'hospitals/';
    } else if (req.route.path.includes('report')) {
      uploadPath += 'reports/';
    } else {
      uploadPath += 'documents/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedTypes = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    reports: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/dicom']
  };

  let allowedMimeTypes = [];

  // Determine allowed types based on route
  if (req.route.path.includes('profile') || req.route.path.includes('logo')) {
    allowedMimeTypes = allowedTypes.images;
  } else if (req.route.path.includes('report')) {
    allowedMimeTypes = [...allowedTypes.images, ...allowedTypes.documents, ...allowedTypes.reports];
  } else {
    allowedMimeTypes = [...allowedTypes.images, ...allowedTypes.documents];
  }

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'File upload failed.'
  });
};

// Single file upload middleware
const uploadSingle = (fieldName) => {
  return [
    upload.single(fieldName),
    handleUploadError
  ];
};

// Multiple files upload middleware
const uploadMultiple = (fieldName, maxCount = 5) => {
  return [
    upload.array(fieldName, maxCount),
    handleUploadError
  ];
};

// Mixed files upload middleware
const uploadFields = (fields) => {
  return [
    upload.fields(fields),
    handleUploadError
  ];
};

// Delete file helper function
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Get file URL helper function
const getFileUrl = (req, filename) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/${filename}`;
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError,
  deleteFile,
  getFileUrl
};