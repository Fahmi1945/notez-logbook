const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//tampilkan logbook berdasarkan id user
const getLogbookById = async (user_id) => {
  return await prisma.logbookEntry.findMany({
    where: {
      user_id: parseInt(user_id, 10),
    },
    include: {
      attachments: true,
    },
    orderBy: {
      activity_date: "desc",
    },
  });
};

const getLogbookByIdAndUser = async (logbookId, userId) => {
  return await prisma.logbookEntry.findFirst({
    where: {
      id: parseInt(logbookId, 10),
      user_id: parseInt(userId, 10),
    },
  });
};

const updateLogbookStatusToSubmitted = async (logbookId) => {
  return await prisma.logbookEntry.update({
    where: {
      id: parseInt(logbookId, 10),
    },
    data: {
      status: "submitted",
      status_changed_at: new Date(),
    },
    include: {
      attachments: true,
    },
  });
};

//CREATE
const createLogbookEntry = async (data) => {
  return await prisma.logbookEntry.create({
    data: data,
    include: {
      attachments: true,
    },
  });
};

//DETAIL
const getLogbookDetail = async (logbookId, userId) => {
  return await prisma.logbookEntry.findFirst({
    where: {
      id: parseInt(logbookId, 10),
      user_id: parseInt(userId, 10),
    },
    include: {
      attachments: true,
    },
  });
};

//UPDATE
const updateLogbookEntry = async (logbookId, data) => {
  return await prisma.logbookEntry.update({
    where: {
      id: parseInt(logbookId, 10),
    },
    data: data,
    include: {
      attachments: true,
    },
  });
};

//DELETE
const deleteLogbookEntry = async (logbookId) => {
  return await prisma.logbookEntry.delete({
    where: {
      id: parseInt(logbookId, 10),
    },
    include: {
      attachments: true,
    },
  });
};


const getLogbooksForExport = async (userId, startDate, endDate) => {
  // 1. Siapkan kondisi dasar (hanya milik user ini & status approved)
  const queryConditions = {
    user_id: parseInt(userId), // Sesuaikan jika di schema Anda menggunakan user_id
    status: "approved"
  };

  // 2. Tambahkan filter tanggal JIKA user mengirimkan parameternya
  if (startDate || endDate) {
    queryConditions.activity_date = {}; // Inisialisasi object tanggal

    if (startDate) {
      // gte = greater than or equal (Lebih dari sama dengan startDate)
      queryConditions.activity_date.gte = new Date(startDate);
    }

    if (endDate) {
      // lte = less than or equal (Kurang dari sama dengan endDate)
      // Tambahkan waktu 23:59:59 agar mencakup waktu sampai akhir hari tersebut
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      queryConditions.activity_date.lte = endOfDay;
    }
  }

  // 3. Eksekusi query ke database
  return await prisma.logbookEntry.findMany({
    where: queryConditions,
    orderBy: { activity_date: "asc" }, // Urutkan dari terlama ke terbaru
    include: {
      attachments: true, // Bawa serta relasi attachment
      feedbacks: true,
    }
  });
};

// Tambahkan fungsi ini
const getAllLogbooksByUserId = async (userId) => {
  return await prisma.logbookEntry.findMany({ // <--- SESUAIKAN KATA 'logbookEntry' DENGAN YANG ADA DI FUNGSI LAIN
    where: {
      user_id: parseInt(userId), // Jika error, ganti userId menjadi user_id (sesuai schema Anda)
      status: "approved",
    },
    orderBy: { activity_date: "asc" }, // Urutkan dari yang terlama ke terbaru
    include: {
      attachments: true,
      feedbacks: true,
    }
  });
};



module.exports = {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
  getLogbookByIdAndUser,
  updateLogbookStatusToSubmitted,
  getAllLogbooksByUserId,
  getLogbooksForExport,
};
