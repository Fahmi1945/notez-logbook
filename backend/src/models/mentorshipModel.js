const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 1. Fungsi untuk menyimpan request baru
const createMentorship = async (userId, mentorId) => {
  return await prisma.mentorship.create({
    data: {
      user_id: parseInt(userId),
      mentor_id: parseInt(mentorId)
    }
  });
};

const checkExistingRequest = async (userId, mentorId) => {
  return await prisma.mentorship.findFirst({
    where: {
      user_id: parseInt(userId),
      mentor_id: parseInt(mentorId),
      // Kita hapus filter status agar menangkap pending, accepted, dan rejected
    },
  });
};

// 3. Mengambil riwayat pengajuan MAHASISWA (Semua status)
const getMyRequestedMentors = async (userId) => {
  return await prisma.mentorship.findMany({
    where: { user_id: parseInt(userId) },
    include: {
      mentor: { 
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { id: "desc" }
  });
};

const getMentorRequestsHistory = async (mentorId) => {
  return await prisma.mentorship.findMany({
    where: {
      mentor_id: parseInt(mentorId),
      status: { in: ["pending"] } // Hanya pending 
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { id: "desc" }
  });
};

const getMentorActiveTeam = async (mentorId) => {
  return await prisma.mentorship.findMany({
    where: {
      mentor_id: parseInt(mentorId),
      status: "accepted" // Hanya mahasiswa yang sudah disetujui
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { id: "desc" }
  });
};

// 6. Mengubah status mentorship (accepted/rejected)
const updateMentorshipStatus = async (requestId, newStatus, information) => {
  return await prisma.mentorship.update({
    where: { id: parseInt(requestId) },
    data: { 
      status: newStatus,
      information: information 
    },
  });
};

// 7. Mengambil 1 request berdasarkan ID (Anti-Spam Mentor)
const getMentorshipById = async (requestId) => {
  return await prisma.mentorship.findUnique({
    where: { id: parseInt(requestId) }
  });
};

const checkAcceptedMentorship = async (userId) => {
  return await prisma.mentorship.findFirst({
    where: {
      user_id: parseInt(userId),
      status: "accepted" // Hanya mencari yang sudah disetujui
    },
    include: {
      // Kita tarik sekalian data mentornya untuk ditampilkan di Frontend
      mentor: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

// 🔴 PASTIKAN SEMUA FUNGSI DI-EXPORT
module.exports = { 
  createMentorship, 
  checkExistingRequest, 
  getMyRequestedMentors, 
  getMentorRequestsHistory, 
  getMentorActiveTeam, 
  updateMentorshipStatus, 
  getMentorshipById, 
  checkAcceptedMentorship 
};