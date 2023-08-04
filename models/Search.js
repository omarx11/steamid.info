const mongoose = require("mongoose");

// Schema for a searched steamId
const SearchSchema = new mongoose.Schema({
  steamID: String,
  searchedAt: {
    type: Date,
    default: () => new Date(),
  },
});

module.exports = mongoose.model("Search", SearchSchema);
