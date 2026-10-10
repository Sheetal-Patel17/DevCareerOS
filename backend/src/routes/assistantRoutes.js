const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const requestWindows = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 2000;

router.use(authMiddleware);

function enforceUserRateLimit(req, res, next) {
  const userId = String(req.auth?.userId || req.auth?.id || req.auth?._id || "");

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Your session could not be verified. Please sign in again.",
    });
  }

  const now = Date.now();
  let window = requestWindows.get(userId);

  if (!window || now - window.startedAt >= WINDOW_MS) {
    window = { startedAt: now, count: 0 };
  }

  window.count += 1;
  requestWindows.set(userId, window);

  // Keep the in-memory limiter map bounded on long-running instances.
  if (requestWindows.size > 5000) {
    for (const [key, value] of requestWindows.entries()) {
      if (now - value.startedAt >= WINDOW_MS) requestWindows.delete(key);
    }
  }

  if (window.count > MAX_REQUESTS_PER_WINDOW) {
    res.set("Retry-After", String(Math.ceil((WINDOW_MS - (now - window.startedAt)) / 1000)));
    return res.status(429).json({
      success: false,
      message: "You've reached the chat limit for this minute. Please wait a moment and try again.",
    });
  }

  return next();
}

router.post("/chat", enforceUserRateLimit, async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      success: false,
      message: "The AI assistant is not configured yet. Please try again later.",
    });
  }

  const incomingMessages = req.body?.messages;
  const allowedPageContexts = new Set([
    "Dashboard", "Job Applications", "Skills & Learning", "Projects",
    "DSA Tracker", "Interview Preparation", "Goal Tracker", "Resume Manager",
    "Career Analytics", "GitHub Activity", "Profile & Settings", "DevCareerOS",
  ]);
  const requestedPageContext = req.body?.pageContext;
  const pageContext = allowedPageContexts.has(requestedPageContext)
    ? requestedPageContext
    : "DevCareerOS";

  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please enter a message to start chatting.",
    });
  }

  const latestMessage = incomingMessages[incomingMessages.length - 1];
  if (
    !latestMessage ||
    latestMessage.role !== "user" ||
    typeof latestMessage.content !== "string" ||
    !latestMessage.content.trim() ||
    latestMessage.content.trim().length > MAX_MESSAGE_LENGTH
  ) {
    return res.status(400).json({
      success: false,
      message: "Please send a message under 2,000 characters.",
    });
  }

  const messages = incomingMessages
    .slice(-MAX_MESSAGES)
    .filter((message) =>
      message &&
      ["user", "assistant"].includes(message.role) &&
      typeof message.content === "string" &&
      message.content.trim().length > 0
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (
    messages.length === 0 ||
    messages[messages.length - 1].role !== "user" ||
    messages[messages.length - 1].content.length > MAX_MESSAGE_LENGTH
  ) {
    return res.status(400).json({
      success: false,
      message: "Your message is empty or too long. Please keep it under 2,000 characters.",
    });
  }

  try {
    const instructions = [
      "You are Career AI Assistant, a helpful and encouraging assistant inside DevCareerOS.",
      "Help with resumes, professional bios, LinkedIn summaries, job applications, interview practice, career planning, skills, projects, and explaining how to use the app.",
      "Give practical, clearly formatted answers. For writing requests, provide a polished draft the user can copy and edit.",
      "Use beginner-friendly explanations when useful. Do not claim to have viewed or changed a user's account data unless it is explicitly included in the conversation.",
      "Do not ask for passwords, API keys, or other secrets. Never claim to guarantee a job or interview outcome.",
      "The user's current DevCareerOS page is: " + pageContext + ". Use this context only when it helps answer the question.",
    ].join("\\n");

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions,
        input: messages,
        max_output_tokens: 700,
      }),
      signal: AbortSignal.timeout(45000),
    });

    const response = await apiResponse.json().catch(() => ({}));

    if (!apiResponse.ok) {
      const apiError = new Error(response.error?.message || "OpenAI request failed");
      apiError.status = apiResponse.status;
      apiError.code = response.error?.code;
      throw apiError;
    }

    const reply = (response.output || [])
      .flatMap((item) => Array.isArray(item.content) ? item.content : [])
      .filter((item) => item.type === "output_text" && typeof item.text === "string")
      .map((item) => item.text)
      .join("\\n")
      .trim();

    if (!reply) {
      return res.status(502).json({
        success: false,
        message: "I couldn't generate a reply just now. Please try again.",
      });
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Career assistant request failed:", {
      status: error?.status,
      code: error?.code,
      message: error?.message,
    });

    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "The AI service is busy or its usage limit has been reached. Please try again later.",
      });
    }

    return res.status(502).json({
      success: false,
      message: "The AI assistant couldn't respond right now. Please try again shortly.",
    });
  }
});

module.exports = router;
