const Application = require("../models/Application");

const uid = (req) => req.auth?.userId;

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: uid(req) }).sort({ dateApplied: -1, createdAt: -1 });
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch applications" });
  }
};

const createApplication = async (req, res) => {
  try {
    const application = await Application.create({ ...req.body, user: uid(req) });
    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create application" });
  }
};

const updateApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: uid(req) },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, application });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update application" });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, user: uid(req) });
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to delete application" });
  }
};

module.exports = { getApplications, createApplication, updateApplication, deleteApplication };