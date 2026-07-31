// src/models/users.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true, // sesuaikan nama field di schema.prisma
      password_hash: true, // jangan ambil password hash 
    }
  });
};

// Update data profil user
const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });
};

// Fungsi FIND BY EMAIL
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Fungsi mengambil data semua mentor
const findMentors = async () => {
  return await prisma.user.findMany({
    where: { 
      role: "mentor" 
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
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

module.exports = { findUserByEmail, createUser, findMentors, findUserById, updateUser };