// src/components/SearchFilters.js
import React, { useState } from 'react';

// Theme colors matching the navbar and wardrobe
const THEME_COLORS = {
  primaryGreen: '#6b8e23',
  secondaryGreen: '#8ea67c',
  lightGreen: '#e8f4d3',
  offWhite: '#f0f7e6',
  darkText: '#3c5a17',
  subtleText: '#556b2f',
};

// NOTE: Categories and Conditions should be dynamically loaded from the API
const MAX_PRICE = 50000; // $500.00 in cents
const HARDCODED_CATEGORIES = [
    { id: 1, name: 'Tops' }, 
    { id: 2, name: 'Bottoms' }, 
    { id: 3, name: 'Outerwear' }, 
    { id: 4, name: 'Footwear' }
];
const CONDITIONS = ['New', 'LikeNew', 'Good', 'Fair', 'Worn'];


const SearchFilters = ({ categories = HARDCODED_CATEGORIES, currentFilters, onFilterChange }) => {
  const [localPriceRange, setLocalPriceRange] = useState(currentFilters.priceRange || [0, MAX_PRICE]);
  const [searchTimer, setSearchTimer] = useState(null);

  // Debounces the search input for real-time filtering
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    clearTimeout(searchTimer);
    
    // Wait 300ms after the user stops typing
    const newTimer = setTimeout(() => {
      onFilterChange('search', searchTerm);
    }, 300);

    setSearchTimer(newTimer);
  };

  const handleSelectChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };
  
  // Update local state immediately, but debounce applying the filter
  const handlePriceChange = (e) => {
    // This maintains the simplified min-price slider logic from the original code
    const newRange = [e.target.value, localPriceRange[1]]; 
    setLocalPriceRange(newRange);
    
    clearTimeout(searchTimer);
    const newTimer = setTimeout(() => {
        onFilterChange('priceRange', newRange);
    }, 500);
    setSearchTimer(newTimer);
  };

  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: THEME_COLORS.offWhite,
      border: `1px solid ${THEME_COLORS.lightGreen}`,
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: THEME_COLORS.darkText,
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: THEME_COLORS.subtleText,
      marginBottom: '8px',
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px',
      border: `2px solid ${THEME_COLORS.secondaryGreen}`,
      backgroundColor: 'white',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    select: {
      marginTop: '4px',
      display: 'block',
      width: '100%',
      padding: '8px 12px',
      border: `2px solid ${THEME_COLORS.secondaryGreen}`,
      backgroundColor: 'white',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    priceLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: THEME_COLORS.subtleText,
      marginBottom: '8px',
    },
    priceValue: {
      color: THEME_COLORS.primaryGreen,
      fontWeight: '700',
    },
    slider: {
      width: '100%',
      height: '6px',
      backgroundColor: THEME_COLORS.secondaryGreen,
      outline: 'none',
      marginTop: '8px',
      marginBottom: '8px',
      WebkitAppearance: 'none',
    },
    sliderThumb: {
      WebkitAppearance: 'none',
      width: '18px',
      height: '18px',
      backgroundColor: THEME_COLORS.primaryGreen,
      borderRadius: '50%',
      cursor: 'pointer',
    },
    priceRange: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: THEME_COLORS.subtleText,
      marginTop: '4px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
    },
    spaceY: {
      '> * + *': {
        marginTop: '15px',
      },
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Filter Sustainable Listings</h3>
      
      <div style={styles.spaceY}>
        {/* Search Bar */}
        <div>
          <label htmlFor="search" style={styles.label}>Search Listings</label>
          <input
            type="text"
            id="search"
            placeholder="Search by title or description..."
            onChange={handleSearchChange}
            style={styles.searchInput}
            onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
            onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
          />
        </div>

        <div style={styles.grid}>
          {/* Category Filter (Dropdown) */}
          <div>
            <label htmlFor="category" style={styles.label}>Category</label>
            <select
              id="category"
              name="category"
              value={currentFilters.category || ''}
              onChange={handleSelectChange}
              style={styles.select}
              onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
              onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <label htmlFor="condition" style={styles.label}>Condition</label>
            <select
              id="condition"
              name="condition"
              value={currentFilters.condition || ''}
              onChange={handleSelectChange}
              style={styles.select}
              onFocus={(e) => e.target.style.borderColor = THEME_COLORS.primaryGreen}
              onBlur={(e) => e.target.style.borderColor = THEME_COLORS.secondaryGreen}
            >
              <option value="">All Conditions</option>
              {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
          </div>
        </div>
        
        {/* Price Range Slider */}
        <div>
          <label htmlFor="price-min" style={styles.priceLabel}>
            Minimum Price: <span style={styles.priceValue}>{formatPrice(localPriceRange[0])}</span>
          </label>
          <input
            id="price-min"
            type="range"
            min="0"
            max={MAX_PRICE}
            step="100"
            value={localPriceRange[0]}
            onChange={handlePriceChange}
            style={styles.slider}
          />
          <div style={styles.priceRange}>
            <span>{formatPrice(0)}</span>
            <span>{formatPrice(MAX_PRICE)}</span>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background-color: ${THEME_COLORS.primaryGreen};
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background-color: ${THEME_COLORS.primaryGreen};
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
        }
        
        input[type="range"]:focus {
          outline: none;
        }
        
        input[type="range"]:focus::-webkit-slider-thumb {
        }
        
        input[type="range"]:focus::-moz-range-thumb {
        }
      `}</style>
    </div>
  );
};

export default SearchFilters;