const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

// ── Upload directory ──────────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '../uploads/medical-documents');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_MIMES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024; // 20 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname).toLowerCase()}`),
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) return cb(null, true);
    cb(new Error(`File type not allowed: ${file.mimetype}`));
  },
});

// ── Helper: resolve patient row from authenticated user ───────────────────────
const getPatient = async (userId) => {
  let patient = await prisma.patients.findFirst({ where: { user_id: userId } });
  if (!patient) patient = await prisma.patients.create({ data: { user_id: userId } });
  return patient;
};

// ── Ensure DB columns exist (idempotent migration) ────────────────────────────
const ensureSchema = async () => {
  const { pool } = require('../config/database');
  const conn = await pool.getConnection();
  try {
    // Add columns to patient_documents if missing
    const alterCols = [
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT ''",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS description TEXT",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS document_date DATE",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS privacy_status ENUM('private','shared') NOT NULL DEFAULT 'private'",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS associated_hospital_id INT",
    ];
    for (const sql of alterCols) {
      try { await conn.execute(sql); } catch (_) { /* column already exists */ }
    }

    // Create document_shares table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS document_shares (
        id INT PRIMARY KEY AUTO_INCREMENT,
        document_id INT NOT NULL,
        patient_id  INT NOT NULL,
        hospital_id INT NOT NULL,
        shared_by   INT NOT NULL,
        shared_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        access_status ENUM('active','revoked') NOT NULL DEFAULT 'active',
        FOREIGN KEY (document_id) REFERENCES patient_documents(id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id)  REFERENCES patients(id)          ON DELETE CASCADE,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id)         ON DELETE CASCADE,
        FOREIGN KEY (shared_by)   REFERENCES users(id)             ON DELETE CASCADE,
        UNIQUE KEY uq_doc_hospital (document_id, hospital_id)
      )
    `);
  } finally {
    conn.release();
  }
};

// Run once on module load
ensureSchema().catch(console.error);

// ── DOCUMENT CATEGORIES ───────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'medical_reports',        label: 'Medical Reports' },
  { value: 'imaging_scans',          label: 'Imaging & Scans' },
  { value: 'prescriptions',          label: 'Prescriptions & Medications' },
  { value: 'hospitalization_surgery',label: 'Hospitalization & Surgery' },
  { value: 'medical_history',        label: 'Medical History' },
  { value: 'identity_travel',        label: 'Identity & Travel Documents' },
  { value: 'other',                  label: 'Other' },
];

// GET /api/medical-documents/categories
router.get('/categories', authenticateToken, (_req, res) => {
  res.json({ success: true, data: { categories: CATEGORIES } });
});

// ── LIST documents (patient only sees own; hospital sees shared) ──────────────
// GET /api/medical-documents
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, search, sort = 'newest', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (req.user.role === 'patient') {
      const patient = await getPatient(req.user.id);

      const where = { patient_id: patient.id };
      if (category) where.category = category;
      if (search) where.title = { contains: search };

      const [docs, total] = await Promise.all([
        prisma.patient_documents.findMany({
          where,
          orderBy: { uploaded_at: sort === 'oldest' ? 'asc' : 'desc' },
          skip,
          take: parseInt(limit),
        }),
        prisma.patient_documents.count({ where }),
      ]);

      return res.json({ success: true, data: { documents: docs, total, page: parseInt(page) } });
    }

    if (req.user.role === 'hospital_admin') {
      const hospitalId = req.user.hospital_id;
      if (!hospitalId) return res.status(403).json({ success: false, message: 'No hospital associated' });

      // Only documents explicitly shared with this hospital
      const shares = await prisma.document_shares.findMany({
        where: { hospital_id: hospitalId, access_status: 'active' },
        include: { patient_documents: true },
      });

      const docs = shares.map(s => ({ ...s.patient_documents, shared_at: s.shared_at }));
      return res.json({ success: true, data: { documents: docs, total: docs.length } });
    }

    return res.status(403).json({ success: false, message: 'Access denied' });
  } catch (err) {
    console.error('List documents error:', err);
    res.status(500).json({ success: false, message: 'Failed to list documents' });
  }
});

// ── UPLOAD ────────────────────────────────────────────────────────────────────
// POST /api/medical-documents/upload
router.post('/upload', authenticateToken, authorize('patient'), (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: `File too large. Max ${MAX_SIZE / 1024 / 1024} MB.` });
    }
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { title, category = 'other', description, document_date, associated_hospital_id } = req.body;
    if (!title || !title.trim()) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'Document title is required' });
    }

    const patient = await getPatient(req.user.id);

    const doc = await prisma.patient_documents.create({
      data: {
        patient_id:    patient.id,
        filename:      req.file.filename,
        original_name: req.file.originalname,
        category,
        mimetype:      req.file.mimetype,
        file_size:     req.file.size,
        title:         title.trim(),
        description:   description || null,
        document_date: document_date ? new Date(document_date) : null,
        privacy_status: 'private',
        associated_hospital_id: associated_hospital_id ? parseInt(associated_hospital_id) : null,
      },
    });

    res.status(201).json({ success: true, message: 'Document uploaded successfully', data: { document: doc } });
  } catch (err) {
    console.error('Upload error:', err);
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (_) {}
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// ── GET single document meta ──────────────────────────────────────────────────
// GET /api/medical-documents/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    if (req.user.role === 'patient') {
      const patient = await getPatient(req.user.id);
      if (doc.patient_id !== patient.id) return res.status(403).json({ success: false, message: 'Access denied' });
    } else if (req.user.role === 'hospital_admin') {
      const share = await prisma.document_shares.findFirst({
        where: { document_id: doc.id, hospital_id: req.user.hospital_id, access_status: 'active' },
      });
      if (!share) return res.status(403).json({ success: false, message: 'Document not shared with your hospital' });
    } else {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: { document: doc } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get document' });
  }
});

// ── DOWNLOAD / VIEW ───────────────────────────────────────────────────────────
// GET /api/medical-documents/:id/file
router.get('/:id/file', authenticateToken, async (req, res) => {
  try {
    const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    if (req.user.role === 'patient') {
      const patient = await getPatient(req.user.id);
      if (doc.patient_id !== patient.id) return res.status(403).json({ success: false, message: 'Access denied' });
    } else if (req.user.role === 'hospital_admin') {
      const share = await prisma.document_shares.findFirst({
        where: { document_id: doc.id, hospital_id: req.user.hospital_id, access_status: 'active' },
      });
      if (!share) return res.status(403).json({ success: false, message: 'Document not shared with your hospital' });
    } else {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const filePath = path.join(UPLOAD_DIR, doc.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found on server' });

    const inline = req.query.inline === 'true';
    res.setHeader('Content-Type', doc.mimetype || 'application/octet-stream');
    res.setHeader('Content-Disposition', `${inline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(doc.original_name)}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to serve file' });
  }
});

// ── DELETE ────────────────────────────────────────────────────────────────────
// DELETE /api/medical-documents/:id
router.delete('/:id', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await getPatient(req.user.id);
    const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    if (doc.patient_id !== patient.id) return res.status(403).json({ success: false, message: 'Access denied' });

    // Delete shares first (cascade handles DB, but also remove file)
    await prisma.patient_documents.delete({ where: { id: doc.id } });

    const filePath = path.join(UPLOAD_DIR, doc.filename);
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (_) {}

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
});

// ── SHARE with hospital ───────────────────────────────────────────────────────
// POST /api/medical-documents/:id/share
router.post('/:id/share', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { hospital_id } = req.body;
    if (!hospital_id) return res.status(400).json({ success: false, message: 'hospital_id is required' });

    const patient = await getPatient(req.user.id);
    const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    if (doc.patient_id !== patient.id) return res.status(403).json({ success: false, message: 'Access denied' });

    const hospital = await prisma.hospitals.findUnique({ where: { id: parseInt(hospital_id) } });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    // Upsert share record
    const { pool } = require('../config/database');
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        `INSERT INTO document_shares (document_id, patient_id, hospital_id, shared_by, access_status)
         VALUES (?, ?, ?, ?, 'active')
         ON DUPLICATE KEY UPDATE access_status = 'active', shared_at = CURRENT_TIMESTAMP, shared_by = ?`,
        [doc.id, patient.id, parseInt(hospital_id), req.user.id, req.user.id]
      );
    } finally {
      conn.release();
    }

    // Update privacy_status on document
    await prisma.patient_documents.update({
      where: { id: doc.id },
      data: { privacy_status: 'shared' },
    });

    res.json({ success: true, message: `Document shared with ${hospital.name}` });
  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({ success: false, message: 'Failed to share document' });
  }
});

// ── REVOKE share ──────────────────────────────────────────────────────────────
// DELETE /api/medical-documents/:id/share/:hospitalId
router.delete('/:id/share/:hospitalId', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await getPatient(req.user.id);
    const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doc || doc.patient_id !== patient.id) return res.status(403).json({ success: false, message: 'Access denied' });

    const { pool } = require('../config/database');
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        `UPDATE document_shares SET access_status = 'revoked' WHERE document_id = ? AND hospital_id = ?`,
        [doc.id, parseInt(req.params.hospitalId)]
      );
    } finally {
      conn.release();
    }

    // Check if any active shares remain
    const activeShares = await prisma.document_shares.count({
      where: { document_id: doc.id, access_status: 'active' },
    });

    if (activeShares === 0) {
      await prisma.patient_documents.update({ where: { id: doc.id }, data: { privacy_status: 'private' } });
    }

    res.json({ success: true, message: 'Share revoked' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to revoke share' });
  }
});

// ── LIST shares for a document ────────────────────────────────────────────────
// GET /api/medical-documents/:id/shares
router.get('/:id/shares', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await getPatient(req.user.id);
    const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doc || doc.patient_id !== patient.id) return res.status(403).json({ success: false, message: 'Access denied' });

    const shares = await prisma.document_shares.findMany({
      where: { document_id: doc.id },
      include: { hospitals: { select: { id: true, name: true, city: true } } },
      orderBy: { shared_at: 'desc' },
    });

    res.json({ success: true, data: { shares } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get shares' });
  }
});

module.exports = router;
