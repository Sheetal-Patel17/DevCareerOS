const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, default: "Programming" },
  level: { type: String, default: "Beginner" },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  target: { type: Number, min: 0, max: 100, default: 80 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Skill", schema);