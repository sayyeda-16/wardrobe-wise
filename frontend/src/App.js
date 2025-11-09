import React, { useState } from 'react';
import Login from './pages/Login';
import Wardrobe from './pages/Wardrobe';
import Marketplace from './pages/Marketplace';
import AddItem from './pages/AddItem';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [wardrobeItems, setWardrobeItems] = useState([
    { id: 1, name: 'Blue Jeans', brand: 'Levi\'s', size: 'M', color: 'Blue', condition: 'Good' },
    { id: 2, name: 'White T-Shirt', brand: 'Uniqlo', size: 'L', color: 'White', condition: 'Like New' },
    { id: 3, name: 'Black Jacket', brand: 'Zara', size: 'M', color: 'Black', condition: 'Excellent' }
  ]);

  const handleAddItem = (newItem) => {
    const itemWithId = { ...newItem, id: Date.now() };
    setWardrobeItems([...wardrobeItems, itemWithId]);
    setCurrentPage('wardrobe');
  };

  // If on login page, just show login
  if (currentPage === 'login') {
    return <Login onLogin={() => setCurrentPage('wardrobe')} />;
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
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setCurrentPage('wardrobe')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: currentPage === 'wardrobe' ? '#1D4ED8' : 'transparent', 
              color: 'white', 
              border: '1px solid white', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            👕 My Wardrobe
          </button>
          
          <button 
            onClick={() => setCurrentPage('marketplace')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: currentPage === 'marketplace' ? '#1D4ED8' : 'transparent', 
              color: 'white', 
              border: '1px solid white', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🛍️ Marketplace
          </button>

          <button 
            onClick={() => setCurrentPage('add-item')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: currentPage === 'add-item' ? '#1D4ED8' : 'transparent', 
              color: 'white', 
              border: '1px solid white', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ➕ Add Item
          </button>
          
          <button 
            onClick={() => setCurrentPage('login')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#EF4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🚪 Logout
          </button>
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

export default App;