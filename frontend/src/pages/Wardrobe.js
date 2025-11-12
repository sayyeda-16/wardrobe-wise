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
    condition: ''
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  // Fetch user's items from backend - wrapped in useCallback to avoid infinite re-renders
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
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
      const mockItems = [
        { 
          item_id: 1, 
          item_name: 'Organic Cotton T-Shirt', 
          brand_name: 'Patagonia', 
          category_name: 'Tops',
          size_label: 'M', 
          color: 'Natural', 
          condition: 'Like New',
          material: 'Organic Cotton',
          lifecycle: 'Active'
        },
        { 
          item_id: 2, 
          item_name: 'Sustainable Denim Jeans', 
          brand_name: 'Levi\'s', 
          category_name: 'Bottoms',
          size_label: '32', 
          color: 'Indigo', 
          condition: 'Good',
          material: 'Recycled Denim',
          lifecycle: 'Active'
        },
        { 
          item_id: 3, 
          item_name: 'Eco-Friendly Jacket', 
          brand_name: 'The North Face', 
          category_name: 'Outerwear',
          size_label: 'L', 
          color: 'Forest Green', 
          condition: 'Excellent',
          material: 'Recycled Polyester',
          lifecycle: 'Sold'
        }
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
      return (
        (filters.category === '' || (item.category_name || item.category) === filters.category) &&
        (filters.brand === '' || (item.brand_name || item.brand).toLowerCase().includes(filters.brand.toLowerCase())) &&
        (filters.color === '' || item.color.toLowerCase().includes(filters.color.toLowerCase())) &&
        (filters.condition === '' || item.condition === filters.condition)
      );
    });
    setFilteredItems(filtered);
  }, [filters, items]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      color: '',
      condition: ''
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
      setItems(prevItems => 
        prevItems.map(i => 
          i.item_id === item.item_id 
            ? { ...i, lifecycle: 'Sold' }
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
      <div style={styles.loadingContainer}>
        <FaLeaf style={styles.loadingIcon} />
        <div style={styles.loadingText}>Loading your sustainable wardrobe...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <FaLeaf style={styles.logoIcon} />
              <span style={styles.logoText}>EcoWardrobe</span>
            </div>
            <h1 style={styles.title}>My Sustainable Wardrobe</h1>
            <p style={styles.subtitle}>
              Welcome back, {user?.username}! Manage your eco-friendly fashion collection.
            </p>
          </div>

          <button onClick={onAddItem} style={styles.addButton}>
            <FaPlus style={styles.addIcon} />
            Add Sustainable Item
          </button>
        </div>

        {/* Eco Stats Bar */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <FaRecycle style={styles.statIcon} />
            <div>
              <div style={styles.statNumber}>{items.filter(item => item.lifecycle === 'Sold').length}</div>
              <div style={styles.statLabel}>Items Resold</div>
            </div>
          </div>
          <div style={styles.statItem}>
            <FaSeedling style={styles.statIcon} />
            <div>
              <div style={styles.statNumber}>{items.length}</div>
              <div style={styles.statLabel}>Sustainable Pieces</div>
            </div>
          </div>
          <div style={styles.statItem}>
            <FaLeaf style={styles.statIcon} />
            <div>
              <div style={styles.statNumber}>{new Set(items.map(item => item.brand_name || item.brand)).size}</div>
              <div style={styles.statLabel}>Eco Brands</div>
            </div>
          </div>
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
            <button onClick={onAddItem} style={styles.ctaButton}>
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
                <ItemCard 
                  item={item}
                  onSell={handleSellItem}
                  onDelete={handleDeleteItem}
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

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f7e6 0%, #e8f4d3 100%)',
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
    background: 'linear-gradient(135deg, #556b2f 0%, #6b8e23 100%)',
    borderRadius: '20px',
    padding: '40px',
    marginBottom: '30px',
    color: 'white',
    boxShadow: '0 10px 40px rgba(34, 51, 17, 0.2)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
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
    color: '#d4e6a4',
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
    color: '#d4e6a4',
    margin: 0,
    opacity: 0.9,
  },
  addButton: {
    padding: '15px 25px',
    backgroundColor: '#d4e6a4',
    color: '#556b2f',
    border: 'none',
    borderRadius: '12px',
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
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  statIcon: {
    fontSize: '24px',
    color: '#d4e6a4',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: '14px',
    color: '#d4e6a4',
    opacity: 0.9,
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#f0f7e6',
    color: '#556b2f',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #d4e6a4',
  },
  errorIcon: {
    marginRight: '10px',
    fontSize: '18px',
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: '16px',
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
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
    border: '2px dashed #d4e6a4',
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
    borderRadius: '12px',
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
    borderRadius: '20px',
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