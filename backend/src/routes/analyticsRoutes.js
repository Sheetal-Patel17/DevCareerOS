const express = require("express");

const {
  getCareerAnalytics,
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getCareerAnalytics);

module.exports = router;