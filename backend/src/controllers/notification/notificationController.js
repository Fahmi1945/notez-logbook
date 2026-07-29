const {
  getNotificationsByUserId,
  countUnreadNotificationsByUserId,
  markNotificationAsReadData,
  markAllNotificationsAsReadData,
  deleteNotificationData,
} = require("../../models/notificationModel");

const getAuthenticatedUserId = (req) => {
  return req.user?.id ?? req.user?.userId ?? req.auth?.id ?? req.auth?.userId ?? null;
};

// GET /api/notifications
const getMyNotifications = async (req, res) => {
  try {
    // Pengaman fleksibel membaca ID user dari token JWT
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "User belum terautentikasi.",
      });
    }

    console.log("🔍 [DEBUG] GET /api/notifications dipanggil oleh User ID:", userId);

    // Eksekusi bersamaan query list notifikasi & hitung unread
    const [notifications, unreadCount] = await Promise.all([
      getNotificationsByUserId(userId),
      countUnreadNotificationsByUserId(userId),
    ]);

    console.log(`📦 [DEBUG] Ditemukan ${notifications.length} notifikasi untuk User ID: ${userId}`);

    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data notifikasi.",
      data: {
        unreadCount,
        notifications,
      },
    });
  } catch (error) {
    console.error("Error di getMyNotifications:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Gagal mengambil data notifikasi.",
    });
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const notificationId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "User belum terautentikasi.",
      });
    }

    if (isNaN(notificationId)) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "ID Notifikasi tidak valid.",
      });
    }

    const result = await markNotificationAsReadData(notificationId, userId);

    if (result.count === 0) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Notifikasi tidak ditemukan atau Anda tidak memiliki akses.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Notifikasi berhasil ditandai sebagai dibaca.",
    });
  } catch (error) {
    console.error("Error di markAsRead:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Gagal memperbarui status notifikasi.",
    });
  }
};

// PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "User belum terautentikasi.",
      });
    }

    await markAllNotificationsAsReadData(userId);

    return res.status(200).json({
      status: "success",
      message: "Semua notifikasi berhasil ditandai sebagai dibaca.",
    });
  } catch (error) {
    console.error("Error di markAllAsRead:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Gagal memperbarui semua notifikasi.",
    });
  }
};

// DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const notificationId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "User belum terautentikasi.",
      });
    }

    if (isNaN(notificationId)) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "ID Notifikasi tidak valid.",
      });
    }

    const result = await deleteNotificationData(notificationId, userId);

    if (result.count === 0) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Notifikasi tidak ditemukan atau Anda tidak memiliki akses.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Notifikasi berhasil dihapus.",
    });
  } catch (error) {
    console.error("Error di deleteNotification:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Gagal menghapus notifikasi.",
    });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};