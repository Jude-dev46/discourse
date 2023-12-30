const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const userSchema = new mongoose.Schema({
  refreshToken: { type: String, required: false, unique: true },
  phoneNo: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, unique: true, maxlength: 8 },
  slug: String,
});

userSchema.pre("save", function () {
  this.slug = slugify(this.username, { lower: true });
});

module.exports = mongoose.model("User", userSchema);
