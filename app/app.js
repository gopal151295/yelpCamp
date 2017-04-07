var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground.js");
var SeedDB = require("./seed.js");
var flash = require("connect-flash");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var methodOverride = require("method-override");

var commentRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js");

var app = express();
//mongoose.connect("mongodb://localhost/yelpcamp");
//mongoose.connect("mongodb://gopal:151295@ds155150.mlab.com:55150/myyelpcamp");

var url = process.env.DATABASEURL || "mongodb://localhost/yelpcamp";
mongoose.connect(url);


app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

//SeedDB();

app.listen((process.env.PORT || 5000), function(){
    console.log("Server has started!!! Listening at 3000...");
});