const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi untuk mencari ID mentee yang aktif
const getActiveMenteeIds = async (mentorId) => {
  const mentorships = await prisma.mentorship.findMany({
    where: {
      mentor_id: parseInt(mentorId, 10),
      status: "accepted",
    },
    select: { user_id: true },
  });

  return mentorships.map((m) => m.user_id);
};

// [MODIFIKASI] - Dibuat "Lightweight" (Ringan) khusus untuk List Table/Card
const getLogbooksByMenteeIds = async (studentIds, skip, limit) => {
  return await prisma.logbookEntry.findMany({
    where: {
      user_id: { in: studentIds },
      status: { not: "draft" },
    },
    // Menggunakan select untuk HANYA memanggil kolom yang butuh ditampilkan di list
    select: {
      id: true,
      user_id: true,
      activity_date: true,
      title: true,
      status: true,
      status_changed_at: true,
      created_at: true,
      user: {
        select: { id: true, name: true, email: true },
      },
      // description, obstacles, attachments, feedbacks TIDAK dipanggil di sini
    },
    orderBy: [
      { status_changed_at: "desc" },
      { activity_date: "desc" }
    ],
    skip: skip,
    take: limit,
  });
};

// Fungsi untuk menghitung total data (untuk pagination)
const countLogbooksByMenteeIds = async (studentIds) => {
  return await prisma.logbookEntry.count({
    where: {
      user_id: { in: studentIds },
      status: { not: "draft" },
    },
  });
};

// Dipakai untuk mengecek eksistensi data saat evaluasi (hanya ambil ID dan status)
const getLogbookById = async (logbookId) => {
  return await prisma.logbookEntry.findUnique({
    where: { id: parseInt(logbookId, 10) },
  });
};

// [BARU] - Dibuat "Heavyweight" (Lengkap) khusus untuk halaman Detail Logbook
const getLogbookDetailById = async (logbookId) => {
  return await prisma.logbookEntry.findUnique({
    where: { id: parseInt(logbookId, 10) },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      attachments: true,
      feedbacks: true,
    },
  });
};

const checkIsMyMentee = async (mentorId, menteeId) => {
  const relation = await prisma.mentorship.findFirst({
    where: {
      user_id: parseInt(menteeId, 10),
      mentor_id: parseInt(mentorId, 10),
      status: "accepted",
    },
  });
  return relation !== null;
};

const evaluateLogbook = async (logbookId, mentorId, status, feedback) => {
  return await prisma.logbookEntry.update({
    where: { id: parseInt(logbookId, 10) },
    data: {
      status: status,
      feedbacks: {
        create: {
          mentor_id: parseInt(mentorId, 10),
          comment: feedback,
          action: status,
        },
      },
    },
    include: {
      feedbacks: true,
    },
  });
};

module.exports = {
  getActiveMenteeIds,
  getLogbooksByMenteeIds,
  countLogbooksByMenteeIds,
  evaluateLogbook,
  getLogbookById,
  getLogbookDetailById, // <--- Export fungsi baru
  checkIsMyMentee,
};
