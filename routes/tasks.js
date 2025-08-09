// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// GET all tasks for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create a new task for logged-in user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = await Task.create({ title: title.trim(), userId: req.userId });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update a task (mark complete/incomplete or change title)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updateFields = {};
    if (typeof req.body.title === "string") updateFields.title = req.body.title.trim();
    if (typeof req.body.completed === "boolean") updateFields.completed = req.body.completed;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE a task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
