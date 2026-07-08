const rateLimit = require('express-rate-limit');

// ── Limiter 1: Blokir per IP (Otomatis menggunakan bawaan library) ──
const ipLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  // keyGenerator kita HAPUS. Biarkan library melacak req.ip secara default.
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
    const email = req.body?.email ?? 'unknown';
    console.log(`📧 [Email Limiter] Mendeteksi Email: ${email}`);
    return `email_${email}`; 
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