import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, getPostById, updatePost } from "../api/posts";
import { getCategories } from "../api/categories";
import "./PostForm.css";

export default function PostForm() {
  const { id } = useParams(); // undefined for create, set for edit
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getPostById(id)
      .then((res) => {
        const p = res.data.post;
        setTitle(p.title);
        setContent(p.content || "");
        setCategory(p.category?.id || "");
        setImageUrl(p.imageUrl || "");
      })
      .catch(() => setError("Could not load post"));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = { title, content, category, imageUrl };
      if (isEdit) {
        await updatePost(id, data);
        navigate(`/posts/${id}`);
      } else {
        const res = await createPost(data);
        navigate(`/posts/${res.data.post.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <form className="post-form" onSubmit={handleSubmit}>
        <h1>{isEdit ? "Edit Post" : "Write a Post"}</h1>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            placeholder="An interesting title..."
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Image URL (optional)
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            placeholder="Write your thoughts..."
          />
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Publish"}
        </button>
      </form>
    </div>
  );
}
