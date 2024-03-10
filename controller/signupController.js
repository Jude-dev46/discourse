const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const handleSignup = async (req, res) => {
  try {
    const { phoneNo, username, confirmedPassword } = req.body;
    console.log(phoneNo, username, confirmedPassword);

    const hashPassword = await bcrypt.hash(confirmedPassword, 10);

    if (!phoneNo || !username || !hashPassword) {
      return res
        .status(400)
        .json({ message: "Username, phone number and password are required!" });
    }

    const user = await User.findOne({ phoneNo });

    if (user) {
      return res.status(409).json({ message: "This user already exists." });
    } else {
      const user = await User.create({
        phoneNo: phoneNo,
        username: username,
        password: hashPassword,
      });

      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(201).json({ message: "User successfully created!", token });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error!, could not connect", error });
  }
};

module.exports = handleSignup;
