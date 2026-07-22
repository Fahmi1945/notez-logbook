const express = require("express");
const {
  getMyLogbook,
  createLogbook,
  getLogbook,
  updateLogbook,
  deleteLogbook,
  submitLogbook,
} = require("../../controllers/logbook/logbookController.js");
const verifyToken = require("../../middleware/verifyToken.js");
const upload = require("../../middleware/uploadsFile.js");

const router = express.Router();

router.use(verifyToken);

//GET SEMUA LOGBOOK
router.get("/", getMyLogbook);

//CREATE
router.post("/", upload.single("attachment"), createLogbook);

//UPDATE
router.put("/:id", upload.single("attachment"), updateLogbook);

//SUBMIT
router.patch("/:id/submit", verifyToken, submitLogbook);

//DELETE
router.delete("/:id", deleteLogbook);

//GET DETAIL LOGBOOK
router.get("/:id", getLogbook);

module.exports = router;
