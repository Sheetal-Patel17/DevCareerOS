const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("devcareer_token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getGoals = async () => {
  const response = await fetch(`${API_BASE_URL}/goals`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch goals");
  }

  return data;
};

export const getGoalStats = async () => {
  const response = await fetch(`${API_BASE_URL}/goals/stats`, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch goal statistics"
    );
  }

  return data;
};

export const createGoal = async (goalData) => {
  const response = await fetch(`${API_BASE_URL}/goals`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(goalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create goal");
  }

  return data;
};

export const updateGoal = async (id, goalData) => {
  const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(goalData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update goal");
  }

  return data;
};

export const deleteGoal = async (id) => {
  const response = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete goal");
  }

  return data;
};