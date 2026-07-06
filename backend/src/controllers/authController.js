require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// 1. Import fungsi dari model yang sudah Anda buat
const { findUserByEmail, createUser } = require("../models/userModel"); 

// Register handler
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Field name, email, password, dan role wajib diisi.",
      });
    }

    // Gunakan fungsi dari model
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        error: "EMAIL_CONFLICT",
        message: `Email '${email}' sudah terdaftar.`,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Gunakan fungsi dari model
    const newUser = await createUser({
      name: name,
      email: email,
      password_hash: hashedPassword,
      role: role,
    });

    return res.status(201).json({
      message: "Akun berhasil dibuat.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error("Error di registerUser:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan pada server saat memproses pendaftaran.",
    });
  }
};

// Login handler
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Pastikan input anda sesuai",
      });
    }

    // Gunakan fungsi dari model
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: "Email atau password salah",
      });
    }

    // 2. PERBAIKAN LOGIKA: Cek password dulu sebelum membuat JWT
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: "Email atau password salah",
      });
    }

    // 3. Jika password benar, baru buat JWT Token
    const secretKey = process.env.JWT_SECRET;
    const payload = {
      id: user.id,
      role: user.role,
    };
    
    const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
    const expired_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return res.status(200).json({
      message: "Login Berhasil",
      token: token,
      expires_at: expired_at,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at, // Pastikan di schema.prisma field ini ada (biasanya createdAt)
      },
    });
  } catch (error) {
    console.error("Error di loginUser", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan pada server saat login",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};