const express = require("express");
const router = express.Router();
const { messageController } = require("../controller/messageController");

router.post("/", messageController);

module.exports = router;
