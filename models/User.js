const mongoose = require("mongoose");

// Schema for a user
const UserSchema = new mongoose.Schema({
  steamID: String,
  steamName: String,
  steamUrl: String,
  profilePic: {
    type: Array,
    default: [],
  },
  steamPic: {
    type: Array,
    default: [],
  },
  primaryFavGame: {
    type: Array,
    default: [],
  },
  secondaryFavGame: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: Date,
});

// make a model using the User schema
module.exports = mongoose.model("User", UserSchema);
