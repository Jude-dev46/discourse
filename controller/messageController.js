const Message = require("../model/message");

const messageController = async (req, res) => {
  try {
    const { roomId, isSent, message, date, timeStamp, type, senderId } =
      req.body;

    const newMessage = await Message({
      roomId: roomId,
      isSent: isSent,
      message: message,
      senderId: senderId,
      date: date,
      timeStamp: timeStamp,
      type: type,
    });

    await newMessage.save();
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getMessageController = async (req, res) => {
  const { roomId } = req.body;

  try {
    const messages = await Message.find({ roomId });

    res.status(200).json({ status: true, data: messages });

    if (!messages) {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = { messageController, getMessageController };
