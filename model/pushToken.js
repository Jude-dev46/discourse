const mongoose = require("mongoose");

const pushToken = new mongoose.Schema({
  ownerId: String,
  token: String,
});

module.exports = mongoose.model("pushToken", pushToken);
