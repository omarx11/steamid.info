const router = require('express').Router();
const SteamAPI = require('steamapi');
const mongoose = require('mongoose');
require('dotenv').config();

/* Connnect to database */
mongoose.connect(process.env.MONGODB_URI);
const User = require('../models/User');

const steam = new SteamAPI(process.env.API_KEY);

router.get('/', (req, res) => {
    res.render('index', { user: req.user })
})

router.get('/store', (req, res) => {
    res.render('store', { user: req.user })
})

router.get('/settings', ensureAuthenticated, async (req, res) => {
    try {
        const userId = await User.findOne({ steamID: req.user.id })
        if (userId != null) {
            res.render('settings', {
                user: req.user,
                userLoggin: userId
            })
        } else {
            res.redirect('back')
        }
    } catch (error) {
        console.log(error)
    }
})

async function getUserSummary(id) {
    let user = [];
    await steam.getUserSummary(id).then(res => {
        user.summary = res;
    })
    return user;
}

router.get('/user/:id', async (req, res) => {
    var userUpdate = await User.findOne({ steamID: req.params.id })

    if (userUpdate != null) {
        userUpdate = {
            prfilePic: userUpdate.profilePic[0],
            primaryFavGame: userUpdate.primaryFavGame[0],
            secondaryFavGame: userUpdate.secondaryFavGame[0]
        }
    } else {
        userUpdate = {
            prfilePic: null,
            primaryFavGame: null,
            secondaryFavGame: null
        }
    }

    try {
        const userSummary = await getUserSummary(req.params.id)
        res.render('profile', {
            user: req.user,
            userFetched: userSummary,
            userUpdate: userUpdate
        })
    } catch {
        res.render('profile', {
            user: null,
            userFetched: null,
            userUpdate: userUpdate
        })
    }
})

router.get('/user', async (req, res) => {
    res.redirect('/')
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/')
}

module.exports = router;