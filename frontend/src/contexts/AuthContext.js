// src/contexts/AuthContext.js (FINALIZED)

import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios"; // The correctly configured Axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Load Token on App Start and Set Axios Header ---
  useEffect(() => {
    const access_token = localStorage.getItem("access_token"); 
    const stored_user_json = localStorage.getItem("user");

    if (access_token) {
      // ✅ CRITICAL FIX: Set the Authorization header for Axios immediately on load
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      if (stored_user_json) {
        try {
          setUser(JSON.parse(stored_user_json));
        } catch (e) {
          console.error("Failed to parse user data from storage.", e);
        }
      }
    } else {
      // Ensure no Authorization header is set if the token is missing
      delete api.defaults.headers.common['Authorization'];
    }

    setLoading(false);
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

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      
      // ✅ FIX IS HERE: Set the Authorization header immediately after successful login
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      
      // Fetch user info (using explicit header for fetch call)
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
    localStorage.removeItem("access_token"); 
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    
    // ✅ CRITICAL FIX: Clear the Authorization header on logout
    delete api.defaults.headers.common['Authorization'];
  };

  // getAuthHeaders helper is now redundant since 'api' handles auth, 
  // but if you must keep it for old fetch calls:
  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token"); 
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