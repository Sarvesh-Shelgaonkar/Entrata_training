const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return secret;
}


function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }
    const token = header.slice("Bearer ".length).trim();
    const payload = jwt.verify(token, getJwtSecret());
    const userId = payload.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    req.userId = userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
