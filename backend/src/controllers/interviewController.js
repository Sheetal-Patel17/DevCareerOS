const Interview = require("../models/Interview");

const getUserId = (req) => {
  return req.auth?.userId || req.auth?.id || req.auth?._id;
};

// GET /api/interviews
const getInterviews = async (req, res) => {
  try {
    const userId = getUserId(req);

    const interviews = await Interview.find({ user: userId }).sort({
      interviewDate: 1,
    });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
};

// GET /api/interviews/stats
const getInterviewStats = async (req, res) => {
  try {
    const userId = getUserId(req);

    const interviews = await Interview.find({ user: userId });

    const total = interviews.length;

    const scheduled = interviews.filter(
      (interview) => interview.status === "Scheduled"
    ).length;

    const completed = interviews.filter(
      (interview) => interview.status === "Completed"
    ).length;

    const cancelled = interviews.filter(
      (interview) => interview.status === "Cancelled"
    ).length;

    const selected = interviews.filter(
      (interview) => interview.status === "Selected"
    ).length;

    const rejected = interviews.filter(
      (interview) => interview.status === "Rejected"
    ).length;

    const technical = interviews.filter(
      (interview) => interview.type === "Technical"
    ).length;

    const hr = interviews.filter(
      (interview) => interview.type === "HR"
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        total,
        scheduled,
        completed,
        cancelled,
        selected,
        rejected,
        technical,
        hr,
      },
    });
  } catch (error) {
    console.error("Get interview stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate interview statistics",
    });
  }
};

// POST /api/interviews
const createInterview = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      company,
      role,
      round,
      type,
      status,
      interviewDate,
      meetingLink,
      notes,
      preparation,
    } = req.body;

    if (!company || !role || !round || !interviewDate) {
      return res.status(400).json({
        success: false,
        message:
          "Company, role, round, and interview date are required",
      });
    }

    const interview = await Interview.create({
      user: userId,
      company,
      role,
      round,
      type: type || "Technical",
      status: status || "Scheduled",
      interviewDate,
      meetingLink: meetingLink || "",
      notes: notes || "",
      preparation: preparation || "",
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Create interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create interview",
    });
  }
};

// PUT /api/interviews/:id
const updateInterview = async (req, res) => {
  try {
    const userId = getUserId(req);

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const allowedFields = [
      "company",
      "role",
      "round",
      "type",
      "status",
      "interviewDate",
      "meetingLink",
      "notes",
      "preparation",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        interview[field] = req.body[field];
      }
    });

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });
  } catch (error) {
    console.error("Update interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update interview",
    });
  }
};

// DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
  try {
    const userId = getUserId(req);

    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error("Delete interview error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete interview",
    });
  }
};

module.exports = {
  getInterviews,
  getInterviewStats,
  createInterview,
  updateInterview,
  deleteInterview,
};