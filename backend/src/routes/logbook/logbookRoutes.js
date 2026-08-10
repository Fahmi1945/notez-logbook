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
const { viewAttachment } = require("../../controllers/attachment/attachmentController.js");
const { exportMyLogbookToPDF } = require("../../controllers/export/exportController.js");

const router = express.Router();

router.use(verifyToken);

//GET SEMUA LOGBOOK
router.get("/", getMyLogbook);

//CREATE
router.post("/", upload.single("attachments"), createLogbook);

//UPDATE
router.put("/:id", upload.single("attachments"), updateLogbook);

//SUBMIT
router.patch("/submit/:id", verifyToken, submitLogbook);

//SUBMIT
router.patch("/:id/submit", verifyToken, submitLogbook);

//DELETE
router.delete("/:id", deleteLogbook);

//EXPORT PDF
router.get("/export/pdf", exportMyLogbookToPDF);

// GET ATTACHMENT
router.get("/attachments/:id", viewAttachment);

//GET DETAIL LOGBOOK
router.get("/:id", getLogbook);


module.exports = router;
