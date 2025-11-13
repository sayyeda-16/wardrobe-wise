import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { FaTag, FaLeaf, FaRecycle, FaSeedling, FaTshirt, FaShoePrints, FaGem, FaShoppingCart } from 'react-icons/fa';

// Accept isMarketplace prop to determine button type
function ItemCard({ item, onSell, onDelete, isMarketplace = false }) { 
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New': return '#10b981';
      case 'Like New': return '#059669';
      case 'Good': return '#d97706';
      case 'Fair': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Tops': return <FaTshirt style={{ fontSize: '14px' }} />;
      case 'Bottoms': return <FaSeedling style={{ fontSize: '14px' }} />;
      case 'Shoes': return <FaShoePrints style={{ fontSize: '14px' }} />;
      case 'Accessories': return <FaGem style={{ fontSize: '14px' }} />;
      default: return <FaLeaf style={{ fontSize: '14px' }} />;
    }
  };

  const getCardColor = (itemId) => {
    const colors = [
      { background: '#f0f7e6', border: '#d4e6a4', accent: '#6b8e23' }, // Light sage
      { background: '#e8f4d3', border: '#b8d4a4', accent: '#556b2f' }, // Medium sage
      { background: '#d4e6a4', border: '#a4b884', accent: '#3a5c1e' }, // Dark sage
      { background: '#f5f9eb', border: '#e2edc4', accent: '#87a96b' }, // Pale green
    ];
    // Using item.id for color assignment for Marketplace items
    return colors[(item.id || item.item_id) % colors.length];
  };

  const cardColor = getCardColor(item.item_id || item.id);
  
  // Format price if it exists (only for Marketplace items)
  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div style={{
      ...styles.card,
      backgroundColor: cardColor.background,
      borderColor: cardColor.border,
    }}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={{
          ...styles.title,
          color: cardColor.accent,
        }}>
          {item.item_name || item.name || item.title} {/* Added item.title for Marketplace */}
        </h3>
        {/* Marketplace Price/Tag */}
        {isMarketplace && item.list_price_cents && (
             <div style={styles.priceTag}>
                <FaTag style={{ fontSize: '10px' }} />
                <span style={{ fontWeight: '700' }}>{formatPrice(item.list_price_cents)}</span>
            </div>
        )}
        {/* Wardrobe Listed Badge */}
        {!isMarketplace && item.lifecycle === 'Sold' && (
          <div style={styles.soldBadge}>
            <FaTag style={styles.soldIcon} />
            Listed
          </div>
        )}
      </div>

      {/* Brand and Category */}
      <div style={styles.brandSection}>
        <span style={styles.brand}>
          {item.brand_name || item.brand || item.seller || 'Unknown Seller'} {/* Added item.seller for Marketplace */}
        </span>
        <div style={styles.category}>
          {getCategoryIcon(item.category_name || item.category)}
          <span>{item.category_name || item.category}</span>
        </div>
      </div>

      {/* Details */}
      <div style={styles.details}>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Size:</span>
          <span style={styles.detailValue}>{item.size_label || item.size || 'N/A'}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Color:</span>
          <span style={styles.detailValue}>{item.color || 'N/A'}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Condition:</span>
          <span style={{
            ...styles.condition,
            color: getConditionColor(item.condition),
          }}>
            {item.condition}
          </span>
        </div>
        {item.material && (
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Material:</span>
            <span style={styles.detailValue}>{item.material}</span>
          </div>
        )}
      </div>

      {/* Actions (Conditional based on isMarketplace) */}
      <div style={styles.actions}>
        {isMarketplace ? (
          // Marketplace Action: Buy Now button
          <Link 
            to="/checkout" 
            // Pass item data to Checkout page state
            state={{ item: item }} 
            style={{
              ...styles.sellButton,
              backgroundColor: cardColor.accent,
              flex: 1, // Full width for Buy button
            }}
          >
            <FaShoppingCart style={styles.buttonIcon} />
            Buy Now
          </Link>
        ) : (
          // Wardrobe Actions: Resell and Remove buttons
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSell(item);
              }}
              style={{
                ...styles.sellButton,
                backgroundColor: cardColor.accent,
              }}
            >
              <FaRecycle style={styles.buttonIcon} />
              Resell
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              style={styles.deleteButton}
            >
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '2px solid',
    padding: '20px',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    className: 'item-card', // Applied for hover effect
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  title: {
    margin: 0,
    fontSize: '1.25em',
    fontWeight: '600',
    lineHeight: '1.3',
    flex: 1,
  },
  priceTag: { // NEW style for marketplace price
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#fffbe5',
    color: '#a16207',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    marginLeft: '8px',
    border: '1px solid #fde047'
  },
  soldBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginLeft: '8px',
  },
  soldIcon: {
    fontSize: '10px',
  },
  brandSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(107, 142, 35, 0.2)',
  },
  brand: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#556b2f',
  },
  category: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#6b8e23',
    fontWeight: '500',
  },
  details: {
    flex: 1,
    marginBottom: '15px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
    fontSize: '13px',
  },
  detailLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    color: '#374151',
    fontWeight: '400',
  },
  condition: {
    fontWeight: '600',
    fontSize: '12px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    textDecoration: 'none', // Important for Link component style
  },
  sellButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 12px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none', // Ensure Link doesn't have underline
    className: 'sell-button', // Applied for hover effect
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    className: 'delete-button', // Applied for hover effect
  },
  buttonIcon: {
    fontSize: '11px',
  },
};

// Add hover effects and class assignments
const cardStyleSheet = document.createElement('style');
cardStyleSheet.innerText = `
  .item-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(34, 51, 17, 0.15);
  }

  .sell-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(107, 142, 35, 0.3);
  }

  .delete-button:hover {
    background-color: #fee2e2;
    transform: translateY(-1px);
  }
`;

document.head.appendChild(cardStyleSheet);


export default ItemCard;