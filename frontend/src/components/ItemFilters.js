import React from 'react';

function ItemFilters({ filters, onFilterChange, onClearFilters }) {
  return (
    <div style={styles.container}>
      <div style={styles.filtersRow}>
        <div style={styles.filterItem}>
          <select 
            name="category" 
            value={filters.category} 
            onChange={onFilterChange}
            style={styles.select}
          >
            <option value="">All Categories</option>
            <option value="Tops">Tops</option>
            <option value="Bottoms">Bottoms</option>
            <option value="Dresses">Dresses</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <div style={styles.filterItem}>
          <input
            type="text"
            name="brand"
            value={filters.brand}
            onChange={onFilterChange}
            placeholder="Brand"
            style={styles.input}
          />
        </div>

        <div style={styles.filterItem}>
          <input
            type="text"
            name="color"
            value={filters.color}
            onChange={onFilterChange}
            placeholder="Color"
            style={styles.input}
          />
        </div>

        <div style={styles.filterItem}>
          <select 
            name="condition" 
            value={filters.condition} 
            onChange={onFilterChange}
            style={styles.select}
          >
            <option value="">All Conditions</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>

        <button onClick={onClearFilters} style={styles.clearButton}>
          Clear
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '15px 20px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    marginBottom: '20px',
  },
  filtersRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterItem: {
    flex: '1',
    minWidth: '120px',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    height: '36px',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white',
    height: '36px',
    boxSizing: 'border-box',
  },
  clearButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    height: '36px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
};

export default ItemFilters;