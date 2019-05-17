const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true
    });
    console.log("Mongo connected and running");
  } catch (err) {
    console.error("Mongoose: " + err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
