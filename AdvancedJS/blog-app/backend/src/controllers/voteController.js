const mongoose = require("mongoose");

const Post = require("../models/Post");
const { applyUpvote, applyDownvote, voteScore } = require("../utils/voteHelpers");
const { formatPost } = require("../utils/postFormatter");

async function upvotePost(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    applyUpvote(post, req.userId);
    await post.save();

    const populated = await Post.findById(post._id)
      .populate("author", "name")
      .populate("category", "name");

    return res.json({
      post: formatPost(populated, { includeContent: false }),
      score: voteScore(populated),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update vote" });
  }
}

async function downvotePost(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    applyDownvote(post, req.userId);
    await post.save();

    const populated = await Post.findById(post._id)
      .populate("author", "name")
      .populate("category", "name");

    return res.json({
      post: formatPost(populated, { includeContent: false }),
      score: voteScore(populated),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update vote" });
  }
}

module.exports = {
  upvotePost,
  downvotePost,
};
