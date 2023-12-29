const bcrypt = require("bcrypt");
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
      const user = await User({
        phoneNo: phoneNo,
        username: username,
        password: hashPassword,
      });

      await user.save();
      res.status(201).json({ message: "User successfully created!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!, could not connect" });
  }
};

module.exports = handleSignup;
