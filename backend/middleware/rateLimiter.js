const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

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
    const email = req.body?.email ?? 'unknown';
    return `email_${email}`; // prefix agar tidak konflik dengan key IP
  },
  handler: (req, res) => {
    const email = req.body?.email ?? 'ini';
    res.status(429).json({
      status: 429,
      message: `Akun ${email} telah disuspend sementara karena terlalu banyak percobaan login gagal. Silakan coba lagi setelah 30 menit.`
    });
  }
});

module.exports = { ipLimiter, emailLimiter };