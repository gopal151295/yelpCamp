var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("home");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local") (req, res, function(){
            req.flash("success", "Welcome to YelpCamp :)");
            res.redirect("/campgrounds");
        });
    });
});

//login
router.get("/login", function(req, res){
    res.render("login",{message: req.flash("error")});
});

router.post("/login", passport.authenticate("local", 
                 {
                    successRedirect: "/campgrounds",
                    failureRedirect: "/login"
                }), function(req, res){
   
});

//logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully logged you out :)");
    res.redirect("/campgrounds");
});


module.exports = router;

