// src/models/users.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mencari user berdasarkan email
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Fungsi untuk menyimpan user baru ke database
const createUser = async (data) => {
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password_hash: data.password_hash, 
      role: data.role,                   
    },
  });
};

module.exports = { findUserByEmail, createUser };