const mongoose = require("mongoose");

const displayImage = new mongoose.Schema({
  user: String,
  img: String,
});

module.exports = mongoose.model("DisplayImg", displayImage);
