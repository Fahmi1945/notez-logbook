// src/models/users.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi FIND BY EMAIL
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Fungsi CREATE USER
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