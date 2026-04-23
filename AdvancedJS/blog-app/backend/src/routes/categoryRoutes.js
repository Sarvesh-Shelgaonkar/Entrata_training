const express = require("express");

const categoryController = require("../controllers/categoryController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", categoryController.getCategories);
router.post("/", requireAuth, categoryController.createCategory);

module.exports = router;
