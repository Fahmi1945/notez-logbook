<<<<<<< HEAD:backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
=======
const rateLimit = require("express-rate-limit");
>>>>>>> 6856514f1c29510ea3baa83ddd283ea84fb9b816:backend/src/middleware/rateLimiter.js

// ── Limiter 1: blokir per IP ──────────────────────────────
const ipLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req),
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message: "Terlalu banyak percobaan login dari perangkat ini. Silakan coba lagi setelah 30 menit."
    });
  }
});

// ── Limiter 2: blokir per email ───────────────────────────
const emailLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
<<<<<<< HEAD:backend/middleware/rateLimiter.js
    const email = req.body?.email ?? 'unknown';
    return `email_${email}`; // prefix agar tidak konflik dengan key IP
  },
  handler: (req, res) => {
    const email = req.body?.email ?? 'ini';
    res.status(429).json({
      status: 429,
      message: `Akun ${email} telah disuspend sementara karena terlalu banyak percobaan login gagal. Silakan coba lagi setelah 30 menit.`
=======
    const email = req.body?.email ?? "unknown";
    return `email_${email}`;
  },
  handler: (req, res) => {
    const email = req.body?.email ?? "ini";
    res.status(423).json({
      status: 423,
      message: `Akun ${email} telah disuspend sementara karena terlalu banyak percobaan login gagal. Silakan coba lagi setelah 30 menit.`,
>>>>>>> 6856514f1c29510ea3baa83ddd283ea84fb9b816:backend/src/middleware/rateLimiter.js
    });
  }
});

module.exports = { ipLimiter, emailLimiter };
