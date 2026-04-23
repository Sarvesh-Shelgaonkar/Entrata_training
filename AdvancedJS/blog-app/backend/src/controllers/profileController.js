const mongoose = require("mongoose");

const Profile = require("../models/Profile");

const EDITABLE_FIELDS = ["bio", "avatarUrl", "headline", "website", "location"];

function pickProfileFields(body) {
  const out = {};
  for (const key of EDITABLE_FIELDS) {
    if (body[key] !== undefined) {
      out[key] = body[key];
    }
  }
  return out;
}

function toProfileDto(profile, { includeOwnerEmail = false } = {}) {
  const u = profile.user;
  let userSummary;
  if (u && typeof u === "object" && u._id) {
    userSummary = {
      id: u._id,
      name: u.name,
    };
    if (includeOwnerEmail) {
      userSummary.email = u.email;
    }
  }
  return {
    id: profile._id,
    userId: profile.user,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    headline: profile.headline,
    website: profile.website,
    location: profile.location,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    ...(userSummary && { user: userSummary }),
  };
}

async function createProfile(req, res) {
  try {
    const existing = await Profile.findOne({ user: req.userId });
    if (existing) {
      return res.status(409).json({ message: "Profile already exists for this account" });
    }

    const data = pickProfileFields(req.body);
    const profile = await Profile.create({
      user: req.userId,
      ...data,
    });

    return res.status(201).json({ profile: toProfileDto(profile) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Profile already exists for this account" });
    }
    console.error(err);
    return res.status(500).json({ message: "Could not create profile" });
  }
}

async function getMyProfile(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.userId }).populate(
      "user",
      "name email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({
      profile: toProfileDto(profile, { includeOwnerEmail: true }),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not load profile" });
  }
}

async function getProfileByUserId(req, res) {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const profile = await Profile.findOne({ user: userId }).populate("user", "name");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({ profile: toProfileDto(profile, { includeOwnerEmail: false }) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not load profile" });
  }
}

async function updateProfile(req, res) {
  try {
    const data = pickProfileFields(req.body);
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: `Provide at least one field: ${EDITABLE_FIELDS.join(", ")}`,
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.json({ profile: toProfileDto(profile) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not update profile" });
  }
}

async function deleteProfile(req, res) {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not delete profile" });
  }
}

module.exports = {
  createProfile,
  getMyProfile,
  getProfileByUserId,
  updateProfile,
  deleteProfile,
};
