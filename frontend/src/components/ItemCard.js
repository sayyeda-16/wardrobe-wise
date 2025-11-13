import React from 'react';
import { FaTag, FaLeaf, FaRecycle, FaSeedling, FaTshirt, FaShoePrints, FaGem } from 'react-icons/fa';

function ItemCard({ item, onSell, onDelete }) {
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
    return colors[itemId % colors.length];
  };

  const cardColor = getCardColor(item.item_id || item.id);

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
          {item.item_name || item.name}
        </h3>
        {item.lifecycle === 'Sold' && (
          <div style={styles.soldBadge}>
            <FaTag style={styles.soldIcon} />
            Listed
          </div>
        )}
      </div>

      {/* Brand and Category */}
      <div style={styles.brandSection}>
        <span style={styles.brand}>
          {item.brand_name || item.brand}
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
          <span style={styles.detailValue}>{item.size_label || item.size}</span>
        </div>
        <div style={styles.detailRow}>
          <span style={styles.detailLabel}>Color:</span>
          <span style={styles.detailValue}>{item.color}</span>
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

      {/* Actions */}
      <div style={styles.actions}>
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
  },
  buttonIcon: {
    fontSize: '11px',
  },
};

// Add hover effects
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

// Apply hover classes
Object.assign(styles.card, {
  className: 'item-card',
});

Object.assign(styles.sellButton, {
  className: 'sell-button',
});

Object.assign(styles.deleteButton, {
  className: 'delete-button',
});

export default ItemCard;