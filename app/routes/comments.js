var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");

router.get("/new", isLoggedIn, function(req, res){
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

router.post("/", isLoggedIn, function(req, res){
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
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   
                   comment.save();
                   
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + req.params.id);
               }
           });
        }
    });
    
});

function isLoggedIn(req, res, next){
    if  (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
