const express = require("express");

const {
  getInterviews,
  getInterviewStats,
  createInterview,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getInterviews);
router.get("/stats", getInterviewStats);
router.post("/", createInterview);
router.put("/:id", updateInterview);
router.delete("/:id", deleteInterview);

module.exports = router;