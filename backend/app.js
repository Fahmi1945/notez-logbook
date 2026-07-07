const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const logbookRoutes = require("./src/routes/logbookRoutes");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3333;

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

// Routing logbook
app.use("/api/logbook", logbookRoutes);

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
