const fs = require("fs");
const path = require("path");
const displayImg = require("../model/displayImage");

const handleFileDownload = (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(__dirname, "../uploads", filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err, data) => {
      if (err) {
        res.status(404).send("Could not download file!");
      }
    });
  } else {
    res.status(404).send("File not found!");
  }
};

const handleFileUpload = (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ message: "No file sent!" });
  }

  const fileUrl = `http://192.168.0.2:8000/uploads/${file.filename}`;

  res.json({ message: "File successfully saved!", data: fileUrl });
};

const handleDisplayImgUpload = async (req, res) => {
  const { user, img } = req.body;

  if (!user || !img)
    return res
      .status(400)
      .json({ status: false, message: "No image uploaded!" });

  const existingDp = await displayImg.findOne({ img });

  if (existingDp) {
    return res
      .status(409)
      .json({ status: false, message: "This image is already uploaded!" });
  } else {
    const file = await displayImg({ user: user, img: img });

    await file.save();
    res.status(200).json({ status: "successful", message: file });
  }
};

const retrieveUploadedImages = async (req, res) => {
  try {
    const images = await displayImg.find({}, "user img");

    if (!images)
      return res
        .status(404)
        .json({ status: false, message: "No uploaded images found!" });

    res.status(200).json({ status: true, message: "Successful", data: images });
  } catch (error) {
    console.log("Error!", error);
    res.sendStatus(500);
  }
};

module.exports = {
  handleFileDownload,
  handleFileUpload,
  handleDisplayImgUpload,
  retrieveUploadedImages,
};
