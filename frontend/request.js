import { API_URL } from "./utils/config";

const url = `${API_URL}/api/login/`;

export const loginRequest = async (username, password) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};
