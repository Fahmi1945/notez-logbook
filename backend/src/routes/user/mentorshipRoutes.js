const express = require("express");
const router = express.Router();

const { requestMentorship, getMentorsList, getMentorshipHistory, } = require("../../controllers/user/mentorshipController");
const { getMyTeam, handleMentorshipDecision } = require("../../controllers/mentor/timMahasiswaController");
const verifyToken = require("../../middleware/authMiddleware");

router.post("/mentorship/request/:id", verifyToken, requestMentorship);
router.get("/mentorship", verifyToken, getMentorsList);
router.get("/mentorship/history", verifyToken, getMentorshipHistory, getMyTeam, handleMentorshipDecision);

module.exports = router;