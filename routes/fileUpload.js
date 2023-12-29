const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const { handleFileUpload } = require("../controller/fileController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname;
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 },
});

router.post("/", upload.single("file"), handleFileUpload);

module.exports = router;
