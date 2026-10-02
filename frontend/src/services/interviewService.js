const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("devcareer_token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getInterviews = async () => {
  const response = await fetch(`${API_BASE_URL}/interviews`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch interviews");
  }

  return data;
};

export const getInterviewStats = async () => {
  const response = await fetch(`${API_BASE_URL}/interviews/stats`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch interview statistics"
    );
  }

  return data;
};

export const createInterview = async (interviewData) => {
  const response = await fetch(`${API_BASE_URL}/interviews`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(interviewData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create interview");
  }

  return data;
};

export const updateInterview = async (id, interviewData) => {
  const response = await fetch(`${API_BASE_URL}/interviews/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(interviewData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update interview");
  }

  return data;
};

export const deleteInterview = async (id) => {
  const response = await fetch(`${API_BASE_URL}/interviews/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete interview");
  }

  return data;
};