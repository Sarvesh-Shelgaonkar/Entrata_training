const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, trim: true, default: "" },
    avatarUrl: { type: String, trim: true, default: "" },
    headline: { type: String, trim: true, default: "" },
    website: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
