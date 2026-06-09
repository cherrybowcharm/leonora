const mongoose = require("mongoose");
const Task = require("../models/Task");
const { AppError } = require("../middleware/errorHandler");

// Helper — validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all tasks for the logged-in user (with search, filter, pagination)
// @route   GET /api/tasks
// @access  Protected
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // --- Query params ---
    const {
      search = "",
      status = "",
      page = 1,
      limit = 6,
    } = req.query;

    const currentPage = Math.max(1, parseInt(page, 10));
    const pageLimit = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (currentPage - 1) * pageLimit;

    // --- Build filter ---
    const filter = { userId };

    // Status filter: only apply if value is valid
    if (status === "pending" || status === "completed") {
      filter.status = status;
    }

    // Search: match against title or description (case-insensitive)
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    // --- Execute queries in parallel ---
    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageLimit)
        .lean(),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalTasks / pageLimit);

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        totalTasks,
        totalPages,
        currentPage,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Protected
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new AppError("Invalid task ID.", 400);
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id }).lean();

    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Protected
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    const task = await Task.create({
      title,
      description: description || "",
      status: "pending",
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task (title, description, status)
// @route   PUT /api/tasks/:id
// @access  Protected
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new AppError("Invalid task ID.", 400);
    }

    // Find task and verify ownership in one query
    const task = await Task.findOne({ _id: id, userId: req.user._id });

    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    const { title, description, status } = req.body;

    // Only update fields that were actually provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Protected
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new AppError("Invalid task ID.", 400);
    }

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status between pending and completed
// @route   PATCH /api/tasks/:id/toggle
// @access  Protected
const toggleTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      throw new AppError("Invalid task ID.", 400);
    }

    const task = await Task.findOne({ _id: id, userId: req.user._id });

    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    task.status = task.status === "pending" ? "completed" : "pending";
    await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.status}.`,
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};
