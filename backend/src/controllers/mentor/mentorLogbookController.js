const { getActiveMenteeIds, getLogbooksByMenteeIds, countLogbooksByMenteeIds, checkIsMyMentee, evaluateLogbook, getLogbookById, getLogbookDetailById } = require("../../models/mentorLogbookModel");
const { createNotificationData } = require("../../models/notificationModel");


// Ambil data logbook dari menti yang aktif (Endpoint List - Ringan)
const getMenteeLogbooks = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const studentIds = await getActiveMenteeIds(mentorId);

    if (studentIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Belum ada logbook dari menti Anda.",
        data: [],
        meta: { total: 0, page: Number(page), limit: take, totalPages: 0 }
      });
    }

    const [logbooks, totalData] = await Promise.all([
      getLogbooksByMenteeIds(studentIds, skip, take),
      countLogbooksByMenteeIds(studentIds)
    ]);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data logbook menti",
      data: logbooks,
      meta: {
        total: totalData,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(totalData / take),
      },
    });

  } catch (error) {
    console.error("Error getMenteeLogbooks:", error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Terjadi kesalahan internal pada server",
    });
  }
};

// [BARU] - Endpoint Detail Logbook Lengkap
const getMenteeLogbookDetail = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const logbookId = req.params.id;

    if (isNaN(logbookId)) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "ID Logbook tidak valid.",
      });
    }

    // Ambil data lengkap beserta deskripsi, lampiran, dan feedback
    const logbook = await getLogbookDetailById(logbookId);

    if (!logbook) {
      return res.status(404).json({
        error: "LOGBOOK_NOT_FOUND",
        message: "Detail logbook tidak ditemukan.",
      });
    }

    // Granular Access Control: Pastikan yang diakses adalah mentee-nya sendiri
    const isMyMentee = await checkIsMyMentee(mentorId, logbook.user_id);
    if (!isMyMentee) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Anda tidak memiliki izin untuk melihat detail logbook mentee ini.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil detail logbook.",
      data: logbook,
    });
  } catch (error) {
    console.error("Error getMenteeLogbookDetail:", error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Terjadi kesalahan saat mengambil detail logbook.",
    });
  }
};

// Evaluasi data logbook oleh mentor
const evaluatedDataLogbook = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const logbookId = req.params.id;
    const { status, feedback } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "INVALID_STATUS",
        message: "Status tidak valid",
      });
    }

    if (status === "rejected" && (!feedback || feedback.trim() === "")) {
      return res.status(400).json({
        error: "INVALID_FEEDBACK",
        message: "Feedback wajib diisi jika logbook ditolak",
      });
    }

    const finalComment = feedback || "Logbook disetujui";

    const logbook = await getLogbookById(logbookId);

    if (!logbook) {
      return res.status(404).json({
        error: "LOGBOOK_NOT_FOUND",
        message: "Logbook tidak ditemukan",
      });
    }

    if (logbook.status !== "submitted") {
      return res.status(400).json({
        error: "INVALID_STATUS",
        message: "Logbook tidak dapat dinilai karena belum disubmit",
      });
    }
    const isMyMentee = await checkIsMyMentee(mentorId, logbook.user_id);

    if (!isMyMentee) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Anda tidak memiliki izin untuk mengakses logbook ini",
      });
    }

    const evaluatedData = await evaluateLogbook(logbookId, mentorId, status, finalComment);

    // ✨ FIX: Definisikan dulu targetUserId mengambil dari logbook.user_id
    const targetUserId = logbook.user_id;

    if (targetUserId) {
      await createNotificationData({
        user_id: targetUserId,
        message: `Logbook Anda telah di-${status} oleh mentor dengan catatan: "${finalComment}"`,
        logbook_id: Number(logbookId), // Menghubungkan logbook_id sesuai ERD
      });
      console.log(`✅ BERHASIL: Notifikasi dikirim ke Mahasiswa ID: ${targetUserId}`);
    }

    return res.status(200).json({
      status: "success",
      message: `Logbook berhasil di-${status} dan feedback telah disimpan`,
      data: evaluatedData,
    });
  } catch (error) {
    console.error("Error di evaluatedDataLogbook:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengevaluasi logbook",
      error: error.message,
    });
  }
};


module.exports = {
  getMenteeLogbooks,
  getMenteeLogbookDetail, // <--- Jangan lupa di-export
  evaluatedDataLogbook,
};