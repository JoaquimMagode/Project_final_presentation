const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/prisma');
const { authenticateToken, authorize } = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '../uploads/medical-documents');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIMES = new Set([
  'application/pdf',
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024;

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

const getPatient = async (userId) => {
  let patient = await prisma.patients.findFirst({ where: { user_id: userId } });
  if (!patient) patient = await prisma.patients.create({ data: { user_id: userId } });
  return patient;
};

// Audit log helper
const audit = async (userId, action, entityId, details = {}) => {
  try {
    await prisma.system_logs.create({
      data: {
        user_id: userId,
        action,
        entity_type: 'medical_document',
        entity_id: entityId,
        details,
      },
    });
  } catch (_) {}
};

// Idempotent schema migration
const ensureSchema = async () => {
  const { pool } = require('../config/database');
  const conn = await pool.getConnection();
  try {
    const alterCols = [
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT ''",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS description TEXT",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS document_date DATE",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS privacy_status ENUM('private','shared') NOT NULL DEFAULT 'private'",
      "ALTER TABLE patient_documents ADD COLUMN IF NOT EXISTS associated_hospital_id INT",
    ];
    for (const sql of alterCols) {
      try { await conn.execute(sql); } catch (_) {}
    }
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
ensureSchema().catch(console.error);

const CATEGORIES = [
  { value: 'medical_reports',         label: 'Medical Reports' },
  { value: 'imaging_scans',           label: 'Imaging & Scans' },
  { value: 'prescriptions',           label: 'Prescriptions & Medications' },
  { value: 'hospitalization_surgery', label: 'Hospitalization & Surgery' },
  { value: 'medical_history',         label: 'Medical History' },
  { value: 'identity_travel',         label: 'Identity & Travel Documents' },
  { value: 'other',                   label: 'Other' },
];

// GET /api/medical-documents/categories
router.get('/categories', authenticateToken, (_req, res) => {
  res.json({ success: true, data: { categories: CATEGORIES } });
});

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

// POST /api/medical-documents/upload
router.post('/upload', authenticateToken, authorize('patient'), (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE')
      return res.status(400).json({ success: false, message: `File too large. Max ${MAX_SIZE / 1024 / 1024} MB.` });
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

    await audit(req.user.id, 'document_upload', doc.id, { title: doc.title, category });
    res.status(201).json({ success: true, message: 'Document uploaded successfully', data: { document: doc } });
  } catch (err) {
    console.error('Upload error:', err);
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (_) {}
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

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

    await audit(req.user.id, 'document_view', doc.id, {});
    res.json({ success: true, data: { document: doc } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get document' });
  }
});

// GET /api/medical-documents/:id/file
// Supports Authorization header OR ?token= query param (for browser tab open)
router.get('/:id/file', (req, res, next) => {
  if (!req.headers['authorization'] && req.query.token) {
    req.headers['authorization'] = `Bearer ${req.query.token}`;
  }
  next();
}, authenticateToken, async (req, res) => {
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
    const action = inline ? 'document_view' : 'document_download';
    await audit(req.user.id, action, doc.id, {});

    res.setHeader('Content-Type', doc.mimetype || 'application/octet-stream');
    res.setHeader('Content-Disposition', `${inline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(doc.original_name)}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to serve file' });
  }
});

// DELETE /api/medical-documents/:id
router.delete('/:id', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const patient = await getPatient(req.user.id);
    const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
    if (doc.patient_id !== patient.id) return res.status(403).json({ success: false, message: 'Access denied' });

    await prisma.patient_documents.delete({ where: { id: doc.id } });
    const filePath = path.join(UPLOAD_DIR, doc.filename);
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (_) {}

    await audit(req.user.id, 'document_delete', doc.id, { title: doc.title });
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
});

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

    const { pool } = require('../config/database');
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        `INSERT INTO document_shares (document_id, patient_id, hospital_id, shared_by, access_status)
         VALUES (?, ?, ?, ?, 'active')
         ON DUPLICATE KEY UPDATE access_status = 'active', shared_at = CURRENT_TIMESTAMP, shared_by = ?`,
        [doc.id, patient.id, parseInt(hospital_id), req.user.id, req.user.id]
      );
    } finally { conn.release(); }

    await prisma.patient_documents.update({ where: { id: doc.id }, data: { privacy_status: 'shared' } });
    await audit(req.user.id, 'document_share', doc.id, { hospital_id: parseInt(hospital_id), hospital_name: hospital.name });

    res.json({ success: true, message: `Document shared with ${hospital.name}` });
  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({ success: false, message: 'Failed to share document' });
  }
});

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
    } finally { conn.release(); }

    const activeShares = await prisma.document_shares.count({
      where: { document_id: doc.id, access_status: 'active' },
    });
    if (activeShares === 0)
      await prisma.patient_documents.update({ where: { id: doc.id }, data: { privacy_status: 'private' } });

    await audit(req.user.id, 'document_revoke', doc.id, { hospital_id: parseInt(req.params.hospitalId) });
    res.json({ success: true, message: 'Share revoked' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to revoke share' });
  }
});

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

// POST /api/medical-documents/share-with-appointment
// Share multiple documents with the hospital of a given appointment
router.post('/share-with-appointment', authenticateToken, authorize('patient'), async (req, res) => {
  try {
    const { document_ids, hospital_id } = req.body;
    if (!hospital_id || !Array.isArray(document_ids) || document_ids.length === 0)
      return res.status(400).json({ success: false, message: 'document_ids and hospital_id are required' });

    const patient = await getPatient(req.user.id);
    const hospital = await prisma.hospitals.findUnique({ where: { id: parseInt(hospital_id) } });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    const { pool } = require('../config/database');
    const conn = await pool.getConnection();
    try {
      for (const docId of document_ids) {
        const doc = await prisma.patient_documents.findUnique({ where: { id: parseInt(docId) } });
        if (!doc || doc.patient_id !== patient.id) continue;
        await conn.execute(
          `INSERT INTO document_shares (document_id, patient_id, hospital_id, shared_by, access_status)
           VALUES (?, ?, ?, ?, 'active')
           ON DUPLICATE KEY UPDATE access_status = 'active', shared_at = CURRENT_TIMESTAMP, shared_by = ?`,
          [doc.id, patient.id, parseInt(hospital_id), req.user.id, req.user.id]
        );
        await prisma.patient_documents.update({ where: { id: doc.id }, data: { privacy_status: 'shared' } });
        await audit(req.user.id, 'document_share', doc.id, { hospital_id: parseInt(hospital_id), via: 'appointment' });
      }
    } finally { conn.release(); }

    res.json({ success: true, message: `${document_ids.length} document(s) shared with ${hospital.name}` });
  } catch (err) {
    console.error('Bulk share error:', err);
    res.status(500).json({ success: false, message: 'Failed to share documents' });
  }
});

module.exports = router;
