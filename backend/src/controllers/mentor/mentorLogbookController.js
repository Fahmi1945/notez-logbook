// Import fungsi-fungsi dari file model
const mentorModel = require("../../models/mentorLogbookModel");

const getMenteeLogbooks = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Pastikan tipe datanya angka
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // 1. Panggil Model untuk mencari ID menti
    const studentIds = await mentorModel.getActiveMenteeIds(mentorId);

    // Jika tidak ada menti, langsung kembalikan respons kosong
    if (studentIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Belum ada logbook dari menti Anda.",
        data: [],
        meta: { total: 0, page: Number(page), limit: take, totalPages: 0 }
      });
    }

    // 2. Panggil Model untuk mengeksekusi pengambilan data dan hitung total
    const [logbooks, totalData] = await Promise.all([
      mentorModel.getLogbooksByMenteeIds(studentIds, skip, take),
      mentorModel.countLogbooksByMenteeIds(studentIds)
    ]);

    // 3. Kembalikan respons sukses ke Front-End
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

const evaluateLogbook = async (req, res) => {
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

    const logbook = await mentorModel.getLogbookById(logbookId);

    if (!logbook) {
      return res.status(404).json({
        error: "LOGBOOK_NOT_FOUND",
        message: "Logbook tidak ditemukan",
      });
    }

    if (logbook.mentorId !== mentorId) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Anda tidak memiliki izin untuk mengakses logbook ini",
      });
    }

    if (logbook.status !== "submitted") {
      return res.status(400).json({
        error: "INVALID_STATUS",
        message: "Logbook tidak dapat dinilai karena belum disubmit",
      });
    }

    const isMyMentee = await mentorModel.isMyMentee(mentorId, logbook.menteeId);

    if (!isMyMentee) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "Anda tidak memiliki izin untuk mengakses logbook ini",
      });
    }

    const evaluatedData = await mentorModel.evaluateLogbook(logbookId, status, finalComment);

    return res.status(200).json({
      status: "success",
      message: `Logbook berhasil di-${status} dan feedback telah disimpan`,
      data: evaluatedData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengevaluasi logbook",
      error: error.message,
    });
  }
};

module.exports = {
  getMenteeLogbooks,
  evaluateLogbook,
};
