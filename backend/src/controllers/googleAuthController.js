const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const googleClient = new OAuth2Client();

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

async function googleLogin(req, res) {
  try {
    const { credential } = req.body || {};

    if (!credential || !process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({
        success: false,
        message: "Google sign-in is not configured or the credential is missing.",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({
        success: false,
        message: "Google could not verify this account. Please try again.",
      });
    }

    const email = payload.email.trim().toLowerCase();
    let user = await User.findOne({ email });

    if (user && user.googleId && user.googleId !== payload.sub) {
      return res.status(409).json({
        success: false,
        message: "This email is already linked to another Google account.",
      });
    }

    if (!user) {
      user = await User.create({
        name: (payload.name || email.split("@")[0]).trim().slice(0, 80) || "Career Member",
        email,
        googleId: payload.sub,
        picture: payload.picture || "",
      });
    } else {
      let changed = false;
      if (!user.googleId) {
        user.googleId = payload.sub;
        changed = true;
      }
      if (!user.name && payload.name) {
        user.name = payload.name.trim().slice(0, 80);
        changed = true;
      }
      if (payload.picture && user.picture !== payload.picture) {
        user.picture = payload.picture;
        changed = true;
      }
      if (changed) await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Google sign-in successful",
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Google sign-in error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Google sign-in failed. Please try again.",
    });
  }
}

module.exports = { googleLogin };
