const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
  date: String
});

module.exports = mongoose.model("Appointment", AppointmentSchema);