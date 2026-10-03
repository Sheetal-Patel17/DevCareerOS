const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      enum: [
        "Career",
        "Learning",
        "DSA",
        "Project",
        "Job Search",
        "Personal",
        "Other",
      ],
      default: "Career",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "Paused"],
      default: "Not Started",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    deadline: {
      type: Date,
      default: null,
    },

    milestones: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Goal", goalSchema);