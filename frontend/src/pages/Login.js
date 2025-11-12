import React, { useState } from 'react';
import { FaLeaf, FaEnvelope, FaLock, FaUser, FaSeedling, FaRecycle, FaTree } from 'react-icons/fa';

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onLogin(email, password);
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background with nature pattern */}
      <div style={styles.background}></div>
      
      {/* Main Content */}
      <div style={styles.content}>
        {/* Left Side - Features */}
        <div style={styles.features}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <FaLeaf style={styles.logoIcon} />
              <span style={styles.logoText}>EcoWardrobe</span>
            </div>
            <p style={styles.tagline}>Sustainable Fashion Marketplace</p>
          </div>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <FaRecycle style={styles.featureIcon} />
              <div>
                <h3 style={styles.featureTitle}>Circular Fashion</h3>
                <p style={styles.featureText}>Give clothes a second life through sustainable trading</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <FaSeedling style={styles.featureIcon} />
              <div>
                <h3 style={styles.featureTitle}>Eco-Friendly</h3>
                <p style={styles.featureText}>Reduce fashion waste and environmental impact</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <FaTree style={styles.featureIcon} />
              <div>
                <h3 style={styles.featureTitle}>Sustainable Community</h3>
                <p style={styles.featureText}>Join like-minded individuals promoting green fashion</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={styles.formSection}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
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

              <div style={styles.inputGroup}>
                <div style={styles.labelContainer}>
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitButton,
                  ...(loading ? styles.submitButtonLoading : {})
                }}
              >
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In to EcoWardrobe'
                )}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerText}>New to sustainable fashion?</span>
            </div>

            <button
              type="button"
              onClick={onSwitchToRegister}
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
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    background: 'linear-gradient(135deg, #87a96b 0%, #6b8e23 50%, #556b2f 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(135, 169, 107, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(107, 142, 35, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(85, 107, 47, 0.2) 0%, transparent 50%)
    `,
    zIndex: 0,
  },
  content: {
    display: 'flex',
    width: '100%',
    maxWidth: '1200px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(34, 51, 17, 0.2)',
    overflow: 'hidden',
    minHeight: '600px',
    zIndex: 1,
    position: 'relative',
  },
  features: {
    flex: 1,
    padding: '60px 40px',
    background: 'linear-gradient(135deg, #556b2f 0%, #6b8e23 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brand: {
    marginBottom: '60px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  logoIcon: {
    fontSize: '32px',
    marginRight: '12px',
    color: '#d4e6a4',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '16px',
    color: '#d4e6a4',
    margin: 0,
    fontStyle: 'italic',
  },
  featureList: {
    spaceBetween: '20px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  featureIcon: {
    fontSize: '24px',
    marginRight: '16px',
    marginTop: '4px',
    color: '#d4e6a4',
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: 'white',
  },
  featureText: {
    fontSize: '14px',
    color: '#e8f4d3',
    margin: 0,
    lineHeight: '1.5',
  },
  formSection: {
    flex: 1,
    padding: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d4a17',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b8e23',
    margin: 0,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    border: '1px solid #fecaca',
  },
  errorIcon: {
    marginRight: '8px',
    fontSize: '16px',
  },
  form: {
    marginBottom: '24px',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  labelIcon: {
    marginRight: '8px',
    color: '#6b8e23',
    fontSize: '14px',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#6b8e23',
    textDecoration: 'none',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '16px',
    border: '2px solid #d1d5db',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#6b8e23',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    letterSpacing: '0.5px',
  },
  submitButtonLoading: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid transparent',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '8px',
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    margin: '32px 0',
  },
  dividerText: {
    display: 'inline-block',
    padding: '0 16px',
    backgroundColor: 'white',
    color: '#6b7280',
    fontSize: '14px',
    position: 'relative',
    zIndex: 1,
  },
  registerButton: {
    width: '100%',
    padding: '16px',
    backgroundColor: 'transparent',
    color: '#6b8e23',
    border: '2px solid #6b8e23',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
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

  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

  /* Input focus effects */
  input:focus {
    border-color: #6b8e23 !important;
    box-shadow: 0 0 0 3px rgba(107, 142, 35, 0.1) !important;
  }

  input:hover {
    border-color: #9ca3af !important;
  }

  /* Button hover effects */
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34, 51, 17, 0.2);
  }

  /* Specific button styles */
  .submit-button:hover:not(:disabled) {
    background-color: #556b2f !important;
  }

  .register-button:hover:not(:disabled) {
    background-color: #6b8e23 !important;
    color: white !important;
  }

  .forgot-link:hover {
    color: #556b2f !important;
  }
`;

document.head.appendChild(styleSheet);

// Add hover effects using CSS classes
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