var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
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

router.post("/", middleware.isLoggedIn, function(req, res){
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
                   req.flash("success", "Successfully added the comment");
                   res.redirect("/campgrounds/" + req.params.id);
               }
           });
        }
    });
    
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comment/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Successfully updated the comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Successfully removed the comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;
