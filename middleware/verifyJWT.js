const { promisify } = require("util");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../model/user");

const verifyJWT = async (err, req, res, next) => {
  const authHeader = req.header.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ status: false, message: "This token is invalid!" });

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  const currentUser = await User.findById(decoded.id);
  if (currentUser)
    return res
      .status(401)
      .json({ status: false, message: "User does not exists anymore!" });

  next();
};

module.exports = verifyJWT;
