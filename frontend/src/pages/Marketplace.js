// src/pages/Marketplace.js (FINALIZED CODE)
import React, { useState, useEffect, useCallback } from 'react';
import ItemCard from '../components/ItemCard'; 
import SearchFilters from '../components/SearchFilters';
import Sorting from '../components/Sorting';
import api from 'axios';
import { FaSpinner, FaFilter } from 'react-icons/fa';

// Helper to convert condition string to a rank for sorting (1 is best condition)
const CONDITION_RANK = {
    'New': 1, 'LikeNew': 2, 'Good': 3, 'Fair': 4, 'Worn': 5
};
// Assuming MOCK_CATEGORIES are fetched from the API (or hardcoded, but let's keep them here for now)
const CATEGORIES = [
    { id: 1, name: 'Tops' }, 
    { id: 2, name: 'Bottoms' }, 
    { id: 3, name: 'Outerwear' }, 
    { id: 4, name: 'Footwear' },
    // Add all categories relevant to your marketplace
];


function Marketplace() {
    const [listings, setListings] = useState([]); // Used to be commented out, now active
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [currentFilters, setCurrentFilters] = useState({
        search: '',
        category: '',
        condition: '',
        // Price range in cents (max of $500 for initial range)
        priceRange: [0, 50000], 
    });
    const [currentSort, setCurrentSort] = useState({ field: 'listed_on', direction: 'desc' });
    const [filteredAndSortedListings, setFilteredAndSortedListings] = useState([]);

    // --- Data Fetching Logic (Replaces MOCK data) ---
    const fetchListings = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // NOTE: In a real app, API query parameters would handle filtering on the backend
            const response = await api.get('/api/listings/active/');
            setListings(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch marketplace listings:", err);
            setError('Could not load listings. Please try again later.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

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
    // This runs on the client-side using the fetched 'listings' array
    useEffect(() => {
        let results = [...listings];
        
        // 1. Filtering
        // Search filter (Item name/description)
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            results = results.filter(item => 
                item.title.toLowerCase().includes(searchTerm) ||
                (item.description && item.description.toLowerCase().includes(searchTerm))
            );
        }

        // Category filter
        if (currentFilters.category) {
            results = results.filter(item => item.category === currentFilters.category);
        }
        
        // Condition filter
        if (currentFilters.condition) {
            results = results.filter(item => item.condition === currentFilters.condition);
        }
        
        // Price range filter
        const [minPrice, maxPrice] = currentFilters.priceRange;
        results = results.filter(item => 
            item.list_price_cents >= minPrice && item.list_price_cents <= maxPrice
        );
        
        // 2. Sorting
        if (currentSort.field) {
            results.sort((a, b) => {
                let valA, valB;
                
                if (currentSort.field === 'condition_rank') {
                    // Sorting by condition rank (1 is best)
                    valA = CONDITION_RANK[a.condition] || 99;
                    valB = CONDITION_RANK[b.condition] || 99;
                } else {
                    // Default sort for price (list_price_cents) or date (listed_on)
                    valA = a[currentSort.field];
                    valB = b[currentSort.field];
                }

                if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
                if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredAndSortedListings(results);
        
    }, [listings, currentFilters, currentSort]); // Dependencies include 'listings' state

    // --- Render Logic ---
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
                <FaFilter className="inline-block mr-3 text-green-600" />
                Community Marketplace
            </h1>
            
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                {/* Sidebar for Filters and Sorting */}
                <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-4">
                    <Sorting 
                        currentSort={currentSort} 
                        onSortChange={handleSortChange} 
                    />
                    <hr className="border-gray-200"/>
                    <SearchFilters 
                        categories={CATEGORIES} 
                        currentFilters={currentFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Listings Grid */}
                <div className="mt-6 lg:mt-0 lg:col-span-3">
                    {loading ? (
                        <div className="text-center py-20">
                            <FaSpinner className="animate-spin text-5xl text-green-600 mx-auto mb-4" />
                            <p className="text-xl text-gray-700">Loading the hottest listings...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 bg-red-100 text-red-700 p-8 rounded-xl">
                            <p className="text-xl font-semibold">Error Loading Marketplace</p>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredAndSortedListings.length > 0 ? (
                                filteredAndSortedListings.map(item => (
                                    // ItemCard is expected to be a real component
                                    <ItemCard 
                                        key={item.id} 
                                        item={item} 
                                        isMarketplace={true} // Explicitly tell the card it's for the marketplace
                                    /> 
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500 p-12 bg-white rounded-xl shadow-inner">
                                    No items found matching your criteria. Try adjusting your filters!
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Marketplace;