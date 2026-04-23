import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostById, deletePost, upvotePost, downvotePost } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import "./PostDetail.css";

export default function PostDetail() {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getPostById(id)
      .then((res) => setPost(res.data.post))
      .catch(() => setError("Post not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      navigate("/");
    } catch (err) {
      setError("Could not delete post");
    }
  };

  const handleVote = async (type) => {
    if (!isLoggedIn) return;
    try {
      const fn = type === "up" ? upvotePost : downvotePost;
      const res = await fn(id);
      setPost(prev => ({ ...prev, ...res.data.post, content: prev.content }));
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  if (loading) return <div className="detail-page"><p className="loading">Loading...</p></div>;
  if (error) return <div className="detail-page"><p className="error">{error}</p></div>;
  if (!post) return null;

  const isAuthor = user && post.author?.id === user.id;

  return (
    <div className="detail-page">
      <article className="detail-card">
        <div className="detail-header">
          <div className="detail-meta">
            {post.category?.name && (
              <span className="detail-category">{post.category.name}</span>
            )}
            <span>by {post.author?.name || "Unknown"}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <h1>{post.title}</h1>

          <div className="detail-actions-row">
            <div className="detail-vote-row">
              <button className="vote-btn" onClick={() => handleVote("up")} disabled={!isLoggedIn}>▲</button>
              <span className="vote-score">{post.score ?? 0}</span>
              <button className="vote-btn" onClick={() => handleVote("down")} disabled={!isLoggedIn}>▼</button>
            </div>

            {isAuthor && (
              <div className="detail-owner-actions">
                <Link to={`/posts/${id}/edit`} className="btn-secondary">Edit</Link>
                <button className="btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        </div>

        <div className="detail-content">
          {post.content}
        </div>
      </article>
    </div>
  );
}
