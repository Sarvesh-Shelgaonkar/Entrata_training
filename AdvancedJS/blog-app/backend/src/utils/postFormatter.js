
function formatPost(post, options = {}) {
  const { includeContent = true } = options;
  const up = post.upvotes?.length ?? 0;
  const down = post.downvotes?.length ?? 0;

  let authorOut = post.author;
  if (authorOut && typeof authorOut === "object" && authorOut._id) {
    authorOut = { id: authorOut._id, name: authorOut.name };
  } else if (authorOut) {
    authorOut = { id: post.author };
  }

  let categoryOut = post.category;
  if (categoryOut && typeof categoryOut === "object" && categoryOut._id) {
    categoryOut = { id: categoryOut._id, name: categoryOut.name };
  } else if (categoryOut) {
    categoryOut = { id: post.category };
  }

  return {
    id: post._id,
    title: post.title,
    ...(includeContent && { content: post.content }),
    author: authorOut,
    category: categoryOut,
    imageUrl: post.imageUrl || "",
    upvotes: up,
    downvotes: down,
    score: up - down,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

module.exports = { formatPost };
