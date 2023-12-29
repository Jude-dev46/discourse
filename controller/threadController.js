const Threads = require("../model/threads");

const createThreadsController = async (req, res) => {
  try {
    const { username, phoneNo, text, imageUrl, date, timeStamp } = req.body;

    const foundThread = await Threads.findOne({ text, imageUrl });

    if (foundThread)
      return res
        .status(409)
        .json({ status: false, message: "Duplicate thread found!" });

    if (!imageUrl && !text) {
      return res
        .status(403)
        .json({ status: false, message: "Post content cannot be empty!" });
    }
    const newThread = await Threads({
      username: username,
      phoneNo: phoneNo,
      text: text,
      image: imageUrl,
      date: date,
      timeStamp: timeStamp,
    });

    await newThread.save();
    res
      .status(201)
      .json({ status: true, message: "Thread sent!", data: newThread });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Server error occurred!" });
  }
};

const getThreadsController = async (req, res) => {
  try {
    const foundThread = await Threads.find(
      {},
      "username phoneNo text image date timeStamp"
    );

    if (!foundThread) {
      return res
        .status(404)
        .json({ status: false, message: "Threads not found!" });
    } else {
      res
        .status(200)
        .json({ status: true, message: "Threads found!", data: foundThread });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Server error occurred!" });
  }
};

module.exports = { createThreadsController, getThreadsController };
