// src/components/SearchFilters.js
import React, { useState } from 'react';

// Assuming an array of categories and a maximum price from the backend context
const MAX_PRICE = 50000; // $500.00 in cents

const SearchFilters = ({ categories = [], currentFilters, onFilterChange }) => {
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

  const handleCategoryChange = (e) => {
    onFilterChange('category', e.target.value);
  };
  
  // Update local state immediately, but debounce applying the filter
  const handlePriceChange = (e) => {
    const newRange = [e.target.value, localPriceRange[1]]; // Simple single-slider (min) example for brevity
    setLocalPriceRange(newRange);
    
    clearTimeout(searchTimer);
    const newTimer = setTimeout(() => {
        onFilterChange('priceRange', newRange);
    }, 500);
    setSearchTimer(newTimer);
  };

  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filter Listings</h3>
      
      {/* Search Bar */}
      <div>
        <label htmlFor="search" className="sr-only">Search Listings</label>
        <input
          type="text"
          id="search"
          placeholder="Search by title or description..."
          onChange={handleSearchChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Category Filter (Dropdown) */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          value={currentFilters.category || ''}
          onChange={handleCategoryChange}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Price Range Slider (Simplified to a min-price slider for brevity) */}
      <div>
        <label htmlFor="price-min" className="block text-sm font-medium text-gray-700">
          Minimum Price: <span className="font-bold">{formatPrice(localPriceRange[0])}</span>
        </label>
        <input
          id="price-min"
          type="range"
          min="0"
          max={MAX_PRICE}
          step="100" // $1.00 step
          value={localPriceRange[0]}
          onChange={handlePriceChange}
          className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatPrice(0)}</span>
            <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>
      
    </div>
  );
};

export default SearchFilters;