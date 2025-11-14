// src/components/ItemFilters.js
import React from 'react';

// NOTE: Categories and Conditions are temporarily hardcoded, as per current implementation, 
// but should be dynamically loaded in a future refactor.
const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories', 'Jewelry'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Worn'];
const LIFECYCLE_STATUSES = ['Active', 'Listed', 'Sold', 'Donated', 'Discarded'];

function ItemFilters({ filters, onFilterChange, onClearFilters }) {
  const handleSelectChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };
  
  const handleInputChange = (e) => {
    onFilterChange(e.target.name, e.target.value);
  };

  const baseSelectClass = "w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm";
  const baseInputClass = "w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500 shadow-sm";

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-md font-semibold text-gray-800 mb-3">Wardrobe Filters</h3>
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Category Filter */}
        <div className="flex-1 min-w-[120px]">
          <select 
            name="category" 
            value={filters.category || ''} 
            onChange={handleSelectChange}
            className={baseSelectClass}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Lifecycle Filter (NEW: Crucial for Wardrobe Management) */}
        <div className="flex-1 min-w-[120px]">
          <select 
            name="lifecycle" 
            value={filters.lifecycle || ''} 
            onChange={handleSelectChange}
            className={baseSelectClass}
          >
            <option value="">Status (All)</option>
            {LIFECYCLE_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        {/* Condition Filter */}
        <div className="flex-1 min-w-[120px]">
          <select 
            name="condition" 
            value={filters.condition || ''} 
            onChange={handleSelectChange}
            className={baseSelectClass}
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
          </select>
        </div>

        {/* Brand Filter */}
        <div className="flex-1 min-w-[120px]">
          <input
            type="text"
            name="brand"
            value={filters.brand || ''}
            onChange={handleInputChange}
            placeholder="Search Brand"
            className={baseInputClass}
          />
        </div>

        {/* Color Filter */}
        <div className="flex-1 min-w-[120px]">
          <input
            type="text"
            name="color"
            value={filters.color || ''}
            onChange={handleInputChange}
            placeholder="Search Color"
            className={baseInputClass}
          />
        </div>
        
        {/* Clear Button */}
        <button 
          onClick={onClearFilters} 
          className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 flex-shrink-0 h-[38px]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default ItemFilters;