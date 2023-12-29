const express = require("express");
const router = express.Router();
const {
  pushTokenController,
  retrievePushTokenController,
} = require("../controller/pushTokenController");

router.get("/", retrievePushTokenController);
router.post("/", pushTokenController);

module.exports = router;
