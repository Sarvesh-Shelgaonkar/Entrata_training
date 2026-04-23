import { useState, useEffect } from "react";
import { getMyProfile, updateProfile } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: "", headline: "", location: "", website: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((res) => {
        setProfile(res.data.profile);
        setForm({
          bio: res.data.profile.bio || "",
          headline: res.data.profile.headline || "",
          location: res.data.profile.location || "",
          website: res.data.profile.website || "",
        });
      })
      .catch(() => setError("Could not load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setProfile(res.data.profile);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-page"><p className="loading">Loading...</p></div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <h1>{user?.name}</h1>
            <p className="profile-email">{profile?.user?.email || user?.email}</p>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {editing ? (
          <form className="profile-form" onSubmit={handleSave}>
            <label>
              Headline
              <input
                type="text"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="What do you do?"
              />
            </label>
            <label>
              Bio
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </label>
            <label>
              Location
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label>
              Website
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
            <div className="profile-form-actions">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            {profile?.headline && <p className="profile-headline">{profile.headline}</p>}
            {profile?.bio && <p className="profile-bio">{profile.bio}</p>}
            {profile?.location && <p className="profile-location">📍 {profile.location}</p>}
            {profile?.website && (
              <a className="profile-website" href={profile.website} target="_blank" rel="noreferrer">
                🔗 {profile.website}
              </a>
            )}
            <button className="btn-secondary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
