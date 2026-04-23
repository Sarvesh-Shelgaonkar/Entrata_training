import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import { getCategories } from "../api/categories";
import PostCard from "../components/PostCard";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (activeCategory) params.category = activeCategory;
      const res = await getPosts(params);
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [sort, activeCategory]);

  const handleVoteUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  return (
    <div className="home-page">
      <div className="home-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${sort === "latest" ? "active" : ""}`}
            onClick={() => setSort("latest")}
          >
            Latest
          </button>
          <button
            className={`filter-tab ${sort === "popular" ? "active" : ""}`}
            onClick={() => setSort("popular")}
          >
            Popular
          </button>
        </div>

        <div className="category-pills">
          <button
            className={`cat-pill ${activeCategory === "" ? "active" : ""}`}
            onClick={() => setActiveCategory("")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty">No posts yet. Be the first to write one!</div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onVote={handleVoteUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
