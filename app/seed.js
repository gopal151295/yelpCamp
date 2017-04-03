var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

var data = [
    {   
        name : "Camp 1",
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description : "hskdhks aksdhfkasj askdhfksd kasdgfkashd aksdfaks daksdfkasd"
    },
    {   
        name : "Camp 2",
        image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
        description : "hskdhks aksdhfkasj askdhfksd kasdgfkashd aksdfaks daksdfkasd"
    },
    {   
        name : "Camp 3",
        image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg",
        description : "hskdhks aksdhfkasj askdhfksd kasdgfkashd aksdfaks daksdfkasd"
    },
    {   
        name : "Camp 4",
        image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg",
        description : "hskdhks aksdhfkasj askdhfksd kasdgfkashd aksdfaks daksdfkasd"
    }
]

function seedDB(){
    Campground.remove({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            console.log("Removed all campgrounds...");
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    }
                    else{
                    console.log("saved campground");
                    Comment.create(
                        {
                            text: "this is a comment kshfkjsdlfajsljflsdflashdolasnlas",
                            author: "gopu"
                        }, 
                        function(err, comment){
                             if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("saved comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;