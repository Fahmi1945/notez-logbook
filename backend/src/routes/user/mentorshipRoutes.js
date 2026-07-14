const express = require("express");
const router = express.Router();

const {
  requestMentorship,
  getMentorsList,
  getMentorshipHistory,
} = require("../../controllers/mentorshipController");
const verifyToken = require("../../middleware/verifyToken");

router.use(verifyToken);
router.post("/mentorship/request/:id", verifyToken, requestMentorship);
router.get("/mentorship", verifyToken, getMentorsList);
router.get("/mentorship/history", verifyToken, getMentorshipHistory, getMyTeam, handleMentorshipDecision);
// router.post("/mentorship/:id/accept", updateStatus);

module.exports = router;
