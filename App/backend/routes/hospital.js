const express = require("express");
const router = express.Router();
const Hospital = require("../models/hospital");

// Create hospital
router.post("/", async (req, res) => {
  const hospital = new Hospital(req.body);
  await hospital.save();
  res.json(hospital);
});

// Get all hospitals
router.get("/", async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

module.exports = router;
