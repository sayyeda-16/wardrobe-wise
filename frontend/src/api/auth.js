const BASE_URL = "http://127.0.0.1:8000/api";

export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function getProfile(token) {
  const response = await fetch(`${BASE_URL}/profile/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return await response.json();
}
