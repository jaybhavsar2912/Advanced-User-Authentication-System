const mongoose = require("mongoose");
require("dotenv").config();
const URL = process.env.MongoURL;
console.log("URL-------", URL);

const connectDB = () => {
  mongoose
    .connect(URL)
    .then(() => console.log("Database Connected Successfully!!!!!!"))
    .catch((err) => {
      console.log("somthing went wrong", err);
    });
};
module.exports = connectDB;
