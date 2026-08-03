const {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
  getLogbookByIdAndUser,
  updateLogbookStatusToSubmitted,
} = require("../../models/logbookModel");
const { createNotificationData } = require("../../models/notificationModel");
const { checkAcceptedMentorship } = require("../../models/mentorshipModel");

const path = require("path");
const fs = require("fs");
// const { error } = require("console");

const getMyLogbook = async (req, res) => {
  try {
    const userId = req.user.id;
    const logbook = await getLogbookById(userId);
    if (!logbook) {
      return res.status(404).json({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Logbook berhasil diambil.",
      data: logbook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat mengambil logbook.",
    });
  }
};

const createLogbook = async (req, res) => {
  try {
    const { activity_date, title, description, obstacles } = req.body;
    const userId = req.user.id;

    if (!activity_date || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi.",
      });
    }

    // LOGIKA VALIDASI TANGGAL (ANTI TANGGAL MASA DEPAN)
    const inputDate = new Date(activity_date);
    const today = new Date();
    
    // Set 'today' ke penghujung hari (23:59:59) agar jika inputnya hari ini tetap lolos
    today.setHours(23, 59, 59, 999);

    if (inputDate > today) {
      return res.status(400).json({
        success: false,
        message: "Tanggal kegiatan tidak boleh melebihi hari ini (tidak boleh tanggal masa depan).",
      });
    }

    // 2. Rakit data tanpa menyertakan user_id (gunakan relasi connect) dan tanpa attachments null
    const logbookData = {
      activity_date: inputDate, // Langsung pakai inputDate yang sudah di-parsing di atas
      title,
      description,
      obstacles: obstacles || null,
      user: {
        connect: {
          id: parseInt(userId),
        },
      },
    };

    // 3. Tambahkan attachments secara dinamis HANYA jika file benar-benar ada
    if (req.file) {
      logbookData.attachments = {
        create: [
          {
            file_name: req.file.originalname,
            file_path: `/uploads/${req.file.filename}`,
          },
        ],
      };
    }

    // 4. Kirim ke model
    const logbook = await createLogbookEntry(logbookData);

    return res.status(201).json({
      success: true,
      message: "Logbook berhasil dibuat.",
      data: logbook,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat membuat logbook.",
    });
  }
};

//detail logbook
const getLogbook = async (req, res) => {
  try {
    const userId = req.user.id;
    const logbookId = req.params.id;

    if (isNaN(logbookId)) {
      return res.status(400).json({
        success: false,
        message: "ID Logbook tidak valid.",
      });
    }

    const logbook = await getLogbookDetail(logbookId, userId);

    if (!logbook) {
      return res.status(404).json({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logbook berhasil diambil.",
      data: logbook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat mengambil detail logbook.",
    });
  }
};

const updateLogbook = async (req, res) => {
  try {
    const { activity_date, title, description, obstacles, status } = req.body;
    const logbookId = req.params.id;
    const userId = req.user.id;

    const existingLogbook = await getLogbookDetail(logbookId, userId);
    if (!existingLogbook) {
      return res.status(404).json({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    }

    const updatedData = {};
    if (activity_date) updatedData.activity_date = new Date(activity_date); // Pastikan ini dikonversi ke Date
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (obstacles !== undefined) updatedData.obstacles = obstacles;
    if (status) updatedData.status = status;

    if (req.file) {
      if (existingLogbook.attachments && existingLogbook.attachments.length > 0) {
        existingLogbook.attachments.forEach((attachment) => {
          // PERBAIKAN 1: Ambil nama file-nya saja dari string "/uploads/nama-file.jpg"
          const safeFileName = path.basename(attachment.file_path);

          const baseUploadsDir = path.join(process.cwd(), "uploads");
    
          const file_path = `${baseUploadsDir}/${safeFileName}`;

          if (fs.existsSync(file_path)) {
            fs.unlinkSync(file_path);
          }
        });
      }
      updatedData.attachments = {
        deleteMany: {},
        create: [
          {
            file_name: req.file.originalname,
            // PERBAIKAN 3: Gunakan backtick (`) dan perbaiki nama variabel menjadi req.file.filename
            file_path: `/uploads/${req.file.filename}`,
          }
        ]
      };
    }

    const updated = await updateLogbookEntry(logbookId, updatedData);
    if (!updated) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat memperbarui logbook.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Logbook berhasil diperbarui.",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat memperbarui logbook.",
    });
  }
};

const deleteLogbook = async (req, res) => {
  try {
    const logbookId = req.params.id;
    const userId = req.user.id;

    const existingLogbook = await getLogbookDetail(logbookId, userId);
    if (!existingLogbook) {
      return res.status(404).json({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    }

    if (existingLogbook.attachments && existingLogbook.attachments.length > 0) {
      existingLogbook.attachments.forEach((attachment) => {
        
        const safeFileName = path.basename(attachment.file_path);

        const baseUploadsDir = path.join(process.cwd(), "uploads");
        
        // nosemgrep: javascript.lang.security.audit.path-traversal.path-join-resolve-traversal.path-join-resolve-traversal
        const file_path = `${baseUploadsDir}/${safeFileName}`;

        if (fs.existsSync(file_path)) {
          fs.unlinkSync(file_path);
        }
      });
    }

    const deleted = await deleteLogbookEntry(logbookId);
    if (!deleted) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat menghapus logbook.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Logbook berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat menghapus logbook.",
    });
  }
};

const submitLogbook = async (req, res) => {
  try {
    const logbookId = parseInt(req.params.id);
    const userId = req.user.id;
    const userName = req.user.name || "Seseorang"; // Ambil nama mahasiswa dari token

    const logbook = await getLogbookByIdAndUser(logbookId, userId);
    if (!logbook) {
      return res.status(404).json({
        success: false,
        message: "Logbook tidak ditemukan.",
      });
    }

    if (logbook.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Logbook sudah tidak dalam status draft.",
      });
    }

    if (!logbook.title || !logbook.description) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Logbook tidak memiliki judul atau deskripsi.",
      });
    }

    const updatedLogbook = await updateLogbookStatusToSubmitted(logbookId);

    // KIRIM NOTIFIKASI KE MENTOR AKTIF
    const activeMentor = await checkAcceptedMentorship(userId);
    if (activeMentor) {
      await createNotificationData({
        user_id: activeMentor.mentor_id, // Kirim ke ID Mentor
        message: `Mahasiswa bimbingan Anda (${userName}) telah mengirimkan logbook baru dengan judul "${logbook.title}" untuk di-review.`,
        logbook_id: Number(logbookId),
      });
      console.log(`✅ BERHASIL: Notifikasi submit logbook dikirim ke Mentor ID: ${activeMentor.mentor_id}`);
    }

    return res.status(200).json({
      success: true,
      message: "Logbook berhasil disubmit dan menunggu evaluasi mentor.",
      data: updatedLogbook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Terjadi kesalahan saat submit logbook.",
    });
  }
};

module.exports = {
  getMyLogbook,
  createLogbook,
  getLogbook,
  updateLogbook,
  deleteLogbook,
  submitLogbook,
};
