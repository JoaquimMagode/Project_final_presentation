const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/documents', 'uploads/profiles', 'uploads/reports'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/documents';
    
    if (req.body.type === 'profile') {
      uploadPath = 'uploads/profiles';
    } else if (req.body.type === 'report') {
      uploadPath = 'uploads/reports';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/upload/documents
// @desc    Upload multiple documents
// @access  Private
router.post('/documents', authenticateToken, upload.array('documents', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date()
    }));

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        files: uploadedFiles
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
});

// @route   POST /api/upload/profile
// @desc    Upload profile picture
// @access  Private
router.post('/profile', authenticateToken, upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        url: `/uploads/profiles/${req.file.filename}`
      }
    });

  } catch (error) {
    console.error('Profile upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Profile upload failed'
    });
  }
});

// @route   GET /api/upload/file/:filename
// @desc    Serve uploaded files
// @access  Private
router.get('/file/:filename', authenticateToken, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePaths = [
      path.join(__dirname, '../uploads/documents', filename),
      path.join(__dirname, '../uploads/profiles', filename),
      path.join(__dirname, '../uploads/reports', filename)
    ];

    let filePath = null;
    for (const fp of filePaths) {
      if (fs.existsSync(fp)) {
        filePath = fp;
        break;
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.sendFile(filePath);

  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve file'
    });
  }
});

// @route   DELETE /api/upload/file/:filename
// @desc    Delete uploaded file
// @access  Private
router.delete('/file/:filename', authenticateToken, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePaths = [
      path.join(__dirname, '../uploads/documents', filename),
      path.join(__dirname, '../uploads/profiles', filename),
      path.join(__dirname, '../uploads/reports', filename)
    ];

    let deleted = false;
    for (const fp of filePaths) {
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
});

module.exports = router;
