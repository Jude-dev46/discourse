const express = require("express");
const router = express.Router();
const {
  createThreadsController,
  getThreadsController,
} = require("../controller/threadController");

router.post("/", createThreadsController).get("/", getThreadsController);

module.exports = router;
