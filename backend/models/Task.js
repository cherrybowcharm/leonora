const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "completed"],
        message: "Status must be either pending or completed",
      },
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true, // index for fast per-user queries
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: fast lookup of a user's tasks sorted by date
taskSchema.index({ userId: 1, createdAt: -1 });
// Compound index: supports status filtering per user
taskSchema.index({ userId: 1, status: 1 });
// Text index: supports search on title and description
taskSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);
