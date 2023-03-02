const router = require('express').Router();
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

/* Connnect to database */
mongoose.connect(process.env.MONGODB_URI);
const User = require('../models/User');

// configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

router.post('/uploadImage', upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findOne({ steamID: req.user.id })
        console.log(req.file.fieldname)
        user.profilePic = req.file;
        await user.save()
        console.log(user.profilePic[0].fieldname)
        res.redirect('/settings')
    } catch (error) {
        console.log(error)
    }
})

router.post('/savePrimaryGame', async (req, res) => {
    let body = {
        gameId: req.body.gameId,
        gameName: req.body.gameName,
        gameImg: req.body.gameImg
    }
    try {
        const user = await User.findOne({ steamID: req.user.id })
        user.primaryFavGame = body;
        await user.save()

        console.log(user.primaryFavGame[0])
        res.send(true)
    } catch (error) {
        console.log(error)
    }
})

router.post('/saveSecondaryGame', async (req, res) => {
    let body = {
        gameId: req.body.gameId,
        gameName: req.body.gameName,
        gameImg: req.body.gameImg
    }
    try {
        const user = await User.findOne({ steamID: req.user.id })
        user.secondaryFavGame = body;
        await user.save()

        console.log(user.secondaryFavGame[0])
        res.send(true)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;