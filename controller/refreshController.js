const User = require("../model/user");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.sendStatus(401);

    const existingUser = await User.findOne({ refreshToken: refreshToken });
    if (!existingUser) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err || existingUser.username !== decoded.userId) {
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = { handleRefreshToken };
