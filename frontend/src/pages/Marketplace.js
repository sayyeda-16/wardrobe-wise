// src/pages/Marketplace.js
import React, { useState, useEffect, useCallback } from 'react';
import ItemCard from '../components/ItemCard'; // Assuming ItemCard exists
import SearchFilters from '../components/SearchFilters';
import Sorting from '../components/Sorting';

// --- MOCK DATA FOR DEMONSTRATION (Replace with API calls later) ---
const MOCK_LISTINGS = [
    { id: 1, title: "Levi's 501 Jeans", description: "Barely worn jeans in perfect condition", list_price_cents: 5000, listed_on: '2025-10-10', condition: 'LikeNew', category: 'Bottoms', image: '' }, // Corrected: added '
    { id: 2, title: "Warm Winter Coat", description: "Brown coat, great for cold days", list_price_cents: 6500, listed_on: '2025-10-20', condition: 'Good', category: 'Outerwear', image: '' },
    { id: 3, title: "White Cotton Blouse", description: "Classic cotton blouse", list_price_cents: 2600, listed_on: '2025-10-22', condition: 'Good', category: 'Tops', image: '' },
    { id: 4, title: "Nike Air Max Shoes", description: "Clean and comfy", list_price_cents: 7800, listed_on: '2025-10-23', condition: 'Good', category: 'Footwear', image: '' }, // Corrected: added '
    { id: 5, title: "Black Graphic Tee", description: "Casual tee, lightly used", list_price_cents: 2200, listed_on: '2025-10-25', condition: 'Good', category: 'Tops', image: '' },
    { id: 6, title: "Grey Running Shorts", description: "Breathable, like new", list_price_cents: 3500, listed_on: '2025-10-28', condition: 'LikeNew', category: 'Bottoms', image: '' },
];

const MOCK_CATEGORIES = [
    { id: 1, name: 'Tops' }, 
    { id: 2, name: 'Bottoms' }, 
    { id: 3, name: 'Outerwear' }, 
    { id: 4, name: 'Footwear' }
];

// Helper to convert condition string to a rank for sorting (1 is best condition)
const CONDITION_RANK = {
  'New': 1, 'LikeNew': 2, 'Good': 3, 'Fair': 4, 'Worn': 5
};
// --- END MOCK DATA ---


function Marketplace() {
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [currentFilters, setCurrentFilters] = useState({
    search: '',
    category: '',
    priceRange: [0, 50000], // Default max price is $500.00
  });
  const [currentSort, setCurrentSort] = useState({});
  const [filteredAndSortedListings, setFilteredAndSortedListings] = useState([]);


  // Central handler for all filter changes
  const handleFilterChange = useCallback((field, value) => {
    setCurrentFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Central handler for sort changes
  const handleSortChange = useCallback((sort) => {
    setCurrentSort(sort);
  }, []);
  
  // --- CORE FILTERING & SORTING LOGIC ---
  useEffect(() => {
    let results = [...listings];
    
    // 1. Filtering
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }

    if (currentFilters.category) {
      results = results.filter(item => item.category === currentFilters.category);
    }
    
    if (currentFilters.priceRange) {
        const [minPrice, maxPrice] = currentFilters.priceRange;
        results = results.filter(item => 
            item.list_price_cents >= minPrice && item.list_price_cents <= maxPrice
        );
    }
    
    // 2. Sorting
    if (currentSort.field) {
      results.sort((a, b) => {
        let valA, valB;
        
        if (currentSort.field === 'condition_rank') {
            // Sorting by condition rank (1 is best)
            valA = CONDITION_RANK[a.condition] || 99;
            valB = CONDITION_RANK[b.condition] || 99;
        } else {
            // Default sort for price or date
            valA = a[currentSort.field];
            valB = b[currentSort.field];
        }

        if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredAndSortedListings(results);
    
  }, [listings, currentFilters, currentSort]);


  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        🛍️ Community Marketplace
      </h1>
      
      <div className="lg:grid lg:grid-cols-4 lg:gap-6">
        {/* Sidebar for Filters and Sorting */}
        <div className="lg:col-span-1 space-y-4">
          <Sorting 
            currentSort={currentSort} 
            onSortChange={handleSortChange} 
          />
          <SearchFilters 
            categories={MOCK_CATEGORIES} 
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Listings Grid */}
        <div className="mt-6 lg:mt-0 lg:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedListings.length > 0 ? (
                filteredAndSortedListings.map(item => (
                  // ItemCard needs to be a real component that accepts 'item' prop
                  <ItemCard key={item.id} item={item} /> 
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 p-8">
                    No items found matching your criteria. Try adjusting your filters!
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;