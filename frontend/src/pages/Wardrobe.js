// src/pages/Wardrobe.js (UPDATED CODE)
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaLeaf, FaPlus, FaRecycle, FaSeedling, FaFilter } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import ItemFilters from '../components/ItemFilters';
import ItemDetails from '../components/ItemDetails';

function Wardrobe({ onAddItem }) {
  const { user, getAuthHeaders } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    color: '',
    condition: '',
    lifecycle: '', // <-- NEW: Added lifecycle filter state
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  // Fetch user's items from backend
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      // NOTE: Using a v_user_catalog or similar endpoint is assumed to fetch all item details needed.
      const response = await fetch('http://localhost:8000/api/items/', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
        setFilteredItems(data);
      } else {
        throw new Error('Backend not available, using mock data');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      // Mock data includes essential lifecycle info for filtering
      const mockItems = [
        { 
          item_id: 1, 
          item_name: 'Organic Cotton T-Shirt', 
          brand: 'Patagonia', // Using simpler keys for mock consistency
          category: 'Tops',
          size_label: 'M', 
          color: 'Natural', 
          condition: 'Like New',
          material: 'Organic Cotton',
          lifecycle: 'Active', // Crucial for filter
          seller_type: 'Retail', price_cents: 6000, purchase_date: '2024-01-15'
        },
        { 
          item_id: 2, 
          item_name: 'Sustainable Denim Jeans', 
          brand: 'Levi\'s', 
          category: 'Bottoms',
          size_label: '32', 
          color: 'Indigo', 
          condition: 'Good',
          material: 'Recycled Denim',
          lifecycle: 'Active',
          seller_type: 'LocalMarket', price_cents: 4500, purchase_date: '2024-03-20'
        },
        { 
          item_id: 3, 
          item_name: 'Eco-Friendly Jacket', 
          brand: 'The North Face', 
          category: 'Outerwear',
          size_label: 'L', 
          color: 'Forest Green', 
          condition: 'Excellent',
          material: 'Recycled Polyester',
          lifecycle: 'Sold', // Crucial for filter
          seller_type: 'SecondHand', price_cents: 8000, purchase_date: '2023-11-01'
        },
      ];
      setItems(mockItems);
      setFilteredItems(mockItems);
      setError('Using sustainable fashion demo data');
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Apply filters whenever filters or items change
  useEffect(() => {
    const filtered = items.filter(item => {
      // NOTE: Using item.brand/category for mock consistency, API uses item.brand_name/category_name
      const brandName = item.brand_name || item.brand || '';
      const categoryName = item.category_name || item.category || '';

      return (
        (filters.category === '' || categoryName === filters.category) &&
        (filters.brand === '' || brandName.toLowerCase().includes(filters.brand.toLowerCase())) &&
        (filters.color === '' || (item.color || '').toLowerCase().includes(filters.color.toLowerCase())) &&
        (filters.condition === '' || item.condition === filters.condition) &&
        (filters.lifecycle === '' || item.lifecycle === filters.lifecycle) // <-- NEW: Lifecycle Filter Check
      );
    });
    setFilteredItems(filtered);
  }, [filters, items]);

  const handleFilterChange = (field, value) => { // Updated to accept field, value directly
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      color: '',
      condition: '',
      lifecycle: '', // Clear lifecycle too
    });
  };
  
  // (handleViewDetails, handleCloseDetails, handleSellItem, handleDeleteItem, handleEditItem remain the same)
  // ... (omitting action functions for brevity, assume they are copied over)
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const handleCloseDetails = () => {
    setShowItemDetails(false);
    setSelectedItem(null);
  };

  const handleSellItem = async (item) => {
    const price = prompt(`Set sustainable price for ${item.item_name || item.name}:`);
    if (!price || isNaN(price)) return;

    try {
      const response = await fetch('http://localhost:8000/api/listings/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          item_id: item.item_id || item.id,
          price: parseFloat(price)
        }),
      });

      if (response.ok) {
        alert('Item listed for sustainable resale!');
        fetchItems();
        handleCloseDetails();
      } else {
        throw new Error('Failed to list item');
      }
    } catch (error) {
      console.error('Error listing item:', error);
      alert('Item listed for circular fashion!');
      // Mock update
      setItems(prevItems => 
        prevItems.map(i => 
          i.item_id === item.item_id 
            ? { ...i, lifecycle: 'Listed' } // Set to 'Listed' for mock
            : i
        )
      );
      handleCloseDetails();
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Consider donating ${item.item_name || item.name} instead of deleting?`)) return;

    try {
      const response = await fetch(`/api/items/${item.item_id || item.id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setItems(prevItems => prevItems.filter(i => i.item_id !== item.item_id));
        alert('Item removed sustainably');
        handleCloseDetails();
      } else {
        throw new Error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Mock update
      setItems(prevItems => prevItems.filter(i => i.item_id !== item.item_id));
      alert('Item removed from wardrobe');
      handleCloseDetails();
    }
  };

  const handleEditItem = (item) => {
    alert(`Edit sustainable details for ${item.item_name || item.name}`);
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-green-700">
        <FaLeaf className="text-5xl mb-4 animate-pulse" />
        <div className="text-lg text-green-800">Loading your sustainable wardrobe...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <header className="bg-green-800 rounded-2xl p-6 sm:p-10 lg:p-12 mb-8 text-white shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <FaLeaf className="text-3xl mr-3 text-green-300" />
              <span className="text-2xl font-bold text-white">EcoWardrobe</span>
            </div>
            <h1 className="text-4xl font-extrabold mb-1">My Sustainable Wardrobe</h1>
            <p className="text-green-200">
              Welcome back, {user?.username}! Manage your eco-friendly fashion collection.
            </p>
          </div>

          <button onClick={onAddItem} className="flex items-center gap-2 px-6 py-3 bg-green-200 text-green-900 font-semibold rounded-xl shadow-md hover:bg-white transition duration-300 transform hover:-translate-y-1">
            <FaPlus className="text-base" />
            Add Sustainable Item
          </button>
        </div>

        {/* Eco Stats Bar */}
        <div className="flex flex-wrap gap-6 pt-4 border-t border-green-700">
          <div className="flex items-center gap-3">
            <FaRecycle className="text-2xl text-green-300" />
            <div>
              <div className="text-2xl font-bold">{items.filter(item => item.lifecycle === 'Sold').length}</div>
              <div className="text-sm text-green-200">Items Resold</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaSeedling className="text-2xl text-green-300" />
            <div>
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-sm text-green-200">Sustainable Pieces</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaLeaf className="text-2xl text-green-300" />
            <div>
              <div className="text-2xl font-bold">{new Set(items.map(item => item.brand_name || item.brand)).size}</div>
              <div className="text-sm text-green-200">Eco Brands</div>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center p-4 bg-green-50 text-green-800 rounded-lg mb-6 border border-green-200 font-medium">
          <span className="mr-2 text-xl">🌱</span>
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-5 mb-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-green-800">
          <FaFilter className="text-lg" />
          <span className="text-lg font-semibold">Filter Sustainable Items</span>
        </div>
        <ItemFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl shadow-lg border-2 border-dashed border-green-300">
          <div className="text-7xl mb-6">👕</div>
          <h3 className="text-3xl font-semibold text-gray-700 mb-4">
            {items.length === 0 ? 'Your sustainable wardrobe awaits' : 'No eco-items match your filters'}
          </h3>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            {items.length === 0 
              ? 'Start your sustainable fashion journey by adding your first eco-friendly item!' 
              : 'Try adjusting your filters (including lifecycle status) to discover more sustainable pieces.'
            }
          </p>
          {items.length === 0 && (
            <button onClick={onAddItem} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition duration-300 mx-auto transform hover:-translate-y-1">
              <FaPlus className="text-base" />
              Begin Sustainable Collection
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-5 px-1">
            <div className="text-gray-600 text-sm font-medium">
              Showing <span className="font-bold">{filteredItems.length}</span> of {items.length} sustainable item{items.length !== 1 ? 's' : ''}
            </div>
            <div className="text-green-600 text-sm bg-green-100 px-3 py-1 rounded-full font-medium">
              ♻️ Reducing fashion waste through circular fashion
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div key={item.item_id || item.id} onClick={() => handleViewDetails(item)} className="cursor-pointer hover:shadow-xl transition duration-300 transform hover:-translate-y-1 rounded-xl">
                <ItemCard 
                  item={item}
                  // ItemCard will likely show a quick view, detailed actions are in the modal
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Item Details Modal */}
      <ItemDetails
        item={selectedItem}
        isOpen={showItemDetails}
        onClose={handleCloseDetails}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onSell={handleSellItem}
      />
    </div>
  );
}

export default Wardrobe;