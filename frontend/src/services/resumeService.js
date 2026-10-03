const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("devcareer_token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getResumes = async () => {
  const response = await fetch(`${API_BASE_URL}/resumes`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch resumes");
  }

  return data;
};

export const getResumeStats = async () => {
  const response = await fetch(`${API_BASE_URL}/resumes/stats`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch resume statistics"
    );
  }

  return data;
};

export const getResumeById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch resume");
  }

  return data;
};

export const createResume = async (resumeData) => {
  const response = await fetch(`${API_BASE_URL}/resumes`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(resumeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create resume");
  }

  return data;
};

export const updateResume = async (id, resumeData) => {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(resumeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update resume");
  }

  return data;
};

export const deleteResume = async (id) => {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete resume");
  }

  return data;
};