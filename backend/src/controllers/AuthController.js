const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

//register handler
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //validasi input 
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Field name, email, password, dan role wajib diisi.",
      });
    }

    // 3. Cek apakah email sudah pernah didaftarkan
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "EMAIL_CONFLICT",
        message: `Email '${email}' sudah terdaftar.`,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password_hash: hashedPassword,
        role: role,
      },
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


//login handler
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Pastikan input anda sesuai",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: "Email atau password salah",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    const secretKey = process.env.JWT_SECRET;

    const payload = {
      id: user.id,
      role: user.role,
    };
    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret, { expiresIn: "24h" });
    const expired_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: "Email atau password salah",
      });
    }

    return res.status(200).json({
      message: "Login Berhasil",
      token: token,
      expires_at: expired_at,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
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
