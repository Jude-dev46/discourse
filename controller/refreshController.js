const User = require("../model/user");

const handleRefreshToken = async (req, res) => {
  try {
    const { phoneNo } = req.body;

    const existingUser = await User.findOne({ phoneNo });
    if (!existingUser)
      return res
        .status(404)
        .json({ status: false, message: "User with this token not found!" });

    const refreshToken = existingUser.createResetPasswordToken();
    await existingUser.save({ validateBeforeSave: false });

    // Using Expo sms to send the reset token to the user phoneNo for password reset

    res.status(200).json({
      status: true,
      message: "Refreshtoken successfully sent to your email",
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = { handleRefreshToken };
