<<<<<<< HEAD:backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
=======
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
>>>>>>> 4f1a4bcd291d322ef33202a963654fd24c0db1d8:backend/src/middleware/rateLimiter.js

// ── Limiter 1: Blokir per IP (Otomatis menggunakan bawaan library) ──
const ipLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
<<<<<<< HEAD:backend/middleware/rateLimiter.js
  // keyGenerator kita HAPUS. Biarkan library melacak req.ip secara default.
=======
  // keyGenerator: (req) => ipKeyGenerator(req),
>>>>>>> 4f1a4bcd291d322ef33202a963654fd24c0db1d8:backend/src/middleware/rateLimiter.js
  handler: (req, res) => {
    res.status(429).json({
      status: 429,
      message:
        "Terlalu banyak percobaan login dari perangkat ini. Silakan coba lagi setelah 30 menit.",
    });
  },
});

// ── Limiter 2: Blokir per email ───────────────────────────
const emailLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
<<<<<<< HEAD:backend/middleware/rateLimiter.js
    const email = req.body?.email ?? 'unknown';
    console.log(`📧 [Email Limiter] Mendeteksi Email: ${email}`);
    return `email_${email}`; 
=======
    const email = req.body?.email ?? "unknown";
    return `email_${email}`; // prefix agar tidak konflik dengan key IP
>>>>>>> 4f1a4bcd291d322ef33202a963654fd24c0db1d8:backend/src/middleware/rateLimiter.js
  },
  handler: (req, res) => {
    const email = req.body?.email ?? "ini";
    res.status(430).json({
      status: 430,
      message: `Akun ${email} telah disuspend sementara karena terlalu banyak percobaan login gagal. Silakan coba lagi setelah 30 menit.`,
    });
  },
});

module.exports = { ipLimiter, emailLimiter };