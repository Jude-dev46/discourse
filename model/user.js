const crypto = require("crypto");
const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
// const validator = require("validator");

const userSchema = new mongoose.Schema({
  refreshToken: { type: String, unique: true },
  phoneNo: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: true,
    unique: true,
    maxlength: 8,
    select: false,
  },
  slug: String,
  refreshTokenExpires: Date,
});

userSchema.pre("save", function () {
  this.slug = slugify(this.username, { lower: true });
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.refreshToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.refreshTokenExpires = Date.now() + 10 * 69 * 1000;
};

module.exports = mongoose.model("User", userSchema);
