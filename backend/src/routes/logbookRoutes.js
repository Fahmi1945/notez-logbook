const express = require("express");
const { 
  getMyLogbook, 
  createLogbook, 
  getLogbook, 
  updateLogbook, 
  deleteLogbook 
} = require("../controllers/logbookController");
const verifyToken = require("../middleware/verifyToken.js");

const router = express.Router();

router.use(verifyToken);

router.get("/", getMyLogbook);
router.post("/", createLogbook);
router.put("/:id", updateLogbook);
router.delete("/:id", deleteLogbook);
router.get("/:id", getLogbook);

module.exports = router;