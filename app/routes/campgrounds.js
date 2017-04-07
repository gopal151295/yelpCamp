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

router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var campground = {name : name , image: image, description: description, author: author};
    Campground.create(campground, function(err, newlyCreated){
        if(err){
            console.log("Some error while saving campground");
        }
        else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/new", isLoggedIn, function(req, res){
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

router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.render( "campground/edit" , {campground: foundCampground});
        }
    });
});

router.put("/:id",  checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

function isLoggedIn(req, res, next){
    if  (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect("back");
    }
}

module.exports = router;
