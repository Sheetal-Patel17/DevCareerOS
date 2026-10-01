const DsaProblem = require("../models/DsaProblem");

const getUserId = (req) => {
  return req.auth?.userId || req.auth?.id || req.auth?._id;
};

// GET /api/dsa
const getProblems = async (req, res) => {
  try {
    const userId = getUserId(req);

    const problems = await DsaProblem.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Get DSA problems error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch DSA problems",
    });
  }
};

// GET /api/dsa/stats
const getDsaStats = async (req, res) => {
  try {
    const userId = getUserId(req);

    const problems = await DsaProblem.find({ user: userId });

    const total = problems.length;
    const solved = problems.filter(
      (problem) => problem.status === "Solved"
    ).length;

    const inProgress = problems.filter(
      (problem) => problem.status === "In Progress"
    ).length;

    const notStarted = problems.filter(
      (problem) => problem.status === "Not Started"
    ).length;

    const easy = problems.filter(
      (problem) => problem.difficulty === "Easy"
    ).length;

    const medium = problems.filter(
      (problem) => problem.difficulty === "Medium"
    ).length;

    const hard = problems.filter(
      (problem) => problem.difficulty === "Hard"
    ).length;

    const solvedEasy = problems.filter(
      (problem) =>
        problem.difficulty === "Easy" && problem.status === "Solved"
    ).length;

    const solvedMedium = problems.filter(
      (problem) =>
        problem.difficulty === "Medium" && problem.status === "Solved"
    ).length;

    const solvedHard = problems.filter(
      (problem) =>
        problem.difficulty === "Hard" && problem.status === "Solved"
    ).length;

    const completionPercentage =
      total === 0 ? 0 : Math.round((solved / total) * 100);

    res.status(200).json({
      success: true,
      stats: {
        total,
        solved,
        inProgress,
        notStarted,
        completionPercentage,
        difficulty: {
          totalEasy: easy,
          totalMedium: medium,
          totalHard: hard,
          solvedEasy,
          solvedMedium,
          solvedHard,
        },
      },
    });
  } catch (error) {
    console.error("Get DSA stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate DSA statistics",
    });
  }
};

// POST /api/dsa
const createProblem = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      title,
      topic,
      difficulty,
      status,
      platform,
      problemUrl,
      notes,
    } = req.body;

    if (!title || !topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Title, topic, and difficulty are required",
      });
    }

    const problem = await DsaProblem.create({
      user: userId,
      title,
      topic,
      difficulty,
      status: status || "Not Started",
      platform: platform || "LeetCode",
      problemUrl: problemUrl || "",
      notes: notes || "",
      solvedAt: status === "Solved" ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: "DSA problem created successfully",
      problem,
    });
  } catch (error) {
    console.error("Create DSA problem error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create DSA problem",
    });
  }
};

// PUT /api/dsa/:id
const updateProblem = async (req, res) => {
  try {
    const userId = getUserId(req);

    const problem = await DsaProblem.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "DSA problem not found",
      });
    }

    const allowedFields = [
      "title",
      "topic",
      "difficulty",
      "status",
      "platform",
      "problemUrl",
      "notes",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        problem[field] = req.body[field];
      }
    });

    if (problem.status === "Solved" && !problem.solvedAt) {
      problem.solvedAt = new Date();
    }

    if (problem.status !== "Solved") {
      problem.solvedAt = null;
    }

    await problem.save();

    res.status(200).json({
      success: true,
      message: "DSA problem updated successfully",
      problem,
    });
  } catch (error) {
    console.error("Update DSA problem error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update DSA problem",
    });
  }
};

// DELETE /api/dsa/:id
const deleteProblem = async (req, res) => {
  try {
    const userId = getUserId(req);

    const problem = await DsaProblem.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "DSA problem not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "DSA problem deleted successfully",
    });
  } catch (error) {
    console.error("Delete DSA problem error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete DSA problem",
    });
  }
};

module.exports = {
  getProblems,
  getDsaStats,
  createProblem,
  updateProblem,
  deleteProblem,
};