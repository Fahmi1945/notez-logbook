const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken"); // Sesuaika
const { getMenteeLogbooks, getMenteeLogbookDetail, evaluatedDataLogbook } = require("../../controllers/mentor/mentorLogbookController");


// Rute untuk mengambil daftar logbook menti
router.get("/mentor/logbook", verifyToken, getMenteeLogbooks);

// Rute untuk mengambil detail logbook menti
router.get("/mentor/logbook/:id", verifyToken, getMenteeLogbookDetail);

// Rute untuk mengevaluasi logbook menti (Approve/Reject + Comment)
router.patch("/mentor/logbook/:id/evaluate", verifyToken, evaluatedDataLogbook);

module.exports = router;
