const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  location: { type: String, default: "" },
  type: { type: String, default: "Full-time" },
  salary: { type: String, default: "" },
  dateApplied: { type: Date, default: Date.now },
  status: { type: String, default: "Applied" },
  source: { type: String, default: "LinkedIn" },
  url: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Application", schema);