const User = require("../models/User");

const getUserId = (req) => {
  return req.auth?.userId || req.auth?.id || req.auth?._id;
};

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const userId = getUserId(req);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  try {
    const userId = getUserId(req);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    const {
      name,
      headline,
      bio,
      location,
      phone,
      targetRole,
      preferredWorkMode,
      careerInterests,
      links,
    } = req.body;

    if (name !== undefined) {
      const trimmedName = String(name).trim();

      if (trimmedName.length < 2 || trimmedName.length > 80) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 80 characters",
        });
      }

      user.name = trimmedName;
    }

    if (headline !== undefined) {
      user.headline = String(headline).trim();
    }

    if (bio !== undefined) {
      user.bio = String(bio).trim();
    }

    if (location !== undefined) {
      user.location = String(location).trim();
    }

    if (phone !== undefined) {
      user.phone = String(phone).trim();
    }

    if (targetRole !== undefined) {
      user.targetRole = String(targetRole).trim();
    }

    if (preferredWorkMode !== undefined) {
      const allowedModes = [
        "Remote",
        "Hybrid",
        "On-site",
        "Flexible",
      ];

      if (!allowedModes.includes(preferredWorkMode)) {
        return res.status(400).json({
          success: false,
          message: "Invalid preferred work mode",
        });
      }

      user.preferredWorkMode = preferredWorkMode;
    }

    if (careerInterests !== undefined) {
      if (!Array.isArray(careerInterests)) {
        return res.status(400).json({
          success: false,
          message: "Career interests must be an array",
        });
      }

      user.careerInterests = careerInterests
        .map((interest) => String(interest).trim())
        .filter(Boolean);
    }

    if (links !== undefined) {
      if (
        typeof links !== "object" ||
        Array.isArray(links) ||
        links === null
      ) {
        return res.status(400).json({
          success: false,
          message: "Links must be an object",
        });
      }

      if (links.linkedin !== undefined) {
        user.links.linkedin = String(links.linkedin).trim();
      }

      if (links.github !== undefined) {
        user.links.github = String(links.github).trim();
      }

      if (links.portfolio !== undefined) {
        user.links.portfolio = String(links.portfolio).trim();
      }
    }

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};