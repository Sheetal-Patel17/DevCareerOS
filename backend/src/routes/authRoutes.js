const express = require("express");
const { register, login } = require("../controllers/authController");
const { googleLogin } = require("../controllers/googleAuthController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;
