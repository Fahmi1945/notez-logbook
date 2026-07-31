const {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
  getLogbookByIdAndUser,
  updateLogbookStatusToSubmitted,
} = require("../../models/logbookModel");

const { deleteSupabaseAttachments } = require("../attachment/attachmentController");

const supabase = require("../../config/supabase");

// GET MY LOGBOOK
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

// CREATE LOGBOOK
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

    let attachmentsFile = null;
    if (req.file) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const cleanFilename = req.file.originalname.replace(/\s+/g, "-");
      const fileName = `${uniqueSuffix}-${cleanFilename}`;

      const { error } = await supabase.storage
        .from("attachments")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (error) {
        console.error("Error upload file supabase", error);
        return res.status(500).json({
          success: false,
          message: "Gagal mengunggah file attachment ke server penyimpanan.",
        });
      }

      // PERUBAHAN:
      // getPublicUrl dihapus. Kita hanya menyimpan fileName
      // yang akan digunakan sebagai identifier saat generate Signed URL nanti.
      attachmentsFile = {
        file_name: req.file.originalname,
        file_path: fileName,
      };
    }

    // 1. Rakit data tanpa menyertakan user_id (gunakan relasi connect)
    const logbookData = {
      activity_date: new Date(activity_date),
      title,
      description,
      obstacles: obstacles || null,
      user: {
        connect: {
          id: parseInt(userId),
        },
      },
    };

    // 2. Tambahkan attachments secara dinamis HANYA jika file benar-benar ada
    if (attachmentsFile) {
      logbookData.attachments = {
        create: [attachmentsFile],
      };
    }

    // 3. Kirim ke model
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

//update logbook
const updateLogbook = async (req, res) => {
  try {
    // Tambahkan remove_attachment untuk menangkap sinyal dari frontend
    const { activity_date, title, description, obstacles, status, remove_attachment } = req.body;
    const logbookId = req.params.id;
    const userId = req.user.id;

    const existingLogbook = await getLogbookDetail(logbookId, userId);
    if (!existingLogbook) {
      return res.status(404).json({ success: false, message: "Logbook tidak ditemukan." });
    }

    const updatedData = {};
    if (activity_date) updatedData.activity_date = new Date(activity_date);
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (obstacles !== undefined) updatedData.obstacles = obstacles;
    if (status) updatedData.status = status;

    // SKENARIO 1: User sengaja menghapus attachment lama tanpa upload yang baru
    if (String(remove_attachment) === "true") {
      if (existingLogbook.attachments && existingLogbook.attachments.length > 0) {
        // 1. Hapus file fisik di Supabase
        await deleteSupabaseAttachments(existingLogbook.attachments);
        // 2. Beri instruksi ke Prisma untuk menghapus relasi di DB
        updatedData.attachments = {
          deleteMany: {},
        };
      }
    }

    // SKENARIO 2: User mengupload attachment baru (menggantikan yang lama)
    if (req.file) {
      // Pastikan file lama di Supabase terhapus lebih dulu jika ada
      if (existingLogbook.attachments && existingLogbook.attachments.length > 0) {
        await deleteSupabaseAttachments(existingLogbook.attachments);
      }

      // Proses upload file baru ke Supabase
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const cleanOriginalName = req.file.originalname.replace(/\s+/g, "_");
      const fileName = `${uniqueSuffix}-${cleanOriginalName}`;

      const { error: uploadError } = await supabase.storage
        .from("attachments")
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

      if (uploadError) {
        console.error("Error upload update supabase:", uploadError);
        throw uploadError;
      }

      // PERUBAHAN: getPublicUrl Dihapus.
      // Kita langsung menyimpan 'fileName' ke dalam database (Sesuai skema Private Bucket)

      // Simpan data file baru ke DB sekaligus hapus data file lama (jika Skenario 1 belum tereksekusi)
      updatedData.attachments = {
        deleteMany: {},
        create: [{
          file_name: req.file.originalname,
          file_path: fileName, // <--- Hanya menyimpan nama file
        }],
      };
    }

    // Simpan semua perubahan ke database
    const updated = await updateLogbookEntry(logbookId, updatedData);

    return res.status(200).json({
      success: true,
      message: "Logbook berhasil diperbarui.",
      data: updated
    });

  } catch (error) {
    console.error("Error update logbook:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan saat memperbarui logbook."
    });
  }
};
//delete logbook
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

    // 1. HAPUS FILE FISIK DI SUPABASE
    if (existingLogbook.attachments && existingLogbook.attachments.length > 0) {
      // Panggil helper yang sudah kita buat
      await deleteSupabaseAttachments(existingLogbook.attachments);
    }

    // 2. HAPUS DATA DI DATABASE
    // Catatan: Prisma biasanya akan otomatis menghapus attachment di database
    // jika kamu menggunakan onDelete: Cascade di schema.prisma
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

//submit logbook
const submitLogbook = async (req, res) => {
  try {
    const logbookId = parseInt(req.params.id);
    const userId = req.user.id;

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
