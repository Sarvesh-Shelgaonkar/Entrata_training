const mongoose = require("mongoose");

function toObjectId(userId) {
  if (userId instanceof mongoose.Types.ObjectId) return userId;
  return new mongoose.Types.ObjectId(String(userId));
}


function applyUpvote(post, userId) {
  const uid = toObjectId(userId);
  const upIdx = post.upvotes.findIndex((id) => id.equals(uid));
  if (upIdx !== -1) {
    post.upvotes.splice(upIdx, 1);
  } else {
    post.upvotes.push(uid);
    post.downvotes = post.downvotes.filter((id) => !id.equals(uid));
  }
}


function applyDownvote(post, userId) {
  const uid = toObjectId(userId);
  const downIdx = post.downvotes.findIndex((id) => id.equals(uid));
  if (downIdx !== -1) {
    post.downvotes.splice(downIdx, 1);
  } else {
    post.downvotes.push(uid);
    post.upvotes = post.upvotes.filter((id) => !id.equals(uid));
  }
}

function voteScore(post) {
  const up = post.upvotes?.length ?? 0;
  const down = post.downvotes?.length ?? 0;
  return up - down;
}

module.exports = {
  applyUpvote,
  applyDownvote,
  voteScore,
  toObjectId,
};
