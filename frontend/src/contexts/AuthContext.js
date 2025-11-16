import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start — load access token & fetch user
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // FIXED

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/auth/me/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // login function
  const login = async (email, password) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.detail || "Login failed" };
      }

      const data = await response.json();

      // SAVE TOKENS (FIXED)
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Fetch user info (is_staff, is_superuser)
      const profileRes = await fetch("http://127.0.0.1:8000/api/auth/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUser(profileData);
        localStorage.setItem("user", JSON.stringify(profileData));
        return { success: true, user: profileData };
      }

      return { success: true };

    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Server error" };
    }
  };

  // register function
  const register = async (userData) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.detail || "Registration failed" };
      }

      // auto-login
      return await login(userData.email, userData.password);

    } catch (error) {
      return { success: false, message: "Server error" };
    }
  };

  // logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");  // FIXED
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  };

  // Helper for authenticated requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token"); // FIXED
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, getAuthHeaders }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
