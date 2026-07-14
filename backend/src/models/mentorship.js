const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk menyimpan request baru
const createMentorship = async (userId, mentorId) => {
    return await prisma.mentorship.create({
        data: {
            user_id: parseInt(userId),
            mentor_id: parseInt(mentorId)
        }
    });
};

// fungsi cek request pending
const findPendingRequest = async (userId, mentorId) => {
  return await prisma.mentorship.findFirst({
    where: {
      user_id: parseInt(userId),
      mentor_id: parseInt(mentorId),
      status: "pending",
    },
  });
};

const getMyRequestedMentors = async (userId) => {
  return await prisma.mentorship.findMany({
    where: {
      user_id: parseInt(userId) // Hanya mengambil data milik mahasiswa ini
    },
    include: {
      // Kita "tarik" data mentor dari tabel User untuk mendapatkan nama dan emailnya
      mentor: { 
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      id: 'desc' // Diurutkan dari request yang paling baru (ID terbesar)
    }
  });
};

const getQueueList = async (mentorId) => {
  return await prisma.mentorship.findMany({
    where: {
      mentor_id: parseInt(mentorId),
      status: "pending" // Hanya mengambil yang butuh persetujuan (pending)
    },
    // Menarik data Mahasiswa (user) agar mentor tahu siapa yang request
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      id: 'asc' // Diurutkan dari yang paling lama antre (First In, First Out)
    }
  });
};

// Mengubah status mentorship (accepted/rejected) berdasarkan requestId
const updateMentorshipStatus = async (requestId, newStatus, information) => {
  return await prisma.mentorship.update({
    where: { id: parseInt(requestId) },
    data: { 
      status: newStatus,
      information: information 
    },
  });
};

const getAllStudentsByMentor = async (mentorId) => {
  return await prisma.mentorship.findMany({
    where: {
      mentor_id: parseInt(mentorId),
      // Kita HAPUS filter status: "accepted" agar semua status (pending, accepted, rejected) ikut tertarik!
    },
    include: {
      user: { // Tetap menarik data profil mahasiswa
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      id: 'desc' // Diurutkan dari yang paling baru mengajukan
    }
  });
};

module.exports = { createMentorship, findPendingRequest, getMyRequestedMentors, getQueueList, updateMentorshipStatus, getAllStudentsByMentor };