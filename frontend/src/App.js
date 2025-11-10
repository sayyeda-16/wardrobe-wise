import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Wardrobe from './pages/Wardrobe';
import Marketplace from './pages/Marketplace';
import AddItem from './pages/AddItem';

// Main app component that uses the auth context
function AppContent() {
  const { user, login, register, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [wardrobeItems, setWardrobeItems] = useState([
    { id: 1, name: 'Blue Jeans', brand: 'Levi\'s', size: 'M', color: 'Blue', condition: 'Good' },
    { id: 2, name: 'White T-Shirt', brand: 'Uniqlo', size: 'L', color: 'White', condition: 'Like New' },
    { id: 3, name: 'Black Jacket', brand: 'Zara', size: 'M', color: 'Black', condition: 'Excellent' }
  ]);

  const handleRegister = async (userData) => {
    const result = await register(userData);
    if (result.success) {
      setCurrentPage('wardrobe');
    }
  };

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      setCurrentPage('wardrobe');
    }
  };

  const handleAddItem = (newItem) => {
    const itemWithId = { ...newItem, id: Date.now() };
    setWardrobeItems([...wardrobeItems, itemWithId]);
    setCurrentPage('wardrobe');
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('login');
  };

  // Show auth pages if not logged in
  if (!user) {
    if (currentPage === 'register') {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentPage('login')} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentPage('register')} />;
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav style={{ 
        padding: '15px', 
        backgroundColor: '#3B82F6', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ margin: 0, cursor: 'pointer' }} onClick={() => setCurrentPage('wardrobe')}>
          🧥 Wardrobe Wise
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>Welcome, {user.username}!</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setCurrentPage('wardrobe')}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: currentPage === 'wardrobe' ? '#1D4ED8' : 'transparent', 
                color: 'white', 
                border: '1px solid white', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              👕 Wardrobe
            </button>
            
            <button 
              onClick={() => setCurrentPage('marketplace')}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: currentPage === 'marketplace' ? '#1D4ED8' : 'transparent', 
                color: 'white', 
                border: '1px solid white', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🛍️ Marketplace
            </button>

            <button 
              onClick={() => setCurrentPage('add-item')}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: currentPage === 'add-item' ? '#1D4ED8' : 'transparent', 
                color: 'white', 
                border: '1px solid white', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ➕ Add Item
            </button>
            
            <button 
              onClick={handleLogout}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#EF4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {currentPage === 'wardrobe' && <Wardrobe items={wardrobeItems} onAddItem={() => setCurrentPage('add-item')} />}
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'add-item' && (
          <AddItem 
            onAddItem={handleAddItem} 
            onCancel={() => setCurrentPage('wardrobe')} 
          />
        )}
      </main>
    </div>
  );
}

// Main App wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;