const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDatabase = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const goalRoutes = require("./routes/goalRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const githubActivityRoutes = require("./routes/githubActivityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const assistantRoutes = require("./routes/assistantRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "*";

app.use(
  cors({
    origin: CLIENT_URL === "*" ? true : CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DevCareerOS Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "DevCareerOS API",
    status: "healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/github-activity", githubActivityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/assistant", assistantRoutes);

async function startServer() {
  try {
    console.log("Starting DevCareerOS backend...");
    console.log(
      "MONGODB_URI present:",
      Boolean(process.env.MONGODB_URI)
    );
    console.log(
      "JWT_SECRET present:",
      Boolean(process.env.JWT_SECRET)
    );
    console.log("CLIENT_URL:", CLIENT_URL);

    await connectDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        "DevCareerOS backend running on port " + PORT
      );
    });
  } catch (error) {
    console.error("Server startup failed.");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    process.exit(1);
  }
}

startServer();