var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");

router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Some error while fetching campgrounds");
        }
        else{
            res.render("campground/index", {campgrounds:campgrounds});
        }
    });
    
});

router.post("/", function(req, res){
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

router.get("/new", function(req, res){
    res.render("campground/new");
});

router.get("/:id", function(req, res){
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

function isLoggedIn(req, res, next){
    if  (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
