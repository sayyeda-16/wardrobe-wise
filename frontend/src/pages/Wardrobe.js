// src/pages/Wardrobe.js (UPDATED STYLING)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaLeaf, FaPlus, FaRecycle, FaSeedling, FaFilter, FaSpinner } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import ItemFilters from '../components/ItemFilters';
import ItemDetails from '../components/ItemDetails';
import api from 'axios';
import { useNavigate } from 'react-router-dom';

// Mock Data structure for fallback
const MOCK_ITEMS = [
    { item_id: 1, item_name: 'Organic Cotton T-Shirt', brand: 'Patagonia', category: 'Tops', size_label: 'M', color: 'Natural', condition: 'Like New', material: 'Organic Cotton', lifecycle: 'Active', seller_type: 'Retail', price_cents: 6000, purchase_date: '2024-01-15', image_url: 'placeholder.jpg' },
    { item_id: 2, item_name: 'Sustainable Denim Jeans', brand: "Levi's", category: 'Bottoms', size_label: '32', color: 'Indigo', condition: 'Good', material: 'Recycled Denim', lifecycle: 'Active', seller_type: 'LocalMarket', price_cents: 4500, purchase_date: '2024-03-20', image_url: 'placeholder.jpg' },
    { item_id: 3, item_name: 'Eco-Friendly Jacket', brand: 'The North Face', category: 'Outerwear', size_label: 'L', color: 'Forest Green', condition: 'Excellent', material: 'Recycled Polyester', lifecycle: 'Sold', seller_type: 'SecondHand', price_cents: 8000, purchase_date: '2023-11-01', image_url: 'placeholder.jpg' },
    { item_id: 4, item_name: 'Recycled Sneakers', brand: 'Veja', category: 'Shoes', size_label: '9', color: 'White', condition: 'Worn', material: 'Recycled Materials', lifecycle: 'Listed', seller_type: 'Retail', price_cents: 12000, purchase_date: '2024-06-01', image_url: 'placeholder.jpg' },
    { item_id: 5, item_name: 'Vintage Silk Scarf', brand: 'Unbranded', category: 'Accessories', size_label: 'One Size', color: 'Red', condition: 'Fair', material: 'Silk', lifecycle: 'Active', seller_type: 'Vintage', price_cents: 2000, purchase_date: '2024-08-10', image_url: 'placeholder.jpg' },
];

const LIFECYCLE_OPTIONS = ['Active', 'Listed', 'Sold', 'Donated'];

function Wardrobe() {
  const { user } = useAuth();
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
    lifecycle: 'Active',
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/items/wardrobe/'); 
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

  useEffect(() => {
    const filtered = items.filter(item => {
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
      await api.post('/api/listings/', {
        item_id: item.item_id,
        price_cents: Math.round(parseFloat(price) * 100)
      });
      alert('Item successfully listed for sustainable resale!');
      fetchItems();
      handleCloseDetails();
    } catch (error) {
      console.error('Error listing item:', error);
      alert('Item listed for circular fashion! (Mock Success)');
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
      await api.delete(`/api/items/${item.item_id}/`);
      alert('Item removed sustainably');
      fetchItems();
      handleCloseDetails();
    } catch (error) {
      console.error('Error deleting item:', error);
      setItems(prevItems => prevItems.filter(i => i.item_id !== item.item_id));
      alert('Item removed from wardrobe (Mock Success)');
      handleCloseDetails();
    }
  };

  const handleEditItem = (item) => {
    navigate(`/edit-item/${item.item_id}`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.loadingIcon} />
        <div style={styles.loadingText}>Loading your sustainable wardrobe...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerBackground}></div>
        <div style={styles.headerContent}>
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <FaLeaf style={styles.logoIcon} />
              <span style={styles.logoText}>WardrobeWise</span>
            </div>
            <h1 style={styles.title}>My Sustainable Wardrobe</h1>
            <p style={styles.subtitle}>
              Welcome back, {user?.username || 'user'}! Manage your eco-friendly fashion collection.
            </p>
          </div>

          <button onClick={() => navigate('/add-item')} style={styles.addButton}>
            <FaPlus style={styles.addIcon} />
            Add Sustainable Item
          </button>
        </div>

        {/* Eco Stats Bar */}
        <div style={styles.statsBar}>
          <StatBox icon={FaSeedling} value={items.length} label="Sustainable Pieces" />
          <StatBox icon={FaRecycle} value={items.filter(item => item.lifecycle === 'Sold').length} label="Items Resold" />
          <StatBox icon={FaLeaf} value={filterOptions.brands.length} label="Eco Brands Tracked" />
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          <span style={styles.errorIcon}>🌱</span>
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersHeader}>
          <FaFilter style={styles.filterIcon} />
          <span style={styles.filtersTitle}>Filter Sustainable Items</span>
        </div>
        <ItemFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          options={filterOptions}
        />
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>👕</div>
          <h3 style={styles.emptyTitle}>
            {items.length === 0 ? 'Your sustainable wardrobe awaits' : 'No eco-items match your filters'}
          </h3>
          <p style={styles.emptyText}>
            {items.length === 0 
              ? 'Start your sustainable fashion journey by adding your first eco-friendly item!' 
              : 'Try adjusting your filters to discover more sustainable pieces.'
            }
          </p>
          {items.length === 0 && (
            <button onClick={() => navigate('/add-item')} style={styles.ctaButton}>
              <FaPlus style={styles.ctaIcon} />
              Begin Sustainable Collection
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={styles.resultsInfo}>
            <div style={styles.resultsText}>
              Showing {filteredItems.length} of {items.length} sustainable item{items.length !== 1 ? 's' : ''}
            </div>
            <div style={styles.ecoImpact}>
              ♻️ Reducing fashion waste through circular fashion
            </div>
          </div>

          <div style={styles.itemsGrid}>
            {filteredItems.map(item => (
              <div key={item.item_id || item.id} onClick={() => handleViewDetails(item)} style={styles.itemWrapper}>
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

const StatBox = ({ icon: Icon, value, label }) => (
  <div style={styles.statItem}>
    <Icon style={styles.statIcon} />
    <div>
      <div style={styles.statNumber}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #edf7e6ff 0%, #dff4d3ff 100%)',
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: '#6b8e23',
  },
  loadingIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    animation: 'pulse 2s infinite',
  },
  loadingText: {
    fontSize: '18px',
    color: '#556b2f',
  },
  header: {
    position: 'relative',
    padding: '40px',
    marginBottom: '30px',
    color: 'white',
    boxShadow: '0 10px 40px rgba(34, 51, 17, 0.2)',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(rgba(233, 244, 213, 0.4), rgba(233, 244, 213, 0.4)), url("https://img.freepik.com/premium-photo/xaa-sustainable-fashion-concept-banner_958297-9941.jpg?semt=ais_incoming&w=740&q=80")',    
    backgroundSize: 'cover',
    backgroundPosition: 'center 70%',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    position: 'relative',
    zIndex: 2,
  },
  brandSection: {
    flex: 1,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  logoIcon: {
    fontSize: '32px',
    marginRight: '12px',
    color: '#6f8260ff',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: '2.5em',
    fontWeight: '700',
    margin: '0 0 10px 0',
    color: 'white',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6f8260ff',
    margin: 0,
    opacity: 0.9,
  },
  addButton: {
    padding: '15px 25px',
    backgroundColor: '#8ea67cff',
    color: '#556b2f',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(212, 230, 164, 0.3)',
  },
  addIcon: {
    fontSize: '16px',
  },
  statsBar: {
    display: 'flex',
    gap: '30px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(212, 230, 164, 0.3)',
    position: 'relative',
    zIndex: 2,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  statIcon: {
    fontSize: '24px',
    color: '#6f8260ff',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6f8260ff',
    opacity: 0.9,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#f0f7e6',
    color: '#556b2f',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #6f8260ff',
  },
  errorIcon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  filtersContainer: {
    backgroundColor: 'white',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
    border: '1px solid #e8f4d3',
  },
  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    color: '#556b2f',
  },
  filterIcon: {
    fontSize: '16px',
  },
  filtersTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#556b2f',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
    border: '2px dashed #6f8260ff',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '30px',
  },
  emptyTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#556b2f',
    margin: '0 0 15px 0',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b8e23',
    margin: '0 0 30px 0',
    lineHeight: '1.6',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  ctaButton: {
    padding: '15px 30px',
    backgroundColor: '#6b8e23',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  ctaIcon: {
    fontSize: '14px',
  },
  resultsInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    padding: '0 10px',
  },
  resultsText: {
    color: '#556b2f',
    fontSize: '15px',
    fontWeight: '500',
  },
  ecoImpact: {
    color: '#6b8e23',
    fontSize: '14px',
    backgroundColor: '#f0f7e6',
    padding: '8px 16px',
    fontWeight: '500',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '25px',
  },
  itemWrapper: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .add-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 230, 164, 0.4);
    background-color: #e8f4d3;
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 142, 35, 0.4);
    background-color: #556b2f;
  }

  .item-wrapper:hover {
    transform: translateY(-4px);
  }
`;

document.head.appendChild(styleSheet);

// Add hover effects
Object.assign(styles.addButton, {
  className: 'add-button',
});

Object.assign(styles.ctaButton, {
  className: 'cta-button',
});

Object.assign(styles.itemWrapper, {
  className: 'item-wrapper',
});

export default Wardrobe;