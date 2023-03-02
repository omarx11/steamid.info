const router = require('express').Router();
const SteamAPI = require('steamapi');
const mongoose = require('mongoose');
require('dotenv').config();

/* Connnect to database */
mongoose.connect(process.env.MONGODB_URI);
const Search = require('../models/Search');

const steam = new SteamAPI(process.env.API_KEY);
const regExp = /[a-zA-Z]/g;

async function getUserSummary(id) {
    let user = {};

    await steam.getUserSummary(id).then(res => {
        user.summary = res;
    })
    try {
        await steam.getUserBadges(id).then(res => {
            user.badges = res;
        })
    } catch (error) {
        user.badges = 0;
    }
    return user;
}

router.post('/userStatus', async (req, res) => {
    try {
        const user = await getUserSummary(req.body.steamid)
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})

// Get friends from user id
async function getFriendsId(steam64) {
    let url = `/ISteamUser/GetFriendList/v1/?relationship=friend&steamid=` + steam64;
    let friendsId = [];
    try {
        await steam.get(url, this.baseAPI, process.env.API_KEY).then(response => {
            friendsId = response;
        })
        return friendsId;
    } catch (error) {
        return null;
    }
}

async function getFriendsSummary(Ids) {
    let url = `/ISteamUser/GetPlayerSummaries/v0002/?steamids=` + Ids;
    let friendsSummary = [];
    try {
        await steam.get(url, this.baseAPI, process.env.API_KEY).then(response => {
            friendsSummary = response;
        })
        return friendsSummary;
    } catch (error) {
        return null;
    }
}

// route for getting friends from user id
router.get('/friendsList', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            var friendsArr = [];
            const friends = await getFriendsId(req.user.id);
            
            if (friends) {
                // extracting only steamid's of friends
                friends.friendslist.friends.forEach((friend, index) => {
                    friendsArr[index] = friend.steamid;
                })
                friendsArr = await getFriendsSummary(friendsArr);
            } else {
                // if user have no friends
                friendsArr = null;
            }
            res.json(friendsArr.response)
        }
        catch (error) {
            console.log(error);
        }
    } else {
        res.json(null)
    }
})

router.post('/api/steam/games', async (req, res) => {
    let user_id_req = req.body.steamid;
    let user_id;
    let user_url;
    try {
         // check if input contains a string
        if (regExp.test(user_id_req)) {
            // resolve from custom id to real id
            let id = await steam.resolve('https://steamcommunity.com/id/' + user_id_req)
            user_url = '/IPlayerService/GetOwnedGames/v1?include_played_free_games=true&include_appinfo=true&format=json&steamid=' + id;
            user_id = id;
        } else if (!regExp.test(user_id_req)) {
            user_url = '/IPlayerService/GetOwnedGames/v1?include_played_free_games=true&include_appinfo=true&format=json&steamid=' + user_id_req;
            user_id = user_id_req;
        } else {
            let id = await steam.resolve('https://steamcommunity.com/id/' + user_id_req)
            user_url = '/IPlayerService/GetOwnedGames/v1?include_played_free_games=true&include_appinfo=true&format=json&steamid=' + id;
            user_id = id;
        }
    } catch (error) {
        // msg > steam id not found or the typing is incorrect
        return res.json({
            message: "steam profile is not found",
            error_code: 1,
            success: false
        })
    }

    try {
        let user_games = [];

        // get games data from user id
        await steam.get(user_url, this.baseAPI, process.env.API_KEY).then(data => {
            user_games = data;
        })

        // get user summary
        await steam.getUserSummary(user_id).then(data => {
            user_games['response'].summary = data;
        })

        // check if user id have list of games
        // msg > steam id is private or have no list of games
        if (user_games['response'].game_count === undefined) {
            return res.json({
                message: "steam profile is private",
                error_code: 2,
                success: false
            })
        } else {
            // send data to client
            user_games['response'].success = true;
            res.json(user_games['response']);
        }
    } catch (error) {
        console.log(error)
        return res.json({
            message: "Error entering userId",
            error_code: 3,
            success: false
        })
    }
})

// get steamId from search results
router.post('/getSearchedId', async (req, res) => {
    // save seached id to database
    try {
        if (req.body.steamid) {
            const id = await Search.findOne({ steamID: req.body.steamid })
            if (id == null) {
                await Search.create({ steamID: req.body.steamid })
            } else {
                id.searchedAt = new Date();
                await id.save();
            }
        }

        // get 50 seached ids from database
        const all = await Search.find().sort({searchedAt: -1}).limit(50)

        res.json(all)
    } catch (error) {
        console.log('db error', error.message)
    }
})

module.exports = router;