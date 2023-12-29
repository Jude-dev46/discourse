require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const InitiateMongoServer = require("./config/db");

const io = socketio(http);

const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const usersRoute = require("./routes/users");
const messageRoute = require("./routes/messageRoute");
const getMessagesRoute = require("./routes/getMessages");
const refreshRoute = require("./routes/refresh");
const uploadFileRoute = require("./routes/fileUpload");
const uploadDpRoute = require("./routes/displayImgRoute");
const downloadFileRoute = require("./routes/fileDownload");
const tokenRoute = require("./routes/token");
const threadRoute = require("./routes/threadRoutes");
const verifyJWT = require("./middleware/verifyJWT");

const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(InitiateMongoServer());
app.use("/auth/signUp", signupRoute);
app.use("/auth/login", loginRoute);
app.use("/refresh", refreshRoute);

app.use(verifyJWT);
app.use("/registeredUsers", usersRoute);
app.use("/sendMessage", messageRoute);
app.use("/getMessages", getMessagesRoute);
app.use("/upload", uploadFileRoute);
app.use("/uploadDp", uploadDpRoute);
app.use("/download", downloadFileRoute);
app.use("/pushToken", tokenRoute);
app.use("/threads", threadRoute);

io.on("connection", (socket) => {
  // Send connection message to other chat room member.
  socket.broadcast.emit("message", "A user is online");

  // Joining a chatroom
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);

    io.to(roomId).emit("User Joined!", { userId: socket.id });
  });

  // sending message
  socket.on(
    "send-message",
    ({ roomId, message, isSent, timeStamp, date, type, senderId }) => {
      io.emit("send-message", {
        msgId: uuidv4(),
        userId: socket.id,
        message: message,
        senderId: senderId,
        isSent: isSent,
        date: date,
        timeStamp: timeStamp,
        type: type,
      });
    }
  );

  // leaving chat room
  socket.on("leaveRoom", ({ roomId }) => {
    io.to(roomId).emit("User is offline left!", { userId: socket.id });
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    io.emit("message", "User is offline");
  });
});

mongoose.connection.once("open", () => {
  http.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
});
