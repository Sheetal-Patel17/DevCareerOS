const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
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

    targetRole: {
      type: String,
      required: true,
      trim: true,
    },

    version: {
      type: String,
      trim: true,
      default: "v1.0",
    },

    summary: {
      type: String,
      trim: true,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    education: [
      {
        degree: {
          type: String,
          trim: true,
        },
        institution: {
          type: String,
          trim: true,
        },
        year: {
          type: String,
          trim: true,
        },
      },
    ],

    experience: [
      {
        company: {
          type: String,
          trim: true,
        },
        role: {
          type: String,
          trim: true,
        },
        duration: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],

    projects: [
      {
        name: {
          type: String,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        technologies: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    certifications: [
      {
        name: {
          type: String,
          trim: true,
        },
        issuer: {
          type: String,
          trim: true,
        },
        year: {
          type: String,
          trim: true,
        },
      },
    ],

    links: {
      github: {
        type: String,
        trim: true,
        default: "",
      },

      linkedin: {
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

    status: {
      type: String,
      enum: ["Draft", "Ready", "Archived"],
      default: "Draft",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);