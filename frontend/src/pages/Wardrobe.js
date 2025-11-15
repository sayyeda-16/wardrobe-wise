// src/pages/Wardrobe.js (FINAL DOUBLE-CHECKED & STYLED)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
// Added FaTshirt for the StatBox component
import { FaLeaf, FaPlus, FaRecycle, FaSeedling, FaFilter, FaSpinner, FaTshirt } from 'react-icons/fa'; 
import ItemCard from '../components/ItemCard';
import ItemFilters from '../components/ItemFilters';
import ItemDetails from '../components/ItemDetails';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- Theme & Data Constants ---

// Define the primary color palette for consistency and readability (Restored for reliable styling)
const THEME_COLORS = {
  primaryGreen: '#6b8e23', // Olive Green (Darker text, main CTA)
  secondaryGreen: '#8ea67c', // Muted Sage (Button backgrounds, accents)
  lightGreen: '#e8f4d3', // Very Light Green (Backgrounds, hover effects)
  offWhite: '#f0f7e6', // Near White (Content backgrounds)
  darkText: '#3c5a17', // Darker text for high contrast
  subtleText: '#556b2f', // Medium text for subtitles/details
};

// Mock Data structure for fallback (Unchanged)
const MOCK_ITEMS = [
    { item_id: 1, item_name: 'Organic Cotton T-Shirt', brand: 'Patagonia', category: 'Tops', size_label: 'M', color: 'Natural', condition: 'Like New', material: 'Organic Cotton', lifecycle: 'Active', seller_type: 'Retail', price_cents: 6000, purchase_date: '2024-01-15', image_url: 'placeholder.jpg' },
    { item_id: 2, item_name: 'Sustainable Denim Jeans', brand: "Levi's", category: 'Bottoms', size_label: '32', color: 'Indigo', condition: 'Good', material: 'Recycled Denim', lifecycle: 'Active', seller_type: 'LocalMarket', price_cents: 4500, purchase_date: '2024-03-20', image_url: 'placeholder.jpg' },
    { item_id: 3, item_name: 'Eco-Friendly Jacket', brand: 'The North Face', category: 'Outerwear', size_label: 'L', color: 'Forest Green', condition: 'Excellent', material: 'Recycled Polyester', lifecycle: 'Sold', seller_type: 'SecondHand', price_cents: 8000, purchase_date: '2023-11-01', image_url: 'placeholder.jpg' },
    { item_id: 4, item_name: 'Recycled Sneakers', brand: 'Veja', category: 'Shoes', size_label: '9', color: 'White', condition: 'Worn', material: 'Recycled Materials', lifecycle: 'Listed', seller_type: 'Retail', price_cents: 12000, purchase_date: '2024-06-01', image_url: 'placeholder.jpg' },
    { item_id: 5, item_name: 'Vintage Silk Scarf', brand: 'Unbranded', category: 'Accessories', size_label: 'One Size', color: 'Red', condition: 'Fair', material: 'Silk', lifecycle: 'Active', seller_type: 'Vintage', price_cents: 2000, purchase_date: '2024-08-10', image_url: 'placeholder.jpg' },
];

const LIFECYCLE_OPTIONS = ['Active', 'Listed', 'Sold', 'Donated'];

// --- Helper Components --- (Unchanged)
const StatBox = ({ icon: Icon, value, label }) => (
  <div style={styles.statItem}>
    <Icon style={styles.statIcon} />
    <div>
      <div style={styles.statNumber}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

// --- Main Component ---
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

  // Data fetching logic (Unchanged)
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
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

  // Filter options logic (Unchanged)
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

  // Filtering logic (Unchanged)
  useEffect(() => {
    const filtered = items.filter(item => {
      const { category, brand, color, condition, lifecycle } = filters;
      
      const itemBrand = item.brand || '';
      const itemCategory = item.category || '';
      const itemColor = item.color || '';
      const itemCondition = item.condition || '';
      const itemLifecycle = item.lifecycle || '';

      return (
        (category === '' || itemCategory === category) &&
        (brand === '' || itemBrand.toLowerCase().includes(brand.toLowerCase())) &&
        (color === '' || itemColor.toLowerCase().includes(color.toLowerCase())) &&
        (condition === '' || itemCondition === condition) &&
        (lifecycle === '' || itemLifecycle === lifecycle)
      );
    });
    setFilteredItems(filtered);
  }, [filters, items]);

  // Handlers (Unchanged)
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
      await axios.post('/api/listings/', {
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
      await axios.delete(`/api/items/${item.item_id}/`);
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
      {/* 💚 MODIFIED HERO BAR SECTION (JSX from previous step) 💚 */}
      <div style={styles.header}>
        <div style={styles.headerBackground}></div>
        {/* Header Content */}
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
      

        {/* Eco Stats Bar - NOTE: Using FaTshirt for consistency with the last revision */}
        <div style={styles.statsBar}>
          <StatBox icon={FaTshirt} value={items.length} label="Total Pieces" />
          <StatBox icon={FaRecycle} value={items.filter(item => item.lifecycle === 'Sold').length} label="Items Resold" />
          <StatBox icon={FaSeedling} value={filterOptions.brands.length} label="Eco Brands Tracked" />
        </div>
      </div>
      {/* 💚 END MODIFIED HERO BAR SECTION 💚 */}

      {/* Error Message (Unchanged) */}
      {error && (
        <div style={styles.error}>
          <span style={styles.errorIcon}>🌱</span>
          {error}
        </div>
      )}

      {/* Filters Section (Unchanged) */}
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

      {/* Items Grid (Unchanged) */}
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

      {/* Item Details Modal (Unchanged) */}
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

// --- Component Styling (Enhanced Readability & Contrast for Hero Bar) ---

const styles = {
  // --- General Styles (Using THEME_COLORS for consistency) ---
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${THEME_COLORS.offWhite} 0%, ${THEME_COLORS.lightGreen} 100%)`,
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: THEME_COLORS.primaryGreen,
  },
  loadingIcon: {
    fontSize: '48px',
    marginBottom: '20px',
    animation: 'pulse 2s infinite',
  },
  loadingText: {
    fontSize: '18px',
    color: THEME_COLORS.subtleText,
  },
  
  // --- HERO BAR STYLES (MODIFIED for Contrast/Readability) ---
  header: {
    position: 'relative',
    padding: '50px 40px 0', 
    marginBottom: '30px',
    backgroundColor: THEME_COLORS.primaryGreen, // High contrast background
    color: 'white',
    boxShadow: '0 10px 40px rgba(34, 51, 17, 0.4)', 
    overflow: 'hidden',
    borderRadius: '12px', 
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Darker overlay for better text contrast
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://img.freepik.com/premium-photo/xaa-sustainable-fashion-concept-banner_958297-9941.jpg?semt=ais_incoming&w=740&q=80")`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center 70%',
    opacity: 0.8,
    zIndex: 1,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '50px', 
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
    color: THEME_COLORS.lightGreen, // High contrast
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '3em', 
    fontWeight: '800', 
    margin: '0 0 10px 0',
    color: 'white',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    color: THEME_COLORS.lightGreen, 
    margin: 0,
    opacity: 1,
  },
  addButton: {
    padding: '12px 20px', 
    backgroundColor: THEME_COLORS.lightGreen, 
    color: THEME_COLORS.darkText, 
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
    fontWeight: '700', 
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)`,
    marginTop: '10px',
  },
  addIcon: {
    fontSize: '15px',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-between', 
    gap: '20px',
    padding: '25px 40px', 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderTop: `1px solid rgba(255, 255, 255, 0.3)`, 
    position: 'relative',
    zIndex: 2,
    margin: '0 -40px', 
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  statIcon: {
    fontSize: '28px', 
    color: THEME_COLORS.lightGreen, // High contrast
  },
  statNumber: {
    fontSize: '28px', 
    fontWeight: '800',
    color: 'white',
  },
  statLabel: {
    fontSize: '13px',
    color: THEME_COLORS.lightGreen,
    opacity: 1,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  // --- END HERO BAR STYLES ---

  // --- Other Styles (Mapped to THEME_COLORS) ---
  error: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: THEME_COLORS.offWhite,
    color: THEME_COLORS.darkText,
    marginBottom: '20px',
    fontSize: '14px',
    border: `1px solid ${THEME_COLORS.secondaryGreen}`,
    borderRadius: '4px',
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
    border: `1px solid ${THEME_COLORS.lightGreen}`,
  },
  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
    color: THEME_COLORS.subtleText,
  },
  filterIcon: {
    fontSize: '16px',
  },
  filtersTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: THEME_COLORS.subtleText,
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
    border: `2px dashed ${THEME_COLORS.secondaryGreen}`,
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '30px',
  },
  emptyTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: THEME_COLORS.subtleText,
    margin: '0 0 15px 0',
  },
  emptyText: {
    fontSize: '16px',
    color: THEME_COLORS.primaryGreen,
    margin: '0 0 30px 0',
    lineHeight: '1.6',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  ctaButton: {
    padding: '15px 30px',
    backgroundColor: THEME_COLORS.primaryGreen,
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
    color: THEME_COLORS.subtleText,
    fontSize: '15px',
    fontWeight: '500',
  },
  ecoImpact: {
    color: THEME_COLORS.primaryGreen,
    fontSize: '14px',
    backgroundColor: THEME_COLORS.offWhite,
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

// Add CSS animations (Updated classes/colors for hover effects)
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  .add-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(107, 142, 35, 0.3);
    background-color: white; /* High contrast hover */
  }

  .cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(107, 142, 35, 0.5);
    background-color: ${THEME_COLORS.darkText};
  }

  .item-wrapper:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(34, 51, 17, 0.15);
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