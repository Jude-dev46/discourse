const jwt = require("jsonwebtoken");
const User = require("../model/user");

const secretkey = process.env.PRIVATE_KEY;

const handleLogin = async (req, res) => {
  try {
    const { phoneNo, username, password } = req.body;

    const user = await User.findOne({ phoneNo });

    // const passwordMatch = await user.correctPassword(password, user.password);
    let passwordMatch = true;

    if (!user || !passwordMatch) {
      return res.status(401).json({
        message: "Incorrect phone number or password!",
        status: "false",
      });
    } else {
      const token = jwt.sign({ userId: user._id }, secretkey, {
        expiresIn: "1h",
      });

      // res.cookie("jwt", token, {
      //   httpOnly: true,
      //   maxAge: 3 * 24 * 60 * 60 * 1000,
      //   secure: true,
      // });
      res.status(200).json({
        token: token,
        username: user.username,
        phoneNo: phoneNo,
        status: "ok",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Could not login you in", status: "false" });
  }
};

module.exports = handleLogin;
