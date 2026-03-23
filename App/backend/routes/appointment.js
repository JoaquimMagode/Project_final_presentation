const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointment");
const auth = require("../middleware/authMiddleware");

// Book appointment
router.post("/", auth, async (req, res) => {
  const { hospital, date } = req.body;

  const appointment = new Appointment({
    patient: req.user.id,
    hospital,
    date
  });

  await appointment.save();
  res.json({ message: "Appointment booked", appointment });
});

// Get user appointments
router.get("/", auth, async (req, res) => {
  const data = await Appointment.find({ patient: req.user.id })
    .populate("hospital");

  res.json(data);
});

module.exports = router;