const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // This supports BOTH date and time automatically
    deadline: {
      type: Date
    },

    status: {
      type: String,
      enum: ["pending", "success", "failure"],
      default: "pending"
    },

    failedAt: {
      type: Date
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
