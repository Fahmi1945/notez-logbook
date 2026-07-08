const express = require("express");
const router = express.Router();

const { requestMentorship, getMentorsList, getMentorshipHistory } = require("../controllers/mentorshipController");

router.post("/mentorship/request/:id", requestMentorship);
router.get("/mentorship", getMentorsList);
router.get("/mentorship/history", getMentorshipHistory);
// router.post("/mentorship/:id/accept", updateStatus);

module.exports = router;