const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// POST /api/email/send-quote
router.post('/send-quote', async (req, res) => {
  const { email, city, procedure, extras, totalExtras } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const extrasLines = (extras || [])
    .map(e => `<li>${e.title}: +$${e.cost}/day</li>`)
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #059669;">Your IMAP Medical Tourism Quote</h2>
      <p>Thank you for using <strong>IMAP Solution</strong>. Here is your quote summary:</p>

      <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; color: #64748b;">Destination</td><td style="padding: 8px; font-weight: bold;">${city || 'N/A'}</td></tr>
        ${procedure ? `<tr><td style="padding: 8px; color: #64748b;">Procedure</td><td style="padding: 8px; font-weight: bold;">${procedure}</td></tr>` : ''}
      </table>

      <h3 style="color: #1e293b;">Selected Extras</h3>
      ${extrasLines
        ? `<ul style="padding-left: 20px; color: #334155;">${extrasLines}</ul>`
        : '<p style="color: #94a3b8;">No extras selected.</p>'
      }

      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-top: 16px;">
        <strong style="color: #059669;">Total Extras Estimate: $${totalExtras || 0}${totalExtras > 0 ? '/day' : ''}</strong>
      </div>

      <p style="margin-top: 24px; color: #64748b;">
        To complete your booking, log in to your 
        <a href="http://localhost:3000" style="color: #059669;">IMAP patient dashboard</a>.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">IMAP Solution — Medical Tourism Platform</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"IMAP Solution" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your IMAP Medical Tourism Quote',
      html,
    });

    res.json({ success: true, message: 'Quote email sent successfully' });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

module.exports = router;
