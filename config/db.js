require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => console.error(error));
};

module.exports = connectDB;
