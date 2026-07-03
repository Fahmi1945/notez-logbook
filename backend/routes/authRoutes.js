// index.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/authController');

const authLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,  // 30 menit
  max: 5,                    // maks 5 percobaan
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Coba lagi dalam 30 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

// Middleware agar bisa membaca JSON dari request body Next.js nanti
app.use(express.json()); 

app.use('/api/auth/login', authLimiter);

app.use('/api/auth/register', authLimiter);

// Endpoint untuk register
app.post('/api/auth/register', register);
  
// Endpoint untuk login
app.post('/api/auth/login', login);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});

module.exports = router;