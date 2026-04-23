const express = require("express");

const postController = require("../controllers/postController");
const voteController = require("../controllers/voteController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.post("/", requireAuth, postController.createPost);
router.put("/:id", requireAuth, postController.updatePost);
router.delete("/:id", requireAuth, postController.deletePost);
router.post("/:id/upvote", requireAuth, voteController.upvotePost);
router.post("/:id/downvote", requireAuth, voteController.downvotePost);

module.exports = router;
