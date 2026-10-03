const express = require("express");

const {
  getGoals,
  getGoalStats,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goalController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getGoals);
router.get("/stats", getGoalStats);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

module.exports = router;