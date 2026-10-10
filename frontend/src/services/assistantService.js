const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function sendAssistantMessage(messages, pageContext) {
  const token = localStorage.getItem("devcareer_token");

  if (!token) {
    throw new Error("Please sign in again to use Career AI Assistant.");
  }

  const response = await fetch(`${API_BASE_URL}/assistant/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, pageContext }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "The assistant could not respond. Please try again.");
  }

  return data.reply;
}
