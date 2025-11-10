import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ItemCard from '../components/ItemCard';

function Wardrobe({ onAddItem }) {
  const { user, getAuthHeaders } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's items from backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      // Try to fetch from actual backend
      const response = await fetch('http://localhost:8000/api/items/', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        // Fallback to mock data if backend fails
        throw new Error('Backend not available, using mock data');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      // Mock data for demo
      const mockItems = [
        { 
          item_id: 1, 
          item_name: 'Blue Jeans', 
          brand_name: 'Levi\'s', 
          category_name: 'Bottoms',
          size_label: 'M', 
          color: 'Blue', 
          condition: 'Good',
          material: 'Denim',
          lifecycle: 'Active'
        },
        { 
          item_id: 2, 
          item_name: 'White T-Shirt', 
          brand_name: 'Uniqlo', 
          category_name: 'Tops',
          size_label: 'L', 
          color: 'White', 
          condition: 'Like New',
          material: 'Cotton',
          lifecycle: 'Active'
        },
        { 
          item_id: 3, 
          item_name: 'Black Jacket', 
          brand_name: 'Zara', 
          category_name: 'Outerwear',
          size_label: 'M', 
          color: 'Black', 
          condition: 'Excellent',
          material: 'Polyester',
          lifecycle: 'Sold'
        }
      ];
      setItems(mockItems);
      setError('Using demo data - backend not connected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSellItem = async (item) => {
    const price = prompt(`Enter price for ${item.item_name || item.name}:`);
    if (!price || isNaN(price)) return;

    try {
      // Try to call backend API
      const response = await fetch('http://localhost:8000/api/listings/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          item_id: item.item_id || item.id,
          price: parseFloat(price)
        }),
      });

      if (response.ok) {
        alert('Item listed for sale successfully!');
        fetchItems(); // Refresh the list
      } else {
        throw new Error('Failed to list item');
      }
    } catch (error) {
      console.error('Error listing item:', error);
      alert('Item listed for sale (demo mode)!');
      // Update local state for demo
      setItems(prevItems => 
        prevItems.map(i => 
          i.item_id === item.item_id 
            ? { ...i, lifecycle: 'Sold' }
            : i
        )
      );
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.item_name || item.name}?`)) return;

    try {
      // Try to call backend API
      const response = await fetch(`http://localhost:8000/api/items/${item.item_id || item.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setItems(prevItems => prevItems.filter(i => i.item_id !== item.item_id));
        alert('Item deleted successfully!');
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Update local state for demo
      setItems(prevItems => prevItems.filter(i => i.item_id !== item.item_id));
      alert('Item deleted (demo mode)!');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '1.5em', color: '#6B7280' }}>Loading your wardrobe...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#1F2937', margin: 0, fontSize: '2em' }}>My Wardrobe</h1>
          <p style={{ color: '#6B7280', margin: '5px 0 0 0' }}>
            Welcome back, {user?.username}! Manage your clothing items here.
          </p>
        </div>
        <button 
          onClick={onAddItem}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#3B82F6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
        >
          + Add New Item
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#FEF3C7', 
          color: '#92400E',
          border: '1px solid #F59E0B',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {items.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px', 
          color: '#6B7280',
          backgroundColor: '#F9FAFB',
          borderRadius: '12px',
          border: '2px dashed #D1D5DB'
        }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>👕</div>
          <h3 style={{ color: '#374151', marginBottom: '10px' }}>Your wardrobe is empty</h3>
          <p style={{ marginBottom: '30px' }}>Start building your fashion collection by adding your first item!</p>
          <button 
            onClick={onAddItem}
            style={{ 
              padding: '12px 24px', 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ color: '#6B7280' }}>
              Showing {items.length} item{items.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '20px' 
          }}>
            {items.map(item => (
              <ItemCard 
                key={item.item_id || item.id}
                item={item}
                onSell={handleSellItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Wardrobe;