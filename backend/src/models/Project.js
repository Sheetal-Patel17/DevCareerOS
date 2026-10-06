const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  technologies: { type: [String], default: [] },
  status: { type: String, default: "Planning" },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  githubUrl: { type: String, default: "" },
  liveUrl: { type: String, default: "" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Project", schema);