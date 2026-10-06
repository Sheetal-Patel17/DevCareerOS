const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

const getToken = () => {
  return localStorage.getItem("devcareer_token");
};

export const getCareerAnalytics = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in to view career analytics.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();

    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Analytics API returned an invalid response.");
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Analytics API error (${response.status})`
      );
    }

    if (!data.success) {
      throw new Error(
        data.message || "Failed to load career analytics."
      );
    }

    return data.analytics;
  } catch (error) {
    console.error("Career Analytics API Error:", error);

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the Career Analytics API."
      );
    }

    throw error;
  }
};