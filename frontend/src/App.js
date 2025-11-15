import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wardrobe from "./pages/Wardrobe";
import Marketplace from "./pages/Marketplace";
import AddItem from "./pages/AddItem";
import Navbar from "./components/Navbar";

// protected Route Component
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// main App Content
function AppContent() {
  const { user, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const [wardrobeItems, setWardrobeItems] = useState([
    { 
      id: 1, 
      name: 'Organic Cotton T-Shirt', 
      brand: 'Patagonia', 
      size: 'M', 
      color: 'Natural', 
      condition: 'Like New',
      item_name: 'Organic Cotton T-Shirt',
      brand_name: 'Patagonia',
      size_label: 'M',
      lifecycle: 'Active'
    },
    { 
      id: 2, 
      name: 'Sustainable Denim Jeans', 
      brand: 'Levi\'s', 
      size: '32', 
      color: 'Indigo', 
      condition: 'Good',
      item_name: 'Sustainable Denim Jeans',
      brand_name: 'Levi\'s',
      size_label: '32',
      lifecycle: 'Active'
    },
    { 
      id: 3, 
      name: 'Eco-Friendly Jacket', 
      brand: 'The North Face', 
      size: 'L', 
      color: 'Forest Green', 
      condition: 'Excellent',
      item_name: 'Eco-Friendly Jacket',
      brand_name: 'The North Face',
      size_label: 'L',
      lifecycle: 'Active'
    }
  ]);

  const navToRegister = () => navigate('/register');
	const navToLogin = () => navigate('/login');
	const navToAddItem = () => navigate('/add-item');
	const navToWardrobe = () => navigate('/wardrobe');

  const handleAddItem = (newItem) => {
    const itemWithId = { 
      ...newItem, 
      id: Date.now(),
      item_name: newItem.name,
      brand_name: newItem.brand,
      size_label: newItem.size,
      lifecycle: 'Active'
    };
    setWardrobeItems([...wardrobeItems, itemWithId]);
  };

    const handleRegister = async (userData) => {
    return await register(userData);
  };

  const handleLogin = async (email, password) => {
    return await login(email, password);
  };


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={
          <Login onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          <Register onRegister={handleRegister} onSwitchToLogin={navToLogin} />
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div style={styles.appContainer}>
      {user && <Navbar onLogout={handleLogout} />}

      <main style={styles.mainContent}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/wardrobe" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/wardrobe" /> : <Register />}
          />

          {/* Protected routes */}
          <Route
            path="/wardrobe"
            element={
              <PrivateRoute>
                <Wardrobe items={wardrobeItems} />
              </PrivateRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <PrivateRoute>
                <Marketplace />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-item"
            element={
              <PrivateRoute>
                <AddItem onAddItem={handleAddItem} />
              </PrivateRoute>
            }
          />

          {/* Default route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </main>

      {/* Global green theme styling */}
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          background-color: #f0f7e6;
        }

        * {
          box-sizing: border-box;
        }

        nav, .navbar, [class*="nav"] {
          background: linear-gradient(135deg, #556b2f 0%, #6b8e23 100%) !important;
        }

        button {
          font-family: 'Poppins', 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
}

// styling
const styles = {
  appContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f7e6 0%, #e8f4d3 100%)",
  },
  mainContent: {
    minHeight: "calc(100vh - 80px)", // Subtract navbar height
  },
};

// main app wrapper
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

