const {
  getLogbookById,
  createLogbookEntry,
  getLogbookDetail,
  updateLogbookEntry,
  deleteLogbookEntry,
} = require("../models/logbookModel");

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

    const logbook = await createLogbookEntry({
      user_id: parseInt(userId),
      activity_date: new Date(activity_date),
      title,
      description,
      obstacles: obstacles || null,
    });
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
    if (activity_date) updatedData.activity_date = activity_date;
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (obstacles) updatedData.obstacles = obstacles;
    if (status) updatedData.status = status;

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

module.exports = {
  getMyLogbook,
  createLogbook,
  getLogbook,
  updateLogbook,
  deleteLogbook,
};
