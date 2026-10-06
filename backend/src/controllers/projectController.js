const Project = require("../models/Project");

const uid = (req) => req.auth?.userId;

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: uid(req) }).sort({ updatedAt: -1, createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, user: uid(req) });
    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create project" });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: uid(req) },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: uid(req) });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to delete project" });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };