// src/pages/Login.js (UPDATED THEME)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { FaLeaf, FaEnvelope, FaLock, FaUser, FaSeedling, FaRecycle, FaTree, FaSpinner } from 'react-icons/fa';
import { useAuth } from "../contexts/AuthContext";

function Login({ onLogin, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Submitting login with:", email, password);

    try {
      const result = await login(email, password);
      console.log("Login result:", result);

      if (result.access) {
        localStorage.setItem("access_token", result.access);
        localStorage.setItem("refresh_token", result.refresh);
        navigate("/wardrobe");
      } else {
        setError(result?.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
    }
    
    setLoading(false);

  };

  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern}></div>

      {/* Main Content Card */}
      <div style={styles.mainCard}>
        
        {/* Left Side - Image Background */}
        <div style={styles.leftSide}>
          <div style={styles.leftSideBackground}></div>
          <div style={styles.leftSideContent}>
            <div style={styles.brandSection}>
              <div style={styles.logo}>
                <FaLeaf style={styles.logoIcon} />
                <span style={styles.brandText}>WardrobeWise</span>
              </div>
              <p style={styles.tagline}>Sustainable Fashion Marketplace</p>
            </div>

            <div style={styles.features}>
              <div style={styles.featureItem}>
                <FaRecycle style={styles.featureIcon} />
                <div>
                  <h3 style={styles.featureTitle}>Circular Fashion</h3>
                  <p style={styles.featureDescription}>Give clothes a second life through sustainable trading.</p>
                </div>
              </div>

              <div style={styles.featureItem}>
                <FaSeedling style={styles.featureIcon} />
                <div>
                  <h3 style={styles.featureTitle}>Eco-Friendly</h3>
                  <p style={styles.featureDescription}>Reduce fashion waste and environmental impact.</p>
                </div>
              </div>

              <div style={styles.featureItem}>
                <FaTree style={styles.featureIcon} />
                <div>
                  <h3 style={styles.featureTitle}>Sustainable Community</h3>
                  <p style={styles.featureDescription}>Join like-minded individuals promoting green fashion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={styles.rightSide}>
          <div style={styles.formContainer}>
            <div style={styles.header}>
              <h1 style={styles.title}>Welcome Back</h1>
              <p style={styles.subtitle}>Sign in to your sustainable fashion account</p>
            </div>

            {error && (
              <div style={styles.error}>
                <span style={styles.errorIcon}>⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Email Input */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <FaEnvelope style={styles.labelIcon} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div style={styles.inputGroup}>
                <div style={styles.passwordHeader}>
                  <label style={styles.label}>
                    <FaLock style={styles.labelIcon} />
                    Password
                  </label>
                  <a href="#forgot" style={styles.forgotLink}>Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.disabledButton : {})
                }}
              >
                {loading ? (
                  <>
                    <FaSpinner style={styles.buttonIcon} />
                    Signing In...
                  </>
                ) : (
                  'Sign In to WardrobeWise'
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>New to sustainable fashion?</span>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
              style={styles.registerButton}
            >
              <FaUser style={styles.registerIcon} />
              Create Sustainable Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#edf7e6ff',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='10' fill='%236f8260' opacity='0.05'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'repeat',
  },
  mainCard: {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    backgroundColor: 'white',
    boxShadow: '0 10px 40px rgba(34, 51, 17, 0.15)',
    overflow: 'hidden',
    minHeight: '600px',
    position: 'relative',
    zIndex: 2,
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  },
  leftSideBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(rgba(111, 130, 96, 0.7), rgba(111, 130, 96, 0.7)), url("https://betterworldapparel.com/wp-content/uploads/2019/11/sustainable-fashion-scaled.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  leftSideContent: {
    position: 'relative',
    zIndex: 2,
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    color: 'white',
  },
  brandSection: {
    marginBottom: '40px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  logoIcon: {
    fontSize: '32px',
    marginRight: '12px',
    color: '#d4e6a4',
  },
  brandText: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
  },
  tagline: {
    fontSize: '16px',
    color: '#d4e6a4',
    fontStyle: 'italic',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  featureIcon: {
    fontSize: '20px',
    marginRight: '16px',
    marginTop: '2px',
    color: '#d4e6a4',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '4px',
    color: 'white',
  },
  featureDescription: {
    fontSize: '14px',
    color: '#d4e6a4',
    lineHeight: '1.4',
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#556b2f',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6f8260ff',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    marginBottom: '24px',
    fontSize: '14px',
    border: '1px solid #f5c6cb',
  },
  errorIcon: {
    marginRight: '10px',
    fontSize: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#556b2f',
    marginBottom: '8px',
  },
  labelIcon: {
    marginRight: '8px',
    fontSize: '14px',
    color: '#6f8260ff',
  },
  passwordHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#6f8260ff',
    fontWeight: '500',
    textDecoration: 'none',
  },
  input: {
    width: '100%',
    padding: '16px',
    border: '2px solid #e8f4d3',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#8ea67cff',
    color: '#556b2f',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(142, 166, 124, 0.3)',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  buttonIcon: {
    marginRight: '8px',
    fontSize: '16px',
    animation: 'spin 1s linear infinite',
  },
  divider: {
    position: 'relative',
    margin: '32px 0',
    textAlign: 'center',
  },
  dividerLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: '1px',
    backgroundColor: '#e8f4d3',
  },
  dividerText: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '0 16px',
    fontSize: '14px',
    color: '#6f8260ff',
  },
  registerButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'transparent',
    color: '#6f8260ff',
    border: '2px solid #6f8260ff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerIcon: {
    marginRight: '8px',
    fontSize: '14px',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(142, 166, 124, 0.4);
    background-color: #a2ba71;
  }

  .register-button:hover:not(:disabled) {
    transform: translateY(-2px);
    background-color: #6f8260ff;
    color: white;
  }

  input:focus {
    border-color: #8ea67cff !important;
    outline: none;
  }

  .forgot-link:hover {
    color: #556b2f !important;
  }
`;

document.head.appendChild(styleSheet);

// Add hover effects
Object.assign(styles.submitButton, {
  className: 'submit-button',
});

Object.assign(styles.registerButton, {
  className: 'register-button',
});

Object.assign(styles.forgotLink, {
  className: 'forgot-link',
});

export default Login;