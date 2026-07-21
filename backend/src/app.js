const express = require("express");
const cors = require("cors");
const app = express();

// 1. Impor routes
const authRoutes = require("./routes/authRoutes");

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoutes);

// Rute tes dasar
app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API Sistem NOTEZ" });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
});
