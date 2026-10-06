const express = require("express");

const {
  getCareerGithubActivity,
} = require("../controllers/githubActivityController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCareerGithubActivity);

module.exports = router;