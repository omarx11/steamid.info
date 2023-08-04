const mongoose = require("mongoose");

// Schema for Steam Quick LookUp page
const SteamTopSchema = new mongoose.Schema({
  topGames: {
    type: Array,
    default: [],
  },
  records: {
    type: Array,
    default: [],
  },
});

// make a model using the SteamTop schema
module.exports = mongoose.model("SteamTop", SteamTopSchema);
