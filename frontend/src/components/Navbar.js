import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { 
  FaLeaf, FaTshirt, FaStore, FaPlus, FaUser, FaSignOutAlt, FaSeedling, 
  FaCog, FaChartBar, FaUserCircle 
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/stats', label: 'Stats', icon: FaChartBar }, 
    { path: '/wardrobe', label: 'My Wardrobe', icon: FaTshirt }, 
    { path: '/add-item', label: 'Add Item', icon: FaPlus },
    { path: '/marketplace', label: 'Marketplace', icon: FaStore },
  ];
  
  const userLinks = [
    { path: '/profile', label: 'Profile', icon: FaUserCircle },
    { path: '/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <nav style={styles.navbar}>
      {/* Background Image */}
      <div style={styles.background}></div>
      
      <div style={styles.container}>
        {/* Logo/Brand */}
        <Link to="/" style={styles.brand}>
          <div style={styles.logoContainer}>
            <FaLeaf style={styles.logoIcon} />
            <span style={styles.brandText}>WardrobeWise</span>
          </div>
          <div style={styles.tagline}>Sustainable Fashion</div>
        </Link>

        {/* Navigation Items - Removed container background */}
        {user && (
          <div style={styles.navItems}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.navLink,
                    ...(isActive ? styles.navLinkActive : {})
                  }}
                  className="eco-nav-link"
                >
                  <IconComponent style={styles.navIcon} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* User Section */}
        <div style={styles.userSection}>
          {user ? (
            <>
              {/* User Profile Links */}
              <div style={styles.userLinksContainer}>
                {userLinks.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={styles.profileLink}
                    >
                      <IconComponent style={styles.navIcon} />
                    </Link>
                  );
                })}
              </div>

              <div style={styles.userInfo}>
                <div style={styles.userWelcome}>
                  <FaSeedling style={styles.ecoIcon} />
                  <span style={styles.welcomeText}>Welcome,</span>
                </div>
                <div style={styles.userName}>{user.full_name}</div>
              </div>
              <button
                onClick={logout}
                style={styles.logoutButton}
                className="eco-logout-btn"
              >
                <FaSignOutAlt style={styles.logoutIcon} />
                Sign Out
              </button>
            </>
          ) : (
            <div style={styles.authButtons}>
              <Link
                to="/login"
                style={styles.loginButton}
                className="eco-login-btn"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={styles.registerButton}
                className="eco-register-btn"
              >
                <FaUser style={styles.registerIcon} />
                Join Sustainable Community
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Inline styles */}
      <style>{`
        .eco-nav-link {
          transition: all 0.3s ease !important;
        }
        
        .eco-nav-link:hover {
          background-color: rgba(162, 186, 113, 0.2) !important;
          color: white !important;
          border: 1px solid rgba(162, 186, 113, 0.4) !important;
          transform: translateY(-1px) !important;
        }
        
        .eco-logout-btn:hover {
          background-color: #a2ba71 !important;
          color: #2d4a17 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(162, 186, 113, 0.4) !important;
        }
        
        .eco-login-btn:hover {
          color: white !important;
          background-color: rgba(162, 186, 113, 0.2) !important;
          border: 1px solid rgba(162, 186, 113, 0.4) !important;
          transform: translateY(-1px) !important;
        }
        
        .eco-register-btn:hover {
          background-color: #a2ba71 !important;
          color: #2d4a17 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 25px rgba(162, 186, 113, 0.5) !important;
          border: 2px solid #a2ba71 !important;
        }
      `}</style>
    </nav>
  );
};

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #6f8260 0%, #5a6f4c 100%)',
    padding: '0',
    boxShadow: '0 4px 30px rgba(34, 51, 17, 0.15)',
    borderBottom: '2px solid rgba(162, 186, 113, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(rgba(111, 130, 96, 0.7), rgba(111, 130, 96, 0.7)), url("https://etymologie.ca/cdn/shop/files/Etymologie-Sustainability-A-Journey.png?v=1698966090&width=2100")',
    backgroundSize: 'cover',
    backgroundPosition: 'center 30%',
    zIndex: 0,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    maxWidth: '1400px',
    margin: '0 auto',
    height: '80px',
    position: 'relative',
    zIndex: 2,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: 'white',
    gap: '15px',
    transition: 'transform 0.3s ease',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: '32px',
    marginRight: '12px',
    color: '#d4e6a4',
    filter: 'drop-shadow(0 2px 4px rgba(34, 51, 17, 0.3))',
    transition: 'transform 0.3s ease',
  },
  brandText: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 4px rgba(34, 51, 17, 0.3)',
  },
  tagline: {
    fontSize: '12px',
    color: '#d4e6a4',
    fontWeight: '500',
    opacity: 0.9,
    marginTop: '2px',
    fontStyle: 'italic',
  },
  navItems: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    color: '#e8f4d3',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
  },
  navLinkActive: {
    backgroundColor: 'rgba(162, 186, 113, 0.2)',
    color: 'white',
    border: '1px solid rgba(162, 186, 113, 0.4)',
    boxShadow: '0 4px 15px rgba(162, 186, 113, 0.2)',
  },
  navIcon: {
    fontSize: '16px',
    color: '#d4e6a4',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    color: 'white',
  },
  userWelcome: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#d4e6a4',
    opacity: 0.9,
  },
  ecoIcon: {
    fontSize: '12px',
    color: '#d4e6a4',
  },
  welcomeText: {
    fontWeight: '500',
  },
  userName: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'white',
    textShadow: '0 1px 2px rgba(34, 51, 17, 0.3)',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    backgroundColor: 'rgba(162, 186, 113, 0.15)',
    color: '#e8f4d3',
    border: '2px solid #a2ba71',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    fontFamily: 'inherit',
  },
  logoutIcon: {
    fontSize: '14px',
    color: '#a2ba71',
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  loginButton: {
    padding: '12px 24px',
    color: '#e8f4d3',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
  },
  registerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 24px',
    backgroundColor: '#a2ba71',
    color: '#2d4a17',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(162, 186, 113, 0.3)',
    border: '2px solid transparent',
  },
  registerIcon: {
    fontSize: '14px',
  },
  userLinksContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginRight: '10px',
  },
  profileLink: {
    display: 'flex',
    padding: '8px',
    color: '#d4e6a4',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    opacity: 0.8,
  },
};

export default Navbar;