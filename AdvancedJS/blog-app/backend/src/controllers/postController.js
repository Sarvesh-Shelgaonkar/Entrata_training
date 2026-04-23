const mongoose = require("mongoose");

const Post = require("../models/Post");
const Category = require("../models/Category");
const { formatPost } = require("../utils/postFormatter");

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

async function createPost(req, res) {
  try {
    const { title, content, category, imageUrl } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({
        message: "title, content, and category (category id) are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).json({ message: "Category does not exist" });
    }

    const post = await Post.create({
      title: String(title).trim(),
      content: String(content),
      author: req.userId,
      category,
      imageUrl: imageUrl != null ? String(imageUrl).trim() : "",
    });

    const populated = await Post.findById(post._id)
      .populate("author", "name")
      .populate("category", "name");

    return res.status(201).json({ post: formatPost(populated) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not create post" });
  }
}

async function getPosts(req, res) {
  try {
    const sortParam = String(req.query.sort || "latest").toLowerCase();
    if (sortParam !== "latest" && sortParam !== "popular") {
      return res.status(400).json({ message: "sort must be 'latest' or 'popular'" });
    }

    const limit = Math.min(
      Math.max(parseInt(String(req.query.limit), 10) || DEFAULT_LIMIT, 1),
      MAX_LIMIT
    );
    const skip = Math.max(parseInt(String(req.query.skip), 10) || 0, 0);

    const match = {};
    const category = req.query.category;
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
      match.category = new mongoose.Types.ObjectId(category);
    }

    if (sortParam === "popular") {
      const posts = await Post.aggregate([
        { $match: match },
        {
          $addFields: {
            score: {
              $subtract: [
                { $size: { $ifNull: ["$upvotes", []] } },
                { $size: { $ifNull: ["$downvotes", []] } },
              ],
            },
          },
        },
        { $sort: { score: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            let: { authorId: "$author" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },
              { $project: { name: 1 } },
            ],
            as: "authorArr",
          },
        },
        {
          $lookup: {
            from: "categories",
            let: { catId: "$category" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$catId"] } } },
              { $project: { name: 1 } },
            ],
            as: "categoryArr",
          },
        },
        {
          $addFields: {
            author: { $arrayElemAt: ["$authorArr", 0] },
            category: { $arrayElemAt: ["$categoryArr", 0] },
          },
        },
        { $project: { authorArr: 0, categoryArr: 0 } },
      ]);

      const formatted = posts.map((p) => formatPost(p, { includeContent: false }));
      return res.json({ posts: formatted });
    }

    const posts = await Post.find(match)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name")
      .populate("category", "name")
      .lean();

    const formatted = posts.map((p) => formatPost(p, { includeContent: false }));
    return res.json({ posts: formatted });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not load posts" });
  }
}

async function getPostById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id)
      .populate("author", "name")
      .populate("category", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json({ post: formatPost(post, { includeContent: true }) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not load post" });
  }
}

async function updatePost(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.author.equals(req.userId)) {
      return res.status(403).json({ message: "Not allowed to edit this post" });
    }

    const { title, content, category, imageUrl } = req.body;
    if (title !== undefined) post.title = String(title).trim();
    if (content !== undefined) post.content = String(content);
    if (imageUrl !== undefined) post.imageUrl = String(imageUrl).trim();

    if (category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
      const cat = await Category.findById(category);
      if (!cat) {
        return res.status(400).json({ message: "Category does not exist" });
      }
      post.category = category;
    }

    await post.save();

    const populated = await Post.findById(post._id)
      .populate("author", "name")
      .populate("category", "name");

    return res.json({ post: formatPost(populated) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update post" });
  }
}

async function deletePost(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.author.equals(req.userId)) {
      return res.status(403).json({ message: "Not allowed to delete this post" });
    }

    await Post.deleteOne({ _id: id });
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not delete post" });
  }
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
