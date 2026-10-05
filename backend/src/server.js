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

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
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

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`DevCareerOS backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed");
    process.exit(1);
  }
}

startServer();
