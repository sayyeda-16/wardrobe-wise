// src/components/ItemFilters.js
import React from 'react';
import { FaFilter, FaTimesCircle } from 'react-icons/fa'; // Added icon for Clear button for better UX

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

  const baseSelectClass = "w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-green-500 focus:ring-green-500 shadow-sm";
  const baseInputClass = "w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:border-green-500 focus:ring-green-500 shadow-sm";

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 shadow-md">
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Category Filter - NOW DYNAMIC (Satisfies part of View 4) */}
        <div className="flex-1 min-w-[120px]">
          <select 
            name="category" 
            value={filters.category || ''} 
            onChange={handleSelectChange}
            className={baseSelectClass}
          >
            <option value="">All Categories</option>
            {defaultOptions.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Lifecycle Filter (Dynamic) */}
        <div className="flex-1 min-w-[120px]">
          <select 
            name="lifecycle" 
            value={filters.lifecycle || ''} 
            onChange={handleSelectChange}
            className={baseSelectClass}
          >
            <option value="">Status (All)</option>
            {defaultOptions.lifecycles.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        {/* Condition Filter - NOW DYNAMIC */}
        <div className="flex-1 min-w-[120px]">
          <select 
            name="condition" 
            value={filters.condition || ''} 
            onChange={handleSelectChange}
            className={baseSelectClass}
          >
            <option value="">All Conditions</option>
            {defaultOptions.conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
          </select>
        </div>

        {/* Brand Filter (Input or Select can use View 4 data) */}
        <div className="flex-1 min-w-[120px]">
          <input
            type="text"
            name="brand"
            value={filters.brand || ''}
            onChange={handleInputChange}
            placeholder="Search Brand (Dynamic)"
            className={baseInputClass}
            // If this were a <select>, it would map defaultOptions.brands (from View 4)
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
          className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 transition duration-150 flex-shrink-0 h-[38px] flex items-center gap-1"
        >
          <FaTimesCircle className="w-4 h-4" /> Clear
        </button>
      </div>
    </div>
  );
}

export default ItemFilters;