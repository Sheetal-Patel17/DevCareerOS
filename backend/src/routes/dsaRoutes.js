const express = require("express");

const {
  getProblems,
  getDsaStats,
  createProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/dsaController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProblems);
router.get("/stats", getDsaStats);
router.post("/", createProblem);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;