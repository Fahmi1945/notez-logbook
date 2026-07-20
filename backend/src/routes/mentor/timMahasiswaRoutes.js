const express = require("express");
const router = express.Router();

// Impor middleware 
const verifyToken = require("../../middleware/authMiddleware");

// Impor controller (HANYA CONTROLLER YANG BOLEH ADA DI SINI)
const { handleMentorshipDecision, getMyTeam } = require("../../controllers/mentor/timMahasiswaController");

// Berlaku untuk semua rute di bawahnya
router.use(verifyToken);

// Rute untuk Mentor (Aksi & Lihat Tim)
router.post("/mentorship/:requestId/accepted", handleMentorshipDecision);
router.post("/mentorship/:requestId/rejected", handleMentorshipDecision);
router.get("/mentor/tim", getMyTeam);

module.exports = router;