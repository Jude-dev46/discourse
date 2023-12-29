const User = require("../model/user");

const registeredUserController = async (req, res) => {
  try {
    const users = await User.find({}, "phoneNo username refreshToken");

    if (!users) return res.status(404).json({ message: "No user found" });

    res.status(201).json({ status: true, data: users });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = registeredUserController;
