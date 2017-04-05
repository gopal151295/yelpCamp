var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground.js");
var SeedDB = require("./seed.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");

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

SeedDB();

app.get("/", function(req, res){
    res.render("home");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Some error while fetching campgrounds");
        }
        else{
            res.render("campground/index", {campgrounds:campgrounds});
        }
    });
    
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var campground = {name : name , image: image, description: description};
    Campground.create(campground, function(err, campground){
        if(err){
            console.log("Some error while saving campground");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
    
});

app.get("/campgrounds/new", function(req, res){
    res.render("campground/new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err){
            console.log("There was error in finding campground");
            console.log(err);
        }
        else{
            res.render("campground/show", {campground: foundCampground});
        }
    } );
    
});

app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
         if (err){
            console.log("There was error in finding campground");
            console.log(err);
        }
        else{
            res.render("comment/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id,function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                    console.log(err);
               }
               else{
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + req.params.id);
               }
           });
        }
    });
    
});

//===============
//ROUTES
//===============
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local", function(){
            res.redirect("/campgrounds");
        });
    });
});

//login
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
                 {
                    successRedirect: "/campgrounds",
                    failureRedirect: "/login"
                }), function(req, res){
   
});


app.get("*", function(req, res){
    res.render("toHome");
});

app.listen(3000, function(){
    console.log("Server has started!!! Listening at 3000...");
});