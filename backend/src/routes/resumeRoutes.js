const express = require("express");

const {
  getResumes,
  getResumeById,
  getResumeStats,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getResumes);
router.get("/stats", getResumeStats);
router.get("/:id", getResumeById);
router.post("/", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router;