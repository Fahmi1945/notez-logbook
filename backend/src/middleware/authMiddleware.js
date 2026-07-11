// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // 1. Ambil token dari header "Authorization"
    const authHeader = req.headers["authorization"];
    
    // Biasanya formatnya adalah: Bearer <token_jwt_kamu>
    const token = authHeader && authHeader.split(" ")[1];

    // Jika token tidak dikirimkan
    if (!token) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Akses ditolak. Token tidak ditemukan."
      });
    }

    // 2. Verifikasi apakah tokennya asli dan belum kedaluwarsa
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);

    // 3. Jika asli, simpan data id dan role ke dalam objek 'req.user'
    // Sehingga fungsi controller di depannya bisa langsung memakai data ini
    req.user = decoded; 

    // Lanjutkan perjalanan ke Controller
    next(); 

  } catch (error) {
    console.error("Error di verifyToken Middleware:", error.message);
    return res.status(403).json({
      error: "FORBIDDEN",
      message: "Token tidak valid atau sudah kedaluwarsa."
    });
  }
};

module.exports = verifyToken;