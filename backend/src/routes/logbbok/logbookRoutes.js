const express = require("express");
const { 
  getMyLogbook, 
  createLogbook, 
  getLogbook, 
  updateLogbook, 
  deleteLogbook 
} = require("../../controllers/logbookController.js");
const verifyToken = require("../../middleware/verifyToken.js");

const router = express.Router();

router.use(verifyToken);

//GET SEMUA LOGBOOK
router.get("/", getMyLogbook);

//CREATE
router.post("/", createLogbook);

//UPDATE
router.put("/:id", updateLogbook);

//DELETE
router.delete("/:id", deleteLogbook);

//GET DETAIL LOGBOOK
router.get("/:id", getLogbook);

module.exports = router;
