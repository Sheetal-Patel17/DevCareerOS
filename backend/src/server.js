const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

app.listen(PORT, () => {
console.log(DevCareerOS backend running on port ${PORT});
});
