import React from 'react';

function ItemDetails({ item, isOpen, onClose, onEdit, onDelete, onSell }) {
  if (!isOpen || !item) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{item.item_name || item.name}</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <strong>Brand:</strong> {item.brand_name || item.brand}
            </div>
            <div style={styles.detailItem}>
              <strong>Category:</strong> {item.category_name || item.category}
            </div>
            <div style={styles.detailItem}>
              <strong>Size:</strong> {item.size_label || item.size}
            </div>
            <div style={styles.detailItem}>
              <strong>Color:</strong> {item.color}
            </div>
            <div style={styles.detailItem}>
              <strong>Condition:</strong> {item.condition}
            </div>
            {item.material && (
              <div style={styles.detailItem}>
                <strong>Material:</strong> {item.material}
              </div>
            )}
            {item.season_hint && (
              <div style={styles.detailItem}>
                <strong>Season:</strong> {item.season_hint}
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button onClick={() => onSell(item)} style={styles.sellButton}>
              Sell Item
            </button>
            <button onClick={() => onEdit(item)} style={styles.editButton}>
              Edit
            </button>
            <button onClick={() => onDelete(item)} style={styles.deleteButton}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e9ecef',
  },
  title: {
    margin: 0,
    color: '#2d3748',
    fontSize: '1.5em',
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '0',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: '20px',
  },
  detailsGrid: {
    display: 'grid',
    gap: '12px',
    marginBottom: '20px',
  },
  detailItem: {
    padding: '8px 0',
    borderBottom: '1px solid #f7fafc',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    borderTop: '1px solid #e9ecef',
    paddingTop: '20px',
  },
  sellButton: {
    padding: '10px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  editButton: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  deleteButton: {
    padding: '10px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default ItemDetails;