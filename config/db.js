const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.DATABASE_URL;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
    });
    console.log("Connected to DB!!!");
  } catch (e) {
    console.log("Connection failed with: ", e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
