const express = require("express");

const authRoutes = require("./authRoutes");
const profileRoutes = require("./profileRoutes");
const categoryRoutes = require("./categoryRoutes");
const postRoutes = require("./postRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/categories", categoryRoutes);
router.use("/posts", postRoutes);

module.exports = router;
