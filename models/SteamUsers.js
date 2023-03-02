const mongoose = require('mongoose');

// Schema for Steam Quick LookUp page
const SteamUsersSchema = new mongoose.Schema({
    onlineUsers: String,
    playingNow: String
})

// make a model using the SteamUsers schema
module.exports = mongoose.model('SteamUsers', SteamUsersSchema);