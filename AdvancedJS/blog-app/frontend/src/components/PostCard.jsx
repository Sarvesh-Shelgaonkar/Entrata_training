import { Link } from "react-router-dom";
import { upvotePost, downvotePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import "./PostCard.css";

export default function PostCard({ post, onVote }) {
  const { isLoggedIn } = useAuth();

  const handleVote = async (type) => {
    if (!isLoggedIn) return;
    try {
      const fn = type === "up" ? upvotePost : downvotePost;
      const res = await fn(post.id);
      if (onVote) onVote(res.data.post);
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <article className="post-card">
      <div className="post-votes">
        <button
          className="vote-btn"
          onClick={() => handleVote("up")}
          disabled={!isLoggedIn}
          title="Upvote"
        >
          ▲
        </button>
        <span className="vote-score">{post.score ?? 0}</span>
        <button
          className="vote-btn"
          onClick={() => handleVote("down")}
          disabled={!isLoggedIn}
          title="Downvote"
        >
          ▼
        </button>
      </div>

      <div className="post-body">
        <div className="post-meta">
          {post.category?.name && (
            <span className="post-category">{post.category.name}</span>
          )}
          <span className="post-author">
            by {post.author?.name || "Unknown"}
          </span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
        </div>

        <Link to={`/posts/${post.id}`} className="post-title">
          {post.title}
        </Link>

        <div className="post-stats">
          <span>↑ {post.upvotes}</span>
          <span>↓ {post.downvotes}</span>
        </div>
      </div>
    </article>
  );
}
