// app.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('../routes/authRoutes'); // Memanggil file routing barumu

const app = express();
const {authLimiter} = require('../middleware/rateLimiter'); // Memanggil middleware rate limiter
const prisma = new PrismaClient();
// Mengambil PORT dari .env jika ada, jika tidak pakai 3002
const PORT = process.env.PORT || 3002; 

// Middleware WAJIB agar bisa membaca format JSON
app.use(express.json());

// Menggunakan routing untuk semua endpoint yang berawalan '/auth'
app.use('/auth', authRoutes);

// Fungsi untuk menyalakan server dan mengecek database
async function startServer() {
  try {
    // Tes koneksi database
    await prisma.$connect();
    console.log(" Berhasil terhubung ke database Prisma!");
    
    // Nyalakan server
    app.listen(PORT, () => {
      console.log(` Server backend berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Gagal terhubung ke database:");
    console.error(error);
  }
}

startServer();