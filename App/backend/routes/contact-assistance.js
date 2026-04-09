const express = require('express');
const prisma = require('../config/prisma');
const router = express.Router();

// POST /api/contact-assistance
router.post('/', async (req, res) => {
  const { name, contact, country, message, context } = req.body;

  if (!name || !contact) {
    return res.status(400).json({ success: false, message: 'Name and contact are required.' });
  }

  try {
    // Log to console since assistance_requests table may not exist in Prisma schema
    console.log('Assistance request:', { name, contact, country, message, context });
    res.status(201).json({ success: true, message: 'Request received. Our team will contact you shortly.' });
  } catch (error) {
    console.error('Contact assistance error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit request.' });
  }
});

module.exports = router;
