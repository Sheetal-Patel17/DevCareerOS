const Resume = require("../models/Resume");

const getUserId = (req) => {
  return req.auth?.userId || req.auth?.id || req.auth?._id;
};

// GET /api/resumes
const getResumes = async (req, res) => {
  try {
    const userId = getUserId(req);

    const resumes = await Resume.find({ user: userId }).sort({
      lastUpdated: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// GET /api/resumes/:id
const getResumeById = async (req, res) => {
  try {
    const userId = getUserId(req);

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

// GET /api/resumes/stats
const getResumeStats = async (req, res) => {
  try {
    const userId = getUserId(req);

    const resumes = await Resume.find({ user: userId });

    const total = resumes.length;

    const draft = resumes.filter(
      (resume) => resume.status === "Draft"
    ).length;

    const ready = resumes.filter(
      (resume) => resume.status === "Ready"
    ).length;

    const archived = resumes.filter(
      (resume) => resume.status === "Archived"
    ).length;

    const latestResume =
      resumes.length > 0
        ? resumes.reduce((latest, current) => {
            const latestDate = new Date(latest.lastUpdated);
            const currentDate = new Date(current.lastUpdated);

            return currentDate > latestDate ? current : latest;
          })
        : null;

    res.status(200).json({
      success: true,
      stats: {
        total,
        draft,
        ready,
        archived,
        latestUpdated: latestResume
          ? latestResume.lastUpdated
          : null,
      },
    });
  } catch (error) {
    console.error("Get resume stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate resume statistics",
    });
  }
};

// POST /api/resumes
const createResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      title,
      targetRole,
      version,
      summary,
      skills,
      education,
      experience,
      projects,
      certifications,
      links,
      status,
    } = req.body;

    if (!title || !targetRole) {
      return res.status(400).json({
        success: false,
        message: "Resume title and target role are required",
      });
    }

    const resume = await Resume.create({
      user: userId,
      title,
      targetRole,
      version: version || "v1.0",
      summary: summary || "",
      skills: Array.isArray(skills) ? skills : [],
      education: Array.isArray(education) ? education : [],
      experience: Array.isArray(experience) ? experience : [],
      projects: Array.isArray(projects) ? projects : [],
      certifications: Array.isArray(certifications)
        ? certifications
        : [],
      links: links || {},
      status: status || "Draft",
      lastUpdated: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error("Create resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

// PUT /api/resumes/:id
const updateResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const allowedFields = [
      "title",
      "targetRole",
      "version",
      "summary",
      "skills",
      "education",
      "experience",
      "projects",
      "certifications",
      "links",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    resume.lastUpdated = new Date();

    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

// DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const userId = getUserId(req);

    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

module.exports = {
  getResumes,
  getResumeById,
  getResumeStats,
  createResume,
  updateResume,
  deleteResume,
};