const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Existing authentication fields
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 200,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Profile information
    headline: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },

    // Career preferences
    targetRole: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    preferredWorkMode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site", "Flexible"],
      default: "Flexible",
    },

    careerInterests: {
      type: [String],
      default: [],
    },

    // Professional links
    links: {
      linkedin: {
        type: String,
        trim: true,
        default: "",
      },

      github: {
        type: String,
        trim: true,
        default: "",
      },

      portfolio: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);