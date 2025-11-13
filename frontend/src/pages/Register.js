import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    city: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setLoading(true);

    const result = await registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword,
      full_name: formData.full_name,
      city: formData.city,
    });

    if (result.id || result.email) {
      alert(`Account created for ${formData.username}!`);
      navigate("/login");
    } else {
      setError(result?.detail || JSON.stringify(result));
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Your Account</h2>
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>

      {error && (
        <div
          style={{
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

        {/* Full Name */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="full_name"
            style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
          >
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* City */}
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="city"
            style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Your city"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Username */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '16px' }}
            placeholder="Choose a username"
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '16px' }}
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '16px' }}
            placeholder="Create a password"
          />
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '16px' }}
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '15px', 
            backgroundColor: '#10B981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#6B7280" }}>Already have an account? </span>
          <Link
            to="/login"
            style={{
              color: "#3B82F6",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Sign in here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
