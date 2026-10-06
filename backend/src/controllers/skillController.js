const Skill = require("../models/Skill");

const uid = (req) => req.auth?.userId;

const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: uid(req) }).sort({ lastUpdated: -1, createdAt: -1 });
    res.json({ success: true, count: skills.length, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch skills" });
  }
};

const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create({ ...req.body, user: uid(req), lastUpdated: new Date() });
    res.status(201).json({ success: true, skill });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create skill" });
  }
};

const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: uid(req) },
      { $set: { ...req.body, lastUpdated: new Date() } },
      { new: true, runValidators: true }
    );
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.json({ success: true, skill });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update skill" });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: uid(req) });
    if (!skill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to delete skill" });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };