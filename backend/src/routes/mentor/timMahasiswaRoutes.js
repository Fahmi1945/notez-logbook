const express = require("express");
const router = express.Router();

// Impor middleware (Mundur 2 langkah ke folder src/)
const verifyToken = require("../../middleware/verifyToken");
// const checkRole = require("../../middleware/roleMiddleware"); // Asumsi nama file role middleware-mu

// Impor controller
const { handleMentorshipDecision, getMyTeam } = require("../../controllers/mentor/timMahasiswaController");

router.use(verifyToken);
// router.use(checkRole("mentor")); // Hanya mengizinkan role mentor lolos

router.post("/mentorship/:requestId/accepted", handleMentorshipDecision);
router.post("/mentorship/:requestId/rejected", handleMentorshipDecision);
// router.get("/mentorship/history", getMyTeam);

module.exports = router;