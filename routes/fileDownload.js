const express = require("express");
const router = express.Router();
const { handleFileDownload } = require("../controller/fileController");

router.get("/:filename", handleFileDownload);

module.exports = router;
