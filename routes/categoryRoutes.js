const express = require("express");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
============================
CREATE CATEGORY
============================
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name required" });
    }

    const category = await Category.create({
      name,
      user: req.user.id
    });

    res.status(201).json(category);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
============================
GET USER CATEGORIES
============================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(categories);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
============================
DELETE CATEGORY
============================
*/
const Task = require("../models/Task");

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Delete all tasks under this category
    await Task.deleteMany({
      category: categoryId,
      user: req.user.id
    });

    // Delete category
    await Category.findOneAndDelete({
      _id: categoryId,
      user: req.user.id
    });

    res.json({ message: "Category and its tasks deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
