const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { ipLimiter, emailLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", ipLimiter, emailLimiter, loginUser);

module.exports = router;
