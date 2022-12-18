//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { request } = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to Divya's Blog."
const aboutContent = "This is a technology blog platform. Here we will provide you only interesting content, which you will like very much. We're dedicated to providing you the best of technology, with a focus on dependability and technology. We're working to turn our passion for technology into a booming online website.  We hope you enjoy our blog as much as we enjoy offering them to you.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);



app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});


app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", async(req, res) => {
  const post = new Post ({
    title : req.body.postTitle,
    content : req.body.postBody
  })
  await post.save(function(err){
    if (!err){
     res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

// const findPost = (postTitle) =>{
//   for(const post of posts){
//     if(_.lowerCase(post.title) === postTitle){
//       return post;
//     }
//   }
// }

// app.get("/posts/:title", function(req, res){
//   const postTitle = _.lowerCase(req.params.title);
//   const post = findPost(postTitle);
//   res.render("post", {
//     title: post.title,
//     content: post.content
//   })
// });

app.get("/about", function(req, res){
  res.render("about", {aboutContent : aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact");
})





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
