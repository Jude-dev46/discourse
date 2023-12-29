const express = require("express");
const router = express.Router();
const {
  handleDisplayImgUpload,
  retrieveUploadedImages,
} = require("../controller/fileController");

router.post("/", handleDisplayImgUpload).get("/", retrieveUploadedImages);

module.exports = router;
