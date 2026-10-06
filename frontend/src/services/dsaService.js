const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("devcareer_token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
};

const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getDsaProblems = async () => {
  const response = await fetch(API_BASE_URL + "/dsa", {
    method: "GET",
    headers: getHeaders(),
  });

  return parseResponse(response);
};

export const getDsaStats = async () => {
  const response = await fetch(API_BASE_URL + "/dsa/stats", {
    method: "GET",
    headers: getHeaders(),
  });

  return parseResponse(response);
};

export const createDsaProblem = async (problemData) => {
  const response = await fetch(API_BASE_URL + "/dsa", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(problemData),
  });

  return parseResponse(response);
};

export const updateDsaProblem = async (problemId, problemData) => {
  const response = await fetch(
    API_BASE_URL + "/dsa/" + problemId,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(problemData),
    }
  );

  return parseResponse(response);
};

export const deleteDsaProblem = async (problemId) => {
  const response = await fetch(
    API_BASE_URL + "/dsa/" + problemId,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  return parseResponse(response);
};