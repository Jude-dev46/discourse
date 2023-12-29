const express = require("express");
const router = express.Router();
const { getMessageController } = require("../controller/messageController");

router.post("/", getMessageController);

module.exports = router;
