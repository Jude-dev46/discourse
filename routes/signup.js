const express = require("express");
const router = express.Router();
const signUpController = require("../controller/signupController");

router.post("/", signUpController);

module.exports = router;
