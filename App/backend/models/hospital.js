const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
  name: String,
  location: String,
  specialization: String
});

module.exports = mongoose.model("Hospital", HospitalSchema);