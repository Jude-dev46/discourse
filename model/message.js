const mongoose = require("mongoose");
const slugify = require("slugify");

const messageSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  roomId: { type: String, required: true },
  isSent: Boolean,
  message: { type: mongoose.Schema.Types.Mixed, required: true },
  senderId: { type: String, required: true },
  slug: String,
  date: { type: Date, required: true },
  timeStamp: { type: String, required: true },
  type: { type: String, required: true },
});

messageSchema.pre("save", function (next) {
  this.slug = slugify(this.message, { lower: true });
  next();
});

module.exports = mongoose.model("Message", messageSchema);
