const express = require("express");
const router = express.Router();
const { handleRefreshToken } = require("../controller/refreshController");

router.post("/", handleRefreshToken);

module.exports = router;
