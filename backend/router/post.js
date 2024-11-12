const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const fetchuser = require("../middleware/fetchuser");
const Comment = require("../models/Comment");
const User = require("../models/User");

router.post(
  "/createpost",
  fetchuser,
  [body("content", "Content cannot be empty.").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    try {
      const newPost = await Post.create({
        content: req.body.content,
        author: req.user.id,
        institute: req.user.institute,
        image: req.body.image || null,
      });
      const post = await newPost.save();
      res.status(200).send({ message: "Posted successfully.", post });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error.");
    }
  }
);

router.get("/fetchpost", fetchuser, async (req, res) => {
  try {
    const instituteId = req.user.institute;
    const posts = await Post.find({ institute: instituteId });
    res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error.");
  }
});

router.post(
  "/addcomment",
  [
    body("content", "Content is required").exists(),
    body("postId", "Post ID is required").exists(),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(200).send({ message: "User not found." });
      }
      const newComment = await Comment.create({
        user: user.name,
        content: req.body.content,
        postId: req.body.postId,
        author: userId,
      });
      await Post.findByIdAndUpdate(newComment.postId, {
        $push: { comment: newComment._id },
      });
      res.status(201).json({
        message: "Comment added successfully",
        comment: newComment,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error.");
    }
  }
);

router.get("/comments", async (req, res) => {
  const { postId } = req.body;
  if (!postId) {
    return res.status(400).send({ message: "Post ID is required." });
  }
  try {
    const comments = await Comment.find({ postId: postId }).populate(
      "user",
      "likes"
    );
    res.status(200).send(comments);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.post('/addlike',fetchuser, async(req,res)=>
{
  const {postId} = req.body;
  const userId = req.user.id;

  if((!postId)||(!userId))
  {
    return res.status(400).send({message:"Post ID and user ID required."});
  }

  try {
    const post = await Post.findById(postId);
    if(!post)
    {
      return res.status(404).send({ message: "Post not found." });
    }
    const index = post.likes.indexOf(userId);
    if(index === -1)
    {
      post.likes.push(userId);
    }
    else
    {
      post.likes.splice(index,1);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
  
});

router.get('/likes', async(req,res)=>
{
  const {postId} = req.body;
  try {
    const post = await Post.findById(postId);
    if(!post)
    {
      return res.status(404).send({ message: "Post not found." });
    }
    const likes = post.likes;
    res.status(200).send(likes);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
})

module.exports = router;
