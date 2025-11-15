const BASE_URL = "http://127.0.0.1:8000/api";

export async function registerUser(userData) {
  try {
    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Registration failed:", result);
      return result;   // <-- return the error response 
    }

    return result; // success
  } catch (error) {
    console.error("Error during registration:", error);
    return { detail: "Network or server error" }; // also return, do NOT throw
  }
}


// LOGIN FUNCTION
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Login failed:", result);
      throw new Error(result.detail || "Invalid credentials");
    }

    // Optional: store tokens right here
    if (result.access) {
      localStorage.setItem("access_token", result.access);
      localStorage.setItem("refresh_token", result.refresh);
    }

    return result;
  } catch (err) {
    console.error("Error during login:", err);
    throw err;
  }
}

// GET PROFILE
export async function getProfile(token) {
  try {
    const response = await fetch(`${BASE_URL}/user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.detail || "Failed to fetch profile");
    }

    return result;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}
