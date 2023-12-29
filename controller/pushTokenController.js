const pushToken = require("../model/pushToken");

const pushTokenController = async (req, res) => {
  try {
    const { username, token } = req.body;

    const foundToken = await pushToken.findOne({ token });

    if (foundToken)
      return res
        .status(401)
        .json({ status: false, message: "Token already exists!" });

    if (!foundToken) {
      const newToken = await pushToken({ ownerId: username, token: token });
      await newToken.save();
    }
    res.status(201).json({ status: true, message: "Token data stored!" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server responded with an error!" });
  }
};

const retrievePushTokenController = async (_req, res) => {
  try {
    const foundTokens = await pushToken.find({}, "token ownerId");

    if (!foundTokens) return res.status(404).json({ message: "No user found" });

    res.status(200).json({ status: true, data: foundTokens });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server responded with an error!" });
  }
};

module.exports = { pushTokenController, retrievePushTokenController };
