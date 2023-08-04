const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();

const User = require("../models/User");

router.get("/login", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("login", { user: req.user });
  } else {
    res.redirect("/");
  }
});

router.get(
  "/auth/steam",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  async (req, res) => {
    res.redirect("/#usersList");

    // save user to database
    try {
      const user = await User.findOne({ steamID: req.user.id });
      // if there is no user then create one
      if (user == null) {
        await User.create({
          steamID: req.user.id,
          steamName: req.user.displayName,
          steamUrl: req.user._json.profileurl,
          steamPic: req.user.photos,
        });
      } else {
        // if there is a user then update the user
        user.steamID = req.user.id;
        user.steamName = req.user.displayName;
        user.steamUrl = req.user._json.profileurl;
        user.steamPic = req.user.photos;
        user.updatedAt = new Date();
        await user.save();
      }
    } catch (error) {
      console.log("db error", error.message);
    }
  }
);

router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("back");
  });
});

module.exports = router;
