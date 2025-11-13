// src/components/Sorting.js
import React from 'react';

// Assumes 'onSortChange' is passed from the parent (Marketplace.js)
// and it takes an object like { field: 'list_price_cents', direction: 'desc' }
const Sorting = ({ currentSort, onSortChange }) => {
  const handleSortChange = (e) => {
    const [field, direction] = e.target.value.split('-');

    if (field && direction) {
      onSortChange({ field, direction });
    } else {
      // Clear sorting if 'Default' is selected
      onSortChange({}); 
    }
  };

  const currentValue = currentSort.field 
    ? `${currentSort.field}-${currentSort.direction}` 
    : '';

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
        Sort By:
      </label>
      <select
        id="sort-select"
        value={currentValue}
        onChange={handleSortChange}
        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Default</option>
        <option value="list_price_cents-desc">Price: High to Low</option>
        <option value="list_price_cents-asc">Price: Low to High</option>
        <option value="listed_on-desc">Date Listed: Newest</option>
        <option value="listed_on-asc">Date Listed: Oldest</option>
        <option value="condition_rank-asc">Condition: Best First</option>
        {/*
          NOTE: 'condition_rank' is an assumed field for sortable condition.
          In a real-world scenario, the backend would need to convert
          ('New', 'LikeNew', 'Good', 'Fair', 'Worn') to sortable numbers.
          e.g., 1=New, 5=Worn.
        */}
      </select>
    </div>
  );
};

export default Sorting;