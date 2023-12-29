const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const secretkey = process.env.PRIVATE_KEY;
const refreshKey = process.env.REFRESH_TOKEN;

const handleLogin = async (req, res) => {
  try {
    const { phoneNo, username, password } = req.body;

    const user = await User.findOne({ phoneNo, username });

    if (!user) {
      return res
        .status(404)
        .json({ message: "This user is not registered!", status: "false" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(404)
        .json({ message: "Incorrect password!", status: "false" });
    }

    const token = jwt.sign({ userId: user.username }, secretkey, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ userId: user.username }, refreshKey, {
      expiresIn: "3d",
    });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
    });
    res
      .status(200)
      .json({
        token: token,
        username: username,
        phoneNo: phoneNo,
        status: "ok",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not login you in", status: "false" });
  }
};

module.exports = handleLogin;
