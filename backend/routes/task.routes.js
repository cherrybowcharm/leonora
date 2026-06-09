const express = require("express");
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require("../controllers/task.controller");

const { protect } = require("../middleware/auth");
const {
  createTaskValidator,
  updateTaskValidator,
} = require("../validators/task.validator");

// All task routes require a valid JWT
router.use(protect);

// GET    /api/tasks          — list with search, filter, pagination
// POST   /api/tasks          — create new task
router
  .route("/")
  .get(getTasks)
  .post(createTaskValidator, createTask);

// PATCH  /api/tasks/:id/toggle — toggle status (must come before /:id)
router.patch("/:id/toggle", toggleTaskStatus);

// GET    /api/tasks/:id      — get single task
// PUT    /api/tasks/:id      — update task
// DELETE /api/tasks/:id      — delete task
router
  .route("/:id")
  .get(getTaskById)
  .put(updateTaskValidator, updateTask)
  .delete(deleteTask);

module.exports = router;
