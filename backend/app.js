const express = require("express");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth/authRoutes");
const logbookRoutes = require("./src/routes/logbook/logbookRoutes");
const mentorshipRoutes = require("./src/routes/user/mentorshipRoutes");
const timMahasiswaRoutes = require("./src/routes/mentor/timMahasiswaRoutes");
const mentorLogbookRoutes = require("./src/routes/mentor/mentorLogbookRoutes");
const notificationRoutes = require("./src/routes/notification/notificationRoutes");
const userRoutes = require("./src/routes/user/userRoutes");

const app = express();

// CSRF butuh cookie-parser atau express-session
app.use(cookieParser());

// app.set("trust proxy", true);
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-XSRF-TOKEN", "X-CSRF-Token"],
    credentials: true,
  }),
);

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Route utama
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Selamat datang di API Notez 🚀",
    version: "1.0.0",
    docs: "/docs",
  });
});

// Routing authentication
app.use("/api/auth", authRoutes);

// Routing tim mahasiswa (mentor)
app.use("/api", timMahasiswaRoutes);

// Routing mentorship
app.use("/api", mentorshipRoutes);

// Routing logbook
app.use("/api/logbook", logbookRoutes);

// Routing mentor logbook
app.use("/api", mentorLogbookRoutes);

// Routing notifikasi
app.use("/api/notifications", notificationRoutes);

// Routing user
app.use("/api", userRoutes);

// Routing upload
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// PERANGKAP 404: Menangkap semua request yang alamatnya salah
app.use((req, res) => {
  console.log("❌ ALARM: Frontend mencoba mengakses rute yang salah!");
  console.log(`Metode: ${req.method}`);
  console.log(`URL yang diakses: ${req.originalUrl}`);

  res.status(404).json({
    error: "NOT_FOUND",
    message: `Rute ${req.method} ${req.originalUrl} tidak ada di server backend ini.`,
  });
});

// Global error handler — menangkap semua error yang di-throw middleware/controller
app.use((err, req, res, next) => {
  console.error("[Global Error]:", err.message, err.stack);
  return res.status(err.status || 500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: err.message || "Terjadi kesalahan pada server."
  });
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Berhasil terhubung ke database Prisma!");

    app.listen(PORT, () => {
      console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:", error);
    process.exit(1);
  }
}

startServer();
