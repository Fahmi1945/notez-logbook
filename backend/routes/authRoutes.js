// index.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {ipLimiter, emailLimiter} = require('../middleware/rateLimiter');
const { register, login } = require('../controllers/authController');
const authController = require('../controllers/authController');

// Urutan penting: cek IP dulu, baru cek email
router.post('/login', ipLimiter, emailLimiter, authController.login);

router.post('/register', ipLimiter, emailLimiter, authController.register);

const app = express();

// Middleware agar bisa membaca JSON dari request body Next.js nanti
app.use(express.json()); 

app.use('/api/auth/login', (ipLimiter, emailLimiter));

app.use('/api/auth/register', ipLimiter);

// Endpoint untuk register
app.post('/api/auth/register', register);
  
// Endpoint untuk login
app.post('/api/auth/login', login);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});

module.exports = router;