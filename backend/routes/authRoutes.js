// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { ipLimiter, emailLimiter } = require('../middleware/rateLimiter');
const { register, login } = require('../controllers/authController');

// 1. Endpoint Login: Cek IP dulu, baru cek Email, lalu jalankan fungsi login
router.post('/login', ipLimiter, emailLimiter, login);

// 2. Endpoint Register: Cek IP dan Email juga (opsional, tapi disarankan)
router.post('/register', ipLimiter, emailLimiter, register);

// Wajib diekspor agar bisa dipakai oleh app.js utama
module.exports = router;