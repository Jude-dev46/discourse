const mongoose = require("mongoose");
const slugify = require("slugify");

const userSchema = new mongoose.Schema({
  refreshToken: { type: String, required: false, unique: true },
  phoneNo: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  slug: String,
});

userSchema.pre("save", function () {
  this.slug = slugify(this.username, { lower: true });
});

module.exports = mongoose.model("User", userSchema);
