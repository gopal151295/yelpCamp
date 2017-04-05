var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var Campground = require("./models/campground.js");
var SeedDB = require("./seed.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");

var app = express();
mongoose.connect("mongodb://localhost/yelpcamp");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
console.log(__dirname);

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

app.get("*", function(req, res){
    res.render("toHome");
});

app.listen(3000, function(){
    console.log("Server has started!!! Listening at 3000...");
});