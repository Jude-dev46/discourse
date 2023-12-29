const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: false },
  phoneNo: { type: Number, required: true, unique: false },
  text: { type: mongoose.Schema.Types.Mixed, required: false, unique: true },
  image: { type: String, required: false, unique: false },
  date: { type: Date, required: true, unique: true },
  timeStamp: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("thread", threadSchema);
