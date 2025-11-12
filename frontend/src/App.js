import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Wardrobe from './pages/Wardrobe';
import Marketplace from './pages/Marketplace';
import AddItem from './pages/AddItem';
import Navbar from './components/Navbar';

// Main app component that uses the auth context
function AppContent() {
  const { user, login, register, logout } = useAuth();
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

  const handleRegister = async (userData) => {
    return await register(userData);
  };

  const handleLogin = async (email, password) => {
    return await login(email, password);
  };

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

  const handleLogout = () => {
    logout();
  };

  // Show auth pages if not logged in
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={
          <Login onLogin={handleLogin} onSwitchToRegister={() => <Navigate to="/register" />} />
        } />
        <Route path="/register" element={
          <Register onRegister={handleRegister} onSwitchToLogin={() => <Navigate to="/login" />} />
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div style={styles.appContainer}>
      {/* Use your green Navbar component */}
      <Navbar />
      
      {/* Page Content with React Router */}
      <main style={styles.mainContent}>
        <Routes>
          <Route path="/wardrobe" element={
            <Wardrobe 
              items={wardrobeItems} 
              onAddItem={() => <Navigate to="/add-item" />} 
            />
          } />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/add-item" element={
            <AddItem 
              onAddItem={handleAddItem} 
              onCancel={() => <Navigate to="/wardrobe" />} 
            />
          } />
          <Route path="/" element={<Navigate to="/wardrobe" />} />
          <Route path="*" element={<Navigate to="/wardrobe" />} />
        </Routes>
      </main>

      {/* Global styles to ensure green theme */}
      <style>{`
        /* Remove any blue styles and ensure green theme */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          background-color: #f0f7e6;
        }
        
        * {
          box-sizing: border-box;
        }
        
        /* Override any blue colors that might be coming from other sources */
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

const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f7e6 0%, #e8f4d3 100%)',
  },
  mainContent: {
    minHeight: 'calc(100vh - 80px)', // Subtract navbar height
  },
};

// Main App wrapper with AuthProvider and Router
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