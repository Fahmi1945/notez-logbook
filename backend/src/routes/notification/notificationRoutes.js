    const express = require("express");
    const router = express.Router();
    const { requiredAuth } = require("../../middleware/authMiddleware");
    // Import controller notifikasi
    const { getMyNotifications, markAsRead } = require("../../controllers/notification/notificationController");

    // 🛡️ Pasang middleware 'verifyToken' ke seluruh endpoint di bawah ini
    router.use(requiredAuth);

    // 1. Ambil daftar notifikasi milik user yang sedang login
    // Endpoint: GET /api/notifications
    router.get("/", getMyNotifications);

    // 2. Tandai notifikasi sebagai sudah dibaca
    // Endpoint: PATCH /api/notifications/:id/read
    router.patch("/:id/read", markAsRead);

    module.exports = router;