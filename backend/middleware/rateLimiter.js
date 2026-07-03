const rateLimit = require('express-rate-limit');

// Konfigurasi untuk Login/Register (paling ketat)
const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 menit
  max: 5,                   // Maksimal 5 percobaan per IP
  message: {
    status: 429,
    message: "Terlalu banyak percobaan, silakan coba lagi setelah 30 menit."
  },
  standardHeaders: true,    // Mengirim informasi limit di header respons
  legacyHeaders: false,     // Menonaktifkan header lama (X-RateLimit-*)
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = { authLimiter };