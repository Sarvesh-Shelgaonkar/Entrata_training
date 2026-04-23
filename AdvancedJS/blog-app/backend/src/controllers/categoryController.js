const Category = require("../models/Category");

function formatCategory(doc) {
  return {
    id: doc._id,
    name: doc.name,
    createdAt: doc.createdAt,
  };
}

async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "name is required" });
    }

    const category = await Category.create({
      name: String(name).trim(),
    });

    return res.status(201).json({ category: formatCategory(category) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "A category with this name already exists" });
    }
    console.error(err);
    return res.status(500).json({ message: "Could not create category" });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    const list = categories.map((c) => formatCategory(c));
    return res.json({ categories: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not load categories" });
  }
}

module.exports = {
  createCategory,
  getCategories,
};
