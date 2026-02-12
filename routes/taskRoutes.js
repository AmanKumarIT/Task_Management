const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
============================
CREATE TASK
============================
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, deadline, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category required" });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      category,
      user: req.user.id
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
============================
GET USER TASKS
============================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id
    })
    .populate("category", "name")
    .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
============================
UPDATE TASK (Edit)
============================
*/
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
============================
MARK SUCCESS
============================
*/
router.put("/:id/success", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: "success" },
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
============================
MARK FAILURE
============================
*/
router.put("/:id/failure", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        status: "failure",
        failedAt: new Date()
      },
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
============================
DELETE TASK
============================
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    res.json({ message: "Task deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
