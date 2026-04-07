const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// POST /api/contact-assistance
router.post('/', async (req, res) => {
  const { name, contact, country, message, context } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ success: false, message: 'Name and contact are required.' });
  }

  try {
    await pool.execute(
      `CREATE TABLE IF NOT EXISTS assistance_requests (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL,
        country VARCHAR(100),
        message TEXT,
        context JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );

    await pool.execute(
      'INSERT INTO assistance_requests (name, contact, country, message, context) VALUES (?, ?, ?, ?, ?)',
      [name, contact, country || null, message || null, context ? JSON.stringify(context) : null]
    );

    res.status(201).json({ success: true, message: 'Request received. Our team will contact you shortly.' });
  } catch (error) {
    console.error('Contact assistance error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit request.' });
  }
});

module.exports = router;
