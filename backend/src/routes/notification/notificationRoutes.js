const express = require("express");
const router = express.Router();
const { requiredAuth } = require("../../middleware/authMiddleware");
// Import controller notifikasi
const { getMyNotifications, markAsRead, markAllAsRead } = require("../../controllers/notification/notificationController");

// 🛡️ Pasang middleware 'verifyToken' ke seluruh endpoint di bawah ini
router.use(requiredAuth);

// Ambil daftar notifikasi milik user yang sedang login
router.get("/", getMyNotifications);

// Tandai notifikasi sebagai sudah dibaca
router.patch("/:id/read", markAsRead);

// Tandai semua notifikasi sebagai sudah dibaca
router.patch("/read-all", markAllAsRead);

module.exports = router;