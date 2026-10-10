const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Start waking a sleeping backend as soon as the login/register page opens.
// This runs in the background and never blocks the page.
export function warmBackend() {
  return fetch(`${API_BASE_URL}/health`, {
    method: "GET",
    cache: "no-store",
  }).catch(() => null);
}

async function parseResponse(response) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed. Please try again.");
  }

  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(response);
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
}

export async function getProfile(token) {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}
