var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground.js");
var SeedDB = require("./seed.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");

var commentRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js");

var app = express();
mongoose.connect("mongodb://localhost/yelpcamp");

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

//Passport config
app.use(require("express-session")({
    secret: "This is just a random secret phrase",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//SeedDB();

app.listen(3000, function(){
    console.log("Server has started!!! Listening at 3000...");
});