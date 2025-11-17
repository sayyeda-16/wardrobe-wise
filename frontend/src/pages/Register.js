// src/pages/Register.js (UPDATED STYLING ONLY)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaSpinner, FaTimesCircle, FaLeaf } from 'react-icons/fa';

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

  const formatErrors = (errors) => {
    if (!errors || typeof errors !== "object") return "Registration failed.";

    let messages = [];

    for (let field in errors) {
      const fieldErrors = errors[field];
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(msg => {
          messages.push(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`);
        });
      }
    }

    return messages.join("\n");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Please verify them.");
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
    console.log("Registration result:", result);

    if (result.id || result.email) {
      alert(`Account created for ${formData.username}!`);
      navigate("/login");
    } else {
      setError(formatErrors(result));
    }

    setLoading(false);
  };

  // Theme colors matching the navbar and wardrobe
  const THEME_COLORS = {
    primaryGreen: '#6b8e23',
    secondaryGreen: '#8ea67c',
    lightGreen: '#e8f4d3',
    offWhite: '#f0f7e6',
    darkText: '#3c5a17',
    subtleText: '#556b2f',
  };

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      background: `linear-gradient(rgba(199, 238, 172, 0.3), rgba(199, 238, 172, 0.3))`,
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("https://aratamete.com/cdn/shop/articles/image2_4af4ee86-b4fc-46fa-ae44-95bd04652781.jpg?v=1742282629&width=640")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.4,
    },
    formContainer: {
      width: '90%',
      maxWidth: '500px',
      backgroundColor: 'transparent',
      position: 'relative',
      zIndex: 2,
      border: 'none',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '15px',
    },
    logoIcon: {
      fontSize: '32px',
      marginRight: '12px',
      color: 'white',
    },
    logoText: {
      fontSize: '28px',
      fontWeight: '700',
      color: 'white',
    },
    title: {
      fontSize: '24px',
      fontWeight: '600',
      color: 'white',
      margin: '0 0 8px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: THEME_COLORS.lightGreen,
      margin: 0,
    },
    formBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '30px',
      boxShadow: '0 10px 40px rgba(34, 51, 17, 0.3)',
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: '#fee',
      color: '#c33',
      marginBottom: '20px',
      fontSize: '14px',
      border: '1px solid #fcc',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: THEME_COLORS.darkText,
      marginBottom: '5px',
    },
    labelIcon: {
      marginRight: '6px',
      fontSize: '12px',
      color: THEME_COLORS.primaryGreen,
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: `2px solid ${THEME_COLORS.secondaryGreen}`,
      fontSize: '14px',
      backgroundColor: THEME_COLORS.offWhite,
      transition: 'all 0.3s ease',
      outline: 'none',
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: THEME_COLORS.primaryGreen,
      color: 'white',
      border: 'none',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      marginTop: '10px',
    },
    submitButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    switchContainer: {
      textAlign: 'center',
      paddingTop: '15px',
      borderTop: `1px solid ${THEME_COLORS.lightGreen}`,
      marginTop: '15px',
    },
    switchText: {
      fontSize: '13px',
      color: THEME_COLORS.subtleText,
      marginBottom: '5px',
    },
    switchButton: {
      background: 'none',
      border: 'none',
      color: THEME_COLORS.primaryGreen,
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'underline',
      transition: 'color 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      {/* Background Overlay */}
      <div style={styles.backgroundOverlay}></div>

      {/* Single Transparent Container */}
      <div style={styles.formContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <FaLeaf style={styles.logoIcon} />
            <span style={styles.logoText}>WardrobeWise</span>
          </div>
          <h2 style={styles.title}>Join Sustainable Community</h2>
          <p style={styles.subtitle}>Create your account and start your eco-fashion journey</p>
        </div>
        
        {/* Form Box */}
        <div style={styles.formBox}>
          {/* Error Message */}
          {error && (
            <div style={styles.errorContainer}>
              <FaTimesCircle style={{ marginRight: '8px', flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* First Row - Full Name & Email */}
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FaUser style={styles.labelIcon} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Full name"
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
                  onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FaEnvelope style={styles.labelIcon} />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={styles.input}
                  placeholder="Email address"
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
                  onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
                />
              </div>
            </div>

            {/* Second Row - City & Username */}
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FaUser style={styles.labelIcon} />
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={styles.input}
                  placeholder="Your city"
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
                  onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FaUser style={styles.labelIcon} />
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={styles.input}
                  placeholder="Username"
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
                  onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
                />
              </div>
            </div>

            {/* Third Row - Passwords */}
            <div style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FaLock style={styles.labelIcon} />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={styles.input}
                  placeholder="Password"
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
                  onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FaLock style={styles.labelIcon} />
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={styles.input}
                  placeholder="Confirm password"
                  onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
                  onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {})
              }}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = THEME_COLORS.darkText)}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = THEME_COLORS.primaryGreen)}
            >
              {loading ? (
                <>
                  <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  Creating Account...
                </>
              ) : (
                'Create Sustainable Account'
              )}
            </button>

            {/* Switch to Login */}
            <div style={styles.switchContainer}>
              <div style={styles.switchText}>Already part of the community?</div>
              <button
                type="button"
                onClick={onSwitchToLogin}
                disabled={loading}
                style={styles.switchButton}
                onMouseOver={(e) => e.target.style.color = THEME_COLORS.darkText}
                onMouseOut={(e) => e.target.style.color = THEME_COLORS.primaryGreen}
              >
                Sign in to your account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Register;