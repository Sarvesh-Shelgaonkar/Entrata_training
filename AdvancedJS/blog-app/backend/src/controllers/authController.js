const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Profile = require("../models/Profile");
const { sendMail } = require("../utils/email");
const { generateOtp, hashOtp, safeCompareOtpHash } = require("../utils/otp");

const SALT_ROUNDS = 10;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";
const RESET_OTP_TTL_MS = 10 * 60 * 1000;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return secret;
}

function signToken(userId) {
  return jwt.sign({ userId: String(userId) }, getJwtSecret(), {
    expiresIn: JWT_EXPIRES,
  });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  };
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "password must be at least 8 characters" });
    }

    const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "email already registered" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      password: hashed,
    });

    await Profile.create({ user: user._id });

    const token = signToken(user._id);
    return res.status(201).json({
      user: publicUser(user),
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "email already registered" });
    }
    console.error(err);
    return res.status(500).json({ message: "registration failed" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    return res.json({
      user: publicUser(user),
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "login failed" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const normalized = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalized });

    const generic = {
      message: "If an account exists for this email, a reset code has been sent.",
    };

    if (!user) {
      return res.json(generic);
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expires = new Date(Date.now() + RESET_OTP_TTL_MS);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetOtpHash: otpHash,
          passwordResetOtpExpires: expires,
        },
      }
    );

    await sendMail({
      to: user.email,
      subject: "Password reset code",
      text: `Your password reset code is: ${otp}\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`,
      html: `<p>Your password reset code is: <strong>${otp}</strong></p><p>It expires in 10 minutes. If you did not request this, ignore this email.</p>`,
    });

    return res.json(generic);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "could not process password reset request" });
  }
}

async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "email, otp, and newPassword are required" });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: "newPassword must be at least 8 characters" });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    }).select("+passwordResetOtpHash +passwordResetOtpExpires");

    if (!user || !user.passwordResetOtpHash) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    if (!user.passwordResetOtpExpires || user.passwordResetOtpExpires < new Date()) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    if (!safeCompareOtpHash(user.passwordResetOtpHash, otp)) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashed },
        $unset: { passwordResetOtpHash: "", passwordResetOtpExpires: "" },
      }
    );

    return res.json({ message: "Password has been reset. You can sign in with your new password." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "password reset failed" });
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
