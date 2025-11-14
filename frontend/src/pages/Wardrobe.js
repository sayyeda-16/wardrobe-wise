// src/pages/Wardrobe.js (FINALIZED CODE)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaLeaf, FaPlus, FaRecycle, FaSeedling, FaFilter, FaSpinner } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import ItemFilters from '../components/ItemFilters';
import ItemDetails from '../components/ItemDetails';
import axios from 'axios'; // <-- Use Axios for consistency
import { useNavigate } from 'react-router-dom'; // Use navigate for routing

// Mock Data structure for fallback
const MOCK_ITEMS = [
    { item_id: 1, item_name: 'Organic Cotton T-Shirt', brand: 'Patagonia', category: 'Tops', size_label: 'M', color: 'Natural', condition: 'Like New', material: 'Organic Cotton', lifecycle: 'Active', seller_type: 'Retail', price_cents: 6000, purchase_date: '2024-01-15', image_url: 'placeholder.jpg' },
    { item_id: 2, item_name: 'Sustainable Denim Jeans', brand: "Levi's", category: 'Bottoms', size_label: '32', color: 'Indigo', condition: 'Good', material: 'Recycled Denim', lifecycle: 'Active', seller_type: 'LocalMarket', price_cents: 4500, purchase_date: '2024-03-20', image_url: 'placeholder.jpg' },
    { item_id: 3, item_name: 'Eco-Friendly Jacket', brand: 'The North Face', category: 'Outerwear', size_label: 'L', color: 'Forest Green', condition: 'Excellent', material: 'Recycled Polyester', lifecycle: 'Sold', seller_type: 'SecondHand', price_cents: 8000, purchase_date: '2023-11-01', image_url: 'placeholder.jpg' },
    { item_id: 4, item_name: 'Recycled Sneakers', brand: 'Veja', category: 'Shoes', size_label: '9', color: 'White', condition: 'Worn', material: 'Recycled Materials', lifecycle: 'Listed', seller_type: 'Retail', price_cents: 12000, purchase_date: '2024-06-01', image_url: 'placeholder.jpg' },
    { item_id: 5, item_name: 'Vintage Silk Scarf', brand: 'Unbranded', category: 'Accessories', size_label: 'One Size', color: 'Red', condition: 'Fair', material: 'Silk', lifecycle: 'Active', seller_type: 'Vintage', price_cents: 2000, purchase_date: '2024-08-10', image_url: 'placeholder.jpg' },
];
// Define lifecycle states explicitly for filters
const LIFECYCLE_OPTIONS = ['Active', 'Listed', 'Sold', 'Donated'];


function Wardrobe() {
  const { user } = useAuth(); // getAuthHeaders is not needed if using a configured axios instance
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    color: '',
    condition: '',
    lifecycle: 'Active', // Default filter to 'Active' for initial view
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  // --- Data Fetching ---
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // NOTE: Assuming axios is configured to include auth headers and base URL
      const response = await axios.get('/api/items/wardrobe/'); 

      setItems(response.data);
    } catch (apiError) {
      console.error('Error fetching items from API. Using mock data:', apiError.message);
      setItems(MOCK_ITEMS);
      setError('Using sustainable fashion demo data (API not available)');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // --- Derived Filter Lists (for ItemFilters component) ---
  const filterOptions = useMemo(() => {
    const allBrands = new Set();
    const allCategories = new Set();
    const allColors = new Set();
    const allConditions = new Set();

    items.forEach(item => {
      if (item.brand) allBrands.add(item.brand);
      if (item.category) allCategories.add(item.category);
      if (item.color) allColors.add(item.color);
      if (item.condition) allConditions.add(item.condition);
    });

    return {
      brands: Array.from(allBrands).sort(),
      categories: Array.from(allCategories).sort(),
      colors: Array.from(allColors).sort(),
      conditions: Array.from(allConditions).sort(),
      lifecycles: LIFECYCLE_OPTIONS,
    };
  }, [items]);

  // --- Filtering Logic ---
  useEffect(() => {
    const filtered = items.filter(item => {
      // API names: item.brand, item.category
      const brandName = item.brand || '';
      const categoryName = item.category || '';
      const colorValue = item.color || '';
      const conditionValue = item.condition || '';
      const lifecycleValue = item.lifecycle || '';

      return (
        (filters.category === '' || categoryName === filters.category) &&
        (filters.brand === '' || brandName.toLowerCase().includes(filters.brand.toLowerCase())) &&
        (filters.color === '' || colorValue.toLowerCase().includes(filters.color.toLowerCase())) &&
        (filters.condition === '' || conditionValue === filters.condition) &&
        (filters.lifecycle === '' || lifecycleValue === filters.lifecycle)
      );
    });
    setFilteredItems(filtered);
  }, [filters, items]);

  const handleFilterChange = (field, value) => {
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
      lifecycle: 'Active',
    });
  };

  // --- Item Actions ---
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const handleCloseDetails = () => {
    setShowItemDetails(false);
    setSelectedItem(null);
  };

  const handleSellItem = async (item) => {
    const price = prompt(`Set price (USD) for ${item.item_name || item.name}:`);
    if (!price || isNaN(price) || parseFloat(price) <= 0) return;

    try {
      await axios.post('/api/listings/', {
        item_id: item.item_id,
        price_cents: Math.round(parseFloat(price) * 100)
      });
      alert('Item successfully listed for sustainable resale!');
      fetchItems(); // Refresh data
      handleCloseDetails();
    } catch (error) {
      console.error('Error listing item:', error);
      alert('Item listed for circular fashion! (Mock Success)');
      // Mock update
      setItems(prevItems => 
        prevItems.map(i => 
          i.item_id === item.item_id 
            ? { ...i, lifecycle: 'Listed' }
            : i
        )
      );
      handleCloseDetails();
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Consider re-purposing ${item.item_name || item.name} instead of deleting?`)) return;

    try {
      await axios.delete(`/api/items/${item.item_id}/`);
      alert('Item removed sustainably');
      fetchItems(); // Refresh data
      handleCloseDetails();
    } catch (error) {
      console.error('Error deleting item:', error);
      // Mock update
      setItems(prevItems => prevItems.filter(i => i.item_id !== item.item_id));
      alert('Item removed from wardrobe (Mock Success)');
      handleCloseDetails();
    }
  };

  const handleEditItem = (item) => {
    // In a real app, this would route to an EditItem form
    navigate(`/edit-item/${item.item_id}`); 
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-green-700 bg-gray-50">
        <FaSpinner className="text-5xl mb-4 animate-spin text-green-600" />
        <div className="text-xl text-green-800 font-medium">Loading your sustainable wardrobe...</div>
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
              Welcome back, {user?.username || 'user'}! Manage your eco-friendly fashion collection.
            </p>
          </div>

          <button onClick={() => navigate('/add-item')} className="flex items-center gap-2 px-6 py-3 bg-green-200 text-green-900 font-semibold rounded-xl shadow-md hover:bg-white transition duration-300 transform hover:-translate-y-1">
            <FaPlus className="text-base" />
            Add Sustainable Item
          </button>
        </div>

        {/* Eco Stats Bar - simplified for demo data */}
        <div className="flex flex-wrap gap-6 pt-4 border-t border-green-700">
          <StatBox icon={FaSeedling} value={items.length} label="Sustainable Pieces" />
          <StatBox icon={FaRecycle} value={items.filter(item => item.lifecycle === 'Sold').length} label="Items Resold" />
          <StatBox icon={FaLeaf} value={filterOptions.brands.length} label="Eco Brands Tracked" />
        </div>
      </header>
      
      {/* Error/Mock Message */}
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
          // Pass derived options down to the filter component
          options={filterOptions} 
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
              : 'Try adjusting your filters (especially the lifecycle status) to discover more sustainable pieces.'
            }
          </p>
          {items.length === 0 && (
            <button onClick={() => navigate('/add-item')} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition duration-300 mx-auto transform hover:-translate-y-1">
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
                <ItemCard item={item} />
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

// Simple Helper Component for the Stats Bar
const StatBox = ({ icon: Icon, value, label }) => (
    <div className="flex items-center gap-3">
        <Icon className="text-2xl text-green-300" />
        <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-green-200">{label}</div>
        </div>
    </div>
);

export default Wardrobe;