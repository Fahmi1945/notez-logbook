const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken"); // Sesuaika
const { getMenteeLogbooks, evaluatedDataLogbook } = require("../../controllers/mentor/mentorLogbookController");


// Rute untuk mengambil daftar logbook menti
router.get("/mentor/logbook", verifyToken, getMenteeLogbooks);

// Rute untuk mengevaluasi logbook menti (Approve/Reject + Comment)
router.patch("/mentor/logbook/:id/evaluate", verifyToken, evaluatedDataLogbook);

module.exports = router;
