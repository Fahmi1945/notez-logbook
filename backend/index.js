// index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { register } = require('../controllers/authController'); // Pastikan path ini benar

const app = express();
const prisma = new PrismaClient();
const PORT = 3002;

// Middleware WAJIB agar server bisa membaca format JSON dari Postman/Next.js
app.use(express.json());

// Endpoint untuk registrasi
app.post('/auth/register', register);

// Endpoint untuk login
app.post('/auth/login', login);

// Fungsi untuk menjalankan server sekaligus mengecek koneksi database
async function startServer() {
  try {
    // 1. Cek koneksi database terlebih dahulu
    const count = await prisma.user.count();
    console.log("Berhasil terhubung ke database Prisma!");
    console.log(`Jumlah user saat ini: ${count}`);

    // 2. Jika database aman, nyalakan server Express
    app.listen(PORT, () => {
      console.log(`Server backend berjalan di http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Gagal terhubung ke database, server tidak dinyalakan:");
    console.error(error);
  }
}

// Eksekusi fungsi
startServer();