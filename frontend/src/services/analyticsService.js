const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("devcareer_token");
};

export const getCareerAnalytics = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in to view career analytics.");
  }

  const response = await fetch(`${API_BASE_URL}/analytics`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to load career analytics.");
  }

  return data.analytics;
};