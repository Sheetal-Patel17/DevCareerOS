const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("devcareer_token");
};

export const getGithubActivity = async (username) => {
  const token = getToken();

  if (!token) {
    throw new Error("Please log in to view GitHub activity.");
  }

  if (!username) {
    throw new Error("GitHub username is required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/github-activity?username=${encodeURIComponent(
      username
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to load GitHub activity."
    );
  }

  return data.github;
};