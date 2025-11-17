// src/components/ItemFilters.js
import React from 'react';
import { FaFilter, FaTimesCircle } from 'react-icons/fa';

// Theme colors matching the navbar and wardrobe
const THEME_COLORS = {
  primaryGreen: '#6b8e23',
  secondaryGreen: '#8ea67c',
  lightGreen: '#e8f4d3',
  offWhite: '#f0f7e6',
  darkText: '#3c5a17',
  subtleText: '#556b2f',
};

/**
 * ItemFilters Component
 * * * Dynamically loads filter options (categories, brands, conditions, etc.) 
 * from the 'options' prop, which originates from the v_full_brand_category view.
 * * @param {object} props.filters - The current state of the filters.
 * @param {function} props.onFilterChange - Handler to update a specific filter field.
 * @param {function} props.onClearFilters - Handler to reset all filters.
 * @param {object} props.options - Dynamic lists for dropdowns (brands, categories, conditions, lifecycles).
 */
function ItemFilters({ filters, onFilterChange, onClearFilters, options }) {
  // Default empty options to prevent errors if data isn't loaded yet
  const defaultOptions = { 
    brands: [], 
    categories: [], 
    conditions: [], 
    lifecycles: [], 
    ...(options || {}) 
  };

  const handleSelectChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };
  
  const handleInputChange = (e) => {
    // Both select and text inputs can use the same change handler in this case
    onFilterChange(e.target.name, e.target.value);
  };

  const styles = {
    container: {
      backgroundColor: THEME_COLORS.offWhite,
      padding: '20px',
      border: `1px solid ${THEME_COLORS.lightGreen}`,
      marginBottom: '20px',
    },
    flexContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '15px',
    },
    filterItem: {
      flex: '1',
      minWidth: '120px',
    },
    select: {
      width: '100%',
      padding: '8px 12px',
      border: `2px solid ${THEME_COLORS.secondaryGreen}`,
      backgroundColor: 'white',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: `2px solid ${THEME_COLORS.secondaryGreen}`,
      backgroundColor: 'white',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    clearButton: {
      padding: '8px 16px',
      backgroundColor: THEME_COLORS.primaryGreen,
      color: 'white',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.3s ease',
      flexShrink: 0,
      height: '38px',
    },
    clearButtonHover: {
      backgroundColor: THEME_COLORS.darkText,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.flexContainer}>
        
        {/* Category Filter - NOW DYNAMIC */}
        <div style={styles.filterItem}>
          <select 
            name="category" 
            value={filters.category || ''} 
            onChange={handleSelectChange}
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
            onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
          >
            <option value="">All Categories</option>
            {defaultOptions.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Lifecycle Filter (Dynamic) */}
        <div style={styles.filterItem}>
          <select 
            name="lifecycle" 
            value={filters.lifecycle || ''} 
            onChange={handleSelectChange}
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
            onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
          >
            <option value="">Status (All)</option>
            {defaultOptions.lifecycles.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        {/* Condition Filter - NOW DYNAMIC */}
        <div style={styles.filterItem}>
          <select 
            name="condition" 
            value={filters.condition || ''} 
            onChange={handleSelectChange}
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
            onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
          >
            <option value="">All Conditions</option>
            {defaultOptions.conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
          </select>
        </div>

        {/* Brand Filter */}
        <div style={styles.filterItem}>
          <input
            type="text"
            name="brand"
            value={filters.brand || ''}
            onChange={handleInputChange}
            placeholder="Search Brand"
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
            onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
          />
        </div>

        {/* Color Filter */}
        <div style={styles.filterItem}>
          <input
            type="text"
            name="color"
            value={filters.color || ''}
            onChange={handleInputChange}
            placeholder="Search Color"
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
            onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
          />
        </div>
        
        {/* Clear Button */}
        <button 
          onClick={onClearFilters} 
          style={styles.clearButton}
          onMouseOver={(e) => e.target.style.backgroundColor = THEME_COLORS.darkText}
          onMouseOut={(e) => e.target.style.backgroundColor = THEME_COLORS.primaryGreen}
        >
          <FaTimesCircle style={{ width: '16px', height: '16px' }} /> Clear
        </button>
      </div>
    </div>
  );
}

export default ItemFilters;