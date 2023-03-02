// import modules
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const passportSteam = require('passport-steam');
const SteamStrategy = passportSteam.Strategy;
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Required to get data from user for sessions
passport.serializeUser(function(user, done) {
	done(null, user)
})
passport.deserializeUser(function(obj, done) {
	done(null, obj)
})

// bypass cors error
app.use(cors({ origin: true }))
app.options('*', cors())

// passport login
passport.use(new SteamStrategy({
    returnURL: process.env.BASE_URL + '/auth/steam/return',
    realm: process.env.BASE_URL + '/',
    apiKey: process.env.API_KEY
    }, function(identifier, profile, done) {
        process.nextTick(function () {
            profile.identifier = identifier;
            return done(null, profile);
        });
    }
));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 1
    } // 1 hour
}))
app.use(passport.initialize())
app.use(passport.session())

// setup view engine
app.set('view engine', 'ejs')

// setup app configuration
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.static('uploads'))

// routes middleware
app.use(require('./routes/pages'))
app.use(require('./routes/routes'))
app.use(require('./routes/login'))
app.use(require('./routes/steam'))
app.use(require('./routes/profilePic'))

app.get('*', (req, res) => {
    res.render('404')
})

// start server listening
app.listen(port, () => {
    console.log('server booting...')
})