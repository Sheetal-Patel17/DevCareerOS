const Goal = require("../models/Goal");

const getUserId = (req) => {
  return req.auth?.userId || req.auth?.id || req.auth?._id;
};

// GET /api/goals
const getGoals = async (req, res) => {
  try {
    const userId = getUserId(req);

    const goals = await Goal.find({ user: userId }).sort({
      deadline: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    console.error("Get goals error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
    });
  }
};

// GET /api/goals/stats
const getGoalStats = async (req, res) => {
  try {
    const userId = getUserId(req);

    const goals = await Goal.find({ user: userId });

    const total = goals.length;

    const completed = goals.filter(
      (goal) => goal.status === "Completed"
    ).length;

    const inProgress = goals.filter(
      (goal) => goal.status === "In Progress"
    ).length;

    const notStarted = goals.filter(
      (goal) => goal.status === "Not Started"
    ).length;

    const paused = goals.filter(
      (goal) => goal.status === "Paused"
    ).length;

    const highPriority = goals.filter(
      (goal) => goal.priority === "High"
    ).length;

    const averageProgress =
      total === 0
        ? 0
        : Math.round(
            goals.reduce((sum, goal) => sum + goal.progress, 0) / total
          );

    const completedMilestones = goals.reduce(
      (totalCompleted, goal) =>
        totalCompleted +
        goal.milestones.filter((milestone) => milestone.completed).length,
      0
    );

    const totalMilestones = goals.reduce(
      (totalCount, goal) => totalCount + goal.milestones.length,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        inProgress,
        notStarted,
        paused,
        highPriority,
        averageProgress,
        completedMilestones,
        totalMilestones,
      },
    });
  } catch (error) {
    console.error("Get goal stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to calculate goal statistics",
    });
  }
};

// POST /api/goals
const createGoal = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      title,
      description,
      category,
      priority,
      status,
      progress,
      deadline,
      milestones,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Goal title is required",
      });
    }

    const numericProgress =
      progress === undefined ? 0 : Number(progress);

    if (
      Number.isNaN(numericProgress) ||
      numericProgress < 0 ||
      numericProgress > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    const goal = await Goal.create({
      user: userId,
      title,
      description: description || "",
      category: category || "Career",
      priority: priority || "Medium",
      status: status || "Not Started",
      progress: numericProgress,
      deadline: deadline || null,
      milestones: Array.isArray(milestones) ? milestones : [],
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    console.error("Create goal error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create goal",
    });
  }
};

// PUT /api/goals/:id
const updateGoal = async (req, res) => {
  try {
    const userId = getUserId(req);

    const goal = await Goal.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "priority",
      "status",
      "progress",
      "deadline",
      "milestones",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        goal[field] = req.body[field];
      }
    });

    if (
      goal.progress < 0 ||
      goal.progress > 100 ||
      Number.isNaN(goal.progress)
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress must be between 0 and 100",
      });
    }

    if (goal.progress === 100) {
      goal.status = "Completed";
    }

    if (goal.status === "Completed") {
      goal.progress = 100;
    }

    await goal.save();

    res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    console.error("Update goal error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update goal",
    });
  }
};

// DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const userId = getUserId(req);

    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete goal",
    });
  }
};

module.exports = {
  getGoals,
  getGoalStats,
  createGoal,
  updateGoal,
  deleteGoal,
};