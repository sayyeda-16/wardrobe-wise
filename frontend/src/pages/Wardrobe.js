import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaLeaf, FaPlus, FaRecycle, FaSeedling, FaFilter, FaSpinner, FaTshirt, FaThermometerHalf, FaCalendarAlt } from 'react-icons/fa';
import ItemCard from '../components/ItemCard';
import ItemFilters from '../components/ItemFilters';
import ItemDetails from '../components/ItemDetails';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import ResellModal from '../components/ResellModal';

// --- Theme & Data Constants ---
const THEME_COLORS = {
    primaryGreen: '#6b8e23', // Olive Green (Darker text, main CTA)
    secondaryGreen: '#8ea67c', // Muted Sage (Button backgrounds, accents)
    lightGreen: '#e8f4d3', // Very Light Green (Backgrounds, hover effects)
    offWhite: '#f0f7e6', // Near White (Content backgrounds)
    darkText: '#3c5a17', // Darker text for high contrast
    subtleText: '#556b2f', // Medium text for subtitles/details
};

const LIFECYCLE_OPTIONS = ['Active', 'Listed', 'Sold', 'Donated'];

// --- Helper Components ---

const StatBox = ({ icon: Icon, value, label }) => (
    <div className="flex items-center gap-4">
        <Icon className="text-3xl" style={{ color: THEME_COLORS.lightGreen }} />
        <div>
            <div className="text-3xl font-extrabold text-white">{value}</div>
            <div className="text-xs uppercase tracking-wider" style={{ color: THEME_COLORS.lightGreen }}>
                {label}
            </div>
        </div>
    </div>
);

// C.8: Item Condition Breakdown
const ConditionBreakdown = ({ data }) => {
    const conditionColors = {
        'New': '#34D399', 'LikeNew': '#60A5FA', 'Good': '#FBBF24', // Adjusted Excellent to LikeNew
        'Worn': '#F87171', 'Fair': '#9CA3AF',
    };

    const totalItems = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div 
            className="bg-white p-6 rounded-lg shadow-md border" 
            style={{ borderColor: THEME_COLORS.lightGreen, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}
        >
            <h3 
                className="text-xl font-bold mb-5 flex items-center pb-2 border-b-2"
                style={{ color: THEME_COLORS.darkText, borderColor: THEME_COLORS.lightGreen }}
            >
                <FaThermometerHalf className="mr-3" /> Wardrobe Condition Summary
            </h3>
            {totalItems > 0 ? (
                <div className="flex flex-col gap-3">
                    {data.map((item, index) => {
                        const percentage = ((item.count / totalItems) * 100).toFixed(1);
                        return (
                            <div key={item.condition || index} className="flex justify-between items-center py-2 border-b border-dotted" style={{ borderColor: THEME_COLORS.offWhite }}>
                                <div 
                                    className="text-xs font-semibold text-white px-3 py-1 rounded-full min-w-[100px] text-center" 
                                    style={{ backgroundColor: conditionColors[item.condition] || '#94A3B8' }}
                                >
                                    {item.condition}
                                </div>
                                <span className="font-medium" style={{ color: THEME_COLORS.primaryGreen }}>{item.count} items</span>
                                <span className="font-bold" style={{ color: THEME_COLORS.darkText }}>{percentage}%</span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center p-5 italic" style={{ color: THEME_COLORS.subtleText }}>
                    Track more items to see a condition breakdown.
                </p>
            )}
        </div>
    );
};

// C.10: Seasonal Wardrobe Suggestions
const SeasonalSuggestions = ({ items, onAction }) => (
    <div 
        className="bg-white p-6 rounded-lg shadow-md border-l-4" 
        style={{ borderColor: THEME_COLORS.lightGreen, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', borderLeftColor: THEME_COLORS.primaryGreen }}
    >
        <h3 
            className="text-xl font-bold mb-5 flex items-center pb-2 border-b-2"
            style={{ color: THEME_COLORS.darkText, borderColor: THEME_COLORS.lightGreen }}
        >
            <FaCalendarAlt className="mr-3" /> Seasonal Focus Items ({new Date().toLocaleDateString('en-US', {month: 'long'})})
        </h3>
        {items.length > 0 ? (
            <div className="flex flex-col gap-4">
                {items.slice(0, 3).map(item => ( 
                    <div key={item.item_id} className="flex justify-between items-center p-3 rounded-md border-l-4" style={{ backgroundColor: THEME_COLORS.offWhite, borderColor: THEME_COLORS.secondaryGreen }}>
                        <div className="flex-1 mr-4">
                            <div className="font-semibold text-sm" style={{ color: THEME_COLORS.darkText }}>{item.item_name}</div>
                            <div className="text-xs mt-1" style={{ color: THEME_COLORS.subtleText }}>
                                <span className="font-bold">**{item.brand}**</span> - {item.condition}
                            </div>
                        </div>
                        <button 
                            onClick={() => onAction(item)} 
                            className="px-4 py-2 text-xs font-semibold text-white rounded-md transition duration-200 seasonal-button"
                            style={{ backgroundColor: THEME_COLORS.primaryGreen }}
                        >
                            Log Wear/View
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center p-5 italic" style={{ color: THEME_COLORS.subtleText }}>
                No items currently recommended for this season.
            </p>
        )}
    </div>
);

// --- Main Component ---
function Wardrobe() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        color: '',
        condition: '',
        lifecycle: '',
    });
    const [selectedItem, setSelectedItem] = useState(null);
    const [showItemDetails, setShowItemDetails] = useState(false);
    
    // New states for C.8 & C.10 (Local Branch)
    const [conditionSummary, setConditionSummary] = useState([]);
    const [seasonalItems, setSeasonalItems] = useState([]);
    // New state for Resell Modal (Incoming Branch)
    const [showResellForm, setShowResellForm] = useState(false);


    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            // 1. Fetch Core Items
            const response = await api.get('/api/items/wardrobe/'); 
            const mappedData = response.data.map(item => ({
                ...item,
                seller_type: item.purchase_info?.seller_type,
                price_cents: item.purchase_info?.price_cents,
                purchase_date: item.purchase_info?.purchase_date,
                // Merged fields for robust brand/category string access
                brand: item.brand || item.brand_name || 'Unknown Brand',
                category: item.category || item.category_name || 'Unknown Category',
            }));
            setItems(mappedData);

            // 2. Fetch Condition Summary (C.8 - from Local)
            const conditionRes = await api.get('/api/wardrobe/condition-summary/');
            setConditionSummary(conditionRes.data);

            // 3. Fetch Seasonal Suggestions (C.10 - from Local)
            const seasonalRes = await api.get('/api/wardrobe/seasonal-suggestions/');
            setSeasonalItems(seasonalRes.data);

            setError(''); 
        } catch (apiError) {
            console.error('Error fetching items or wardrobe summaries:', apiError.message);
            
            setItems([]); 
            setConditionSummary([]);
            setSeasonalItems([]);

            setError('Using sustainable fashion demo data (API not available or error during fetch)');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchItems();
        }
    }, [fetchItems, user]);

    // Filter options logic (Unchanged)
    const filterOptions = useMemo(() => {
        const allBrands = new Set();
        const allCategories = new Set();
        const allColors = new Set();
        const allConditions = new Set();

        items.forEach(item => {
            if (item.brand) allBrands.add(item.brand);
            if (item.category) allCategories.add(item.category);
            if (item.color) allColors.add(item.color);
            if (item.condition) allConditions.add(item.condition);
        });

        return {
            brands: Array.from(allBrands).sort(),
            categories: Array.from(allCategories).sort(),
            colors: Array.from(allColors).sort(),
            conditions: Array.from(allConditions).sort(),
            lifecycles: LIFECYCLE_OPTIONS,
        };
    }, [items]);

    // Filtering logic (Unchanged)
    useEffect(() => {
        const filtered = items.filter(item => {
            const { category, brand, color, condition, lifecycle } = filters;
            
            const itemBrand = item.brand || '';
            const itemCategory = item.category || '';
            const itemColor = item.color || '';
            const itemCondition = item.condition || '';
            const itemLifecycle = item.lifecycle || '';

            return (
                (category === '' || itemCategory === category) &&
                (brand === '' || itemBrand.toLowerCase().includes(brand.toLowerCase())) &&
                (color === '' || itemColor.toLowerCase().includes(color.toLowerCase())) &&
                (condition === '' || itemCondition === condition) &&
                (lifecycle === '' || itemLifecycle === lifecycle)
            );
        });
        setFilteredItems(filtered);
    }, [filters, items]);

    // Seasonal Item Action Handler (C.10)
    const handleSeasonalItemAction = (item) => {
        alert(`Navigating to details for ${item.item_name}. A wear log would be recorded here.`);
        handleViewDetails(item);
    };


    // Handlers (Simplified and using API calls)
    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleClearFilters = () => {
        // Combined the lifecycle filter initialization
        setFilters({
            category: '', brand: '', color: '', condition: '', lifecycle: '',
        });
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setShowItemDetails(true);
    };

    const handleCloseDetails = () => {
        setShowItemDetails(false);
        setSelectedItem(null);
    };

    const handlePromptResell = (item) => {
        // 1. Close the ItemDetails modal if it's open
        handleCloseDetails(); 
        // 2. Set the item and open the new Resell form
        setSelectedItem(item);
        setShowResellForm(true); 
    };

    const handleCloseResellForm = () => {
        setShowResellForm(false);
        setSelectedItem(null);
    };

    const handleSellItem = async (item, listPrice, descriptionText) => { // Merged arguments
        const list_price_cents = Math.round(parseFloat(listPrice) * 100); 

        try {
            await api.post('/api/listings/', {
                item_id: item.item_id,
                list_price_cents: list_price_cents,
                title: item.item_name, // Use item name as default title
                description: descriptionText || `Listing for pre-loved ${item.item_name}.`,
            });
            
            // 1. Alert user and refresh list
            alert(`Item "${item.item_name}" successfully listed for $${listPrice}!`);
            fetchItems(); 
            
            // 2. Close the resell form
            setShowResellForm(false);
            setSelectedItem(null);

        } catch (error) {
            console.error('Error listing item:', error.response?.data || error.message);
            alert('Failed to list item. Please check the console for details.');
            setShowResellForm(false);
            setSelectedItem(null);
        }
    };

    const handleDeleteItem = async (item) => {
        if (!window.confirm(`Consider re-purposing ${item.item_name || item.name} instead of deleting?`)) return;

        try {
            await api.delete(`/api/items/${item.item_id}/`);
            alert('Item successfully removed from wardrobe.');
            fetchItems(); 
            handleCloseDetails();
        } catch (error) {
            console.error('Error deleting item:', error.response?.data || error.message);
            alert('Failed to remove item. Please check the console for details.');
            handleCloseDetails();
        }
    };

    const handleEditItem = (item) => {
        navigate(`/edit-item/${item.item_id}`);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen" style={{ color: THEME_COLORS.primaryGreen }}>
                <FaSpinner className="text-5xl mb-5 animate-spin-slow" />
                <div className="text-lg" style={{ color: THEME_COLORS.subtleText }}>Loading your sustainable wardrobe...</div>
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen p-5"
            style={{ background: `linear-gradient(135deg, ${THEME_COLORS.offWhite} 0%, ${THEME_COLORS.lightGreen} 100%)` }}
        >
            {/* Hero Bar Section */}
            <div 
                className="relative pt-12 px-10 pb-0 mb-8 rounded-xl overflow-hidden shadow-2xl" 
                style={{ backgroundColor: THEME_COLORS.primaryGreen, boxShadow: '0 10px 40px rgba(34, 51, 17, 0.4)' }}
            >
                <div className="absolute inset-0 z-10 opacity-80 bg-cover bg-center bg-blend-multiply" 
                    style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://img.freepik.com/premium-photo/xaa-sustainable-fashion-concept-banner_958297-9941.jpg?semt=ais_incoming&w=740&q=80")`, backgroundPosition: 'center 70%' }}
                ></div>
                
                <div className="flex justify-between items-start mb-12 relative z-20 text-white">
                    <div className="flex-1">
                        <div className="flex items-center mb-4">
                            <FaLeaf className="text-3xl mr-3" style={{ color: THEME_COLORS.lightGreen }} />
                            <span className="text-3xl font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>WardrobeWise</span>
                        </div>
                        <h1 className="text-5xl font-extrabold leading-tight m-0 mb-3">My Sustainable Wardrobe</h1>
                        <p className="text-lg m-0" style={{ color: THEME_COLORS.lightGreen }}>
                            Welcome back, {user?.username || 'user'}! Manage your eco-friendly fashion collection.
                        </p>
                    </div>

                    <button 
                        onClick={() => navigate('/add-item')} 
                        className="px-5 py-3 mt-3 text-sm font-bold rounded-md flex items-center gap-2 transition duration-300 add-button shadow-lg"
                        style={{ backgroundColor: THEME_COLORS.lightGreen, color: THEME_COLORS.darkText }}
                    >
                        <FaPlus className="text-base" />
                        Add Sustainable Item
                    </button>
                </div>
            
                <div 
                    className="flex justify-between gap-5 px-10 py-6 relative z-20 mx-[-40px] border-t"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                    <StatBox icon={FaTshirt} value={items.length} label="Total Pieces" />
                    <StatBox icon={FaRecycle} value={items.filter(item => item.lifecycle === 'Sold').length} label="Items Resold" />
                    <StatBox icon={FaSeedling} value={filterOptions.brands.length} label="Eco Brands Tracked" />
                </div>
            </div>
            {/* End Hero Bar Section */}

            {/* C.8 & C.10 Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <ConditionBreakdown data={conditionSummary} />
                <SeasonalSuggestions items={seasonalItems} onAction={handleSeasonalItemAction} />
            </div>
            {/* End Analytics Section */}

            {/* Error Message */}
            {error && (
                <div 
                    className="flex items-center p-4 mb-5 text-sm rounded-md border"
                    style={{ backgroundColor: THEME_COLORS.offWhite, color: THEME_COLORS.darkText, borderColor: THEME_COLORS.secondaryGreen }}
                >
                    <span className="mr-3 text-lg">🌱</span>
                    {error}
                </div>
            )}

            {/* Filters Section */}
            <div 
                className="bg-white p-5 mb-8 shadow-xl border"
                style={{ borderColor: THEME_COLORS.lightGreen, boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)' }}
            >
                <div className="flex items-center gap-3 mb-4 font-semibold" style={{ color: THEME_COLORS.subtleText }}>
                    <FaFilter className="text-base" />
                    <span className="text-base">Filter Sustainable Items</span>
                </div>
                <ItemFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    options={filterOptions}
                />
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
                <div 
                    className="text-center p-20 bg-white shadow-lg border-2 border-dashed"
                    style={{ borderColor: THEME_COLORS.secondaryGreen }}
                >
                    <div className="text-8xl mb-8">👕</div>
                    <h3 className="text-3xl font-semibold mb-4" style={{ color: THEME_COLORS.subtleText }}>
                        {items.length === 0 ? "Your sustainable wardrobe awaits" : "No eco-items match your filters"}
                    </h3>
                    <p className="text-lg mb-8 max-w-md mx-auto leading-relaxed" style={{ color: THEME_COLORS.primaryGreen }}>
                        {items.length === 0  
                            ? "Start your sustainable fashion journey by adding your first eco-friendly item!" 
                            : "Try adjusting your filters to discover more sustainable pieces."
                        }
                    </p>
                    {items.length === 0 && (
                        <button 
                            onClick={() => navigate('/add-item')} 
                            className="px-8 py-4 text-lg font-semibold text-white rounded-md flex items-center justify-center gap-2 transition duration-300 cta-button"
                            style={{ backgroundColor: THEME_COLORS.primaryGreen }}
                        >
                            <FaPlus className="text-sm" />
                            Begin Sustainable Collection
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <div className="text-base font-medium" style={{ color: THEME_COLORS.subtleText }}>
                            Showing {filteredItems.length} of {items.length} sustainable item{items.length !== 1 ? 's' : ''}
                        </div>
                        <div 
                            className="text-sm font-medium p-2 rounded" 
                            style={{ color: THEME_COLORS.primaryGreen, backgroundColor: THEME_COLORS.offWhite }}
                        >
                            ♻️ Reducing fashion waste through circular fashion
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <div 
                                key={item.item_id || item.id} 
                                onClick={() => handleViewDetails(item)} 
                                className="cursor-pointer transition duration-200 item-wrapper"
                            >
                                <ItemCard 
                                    item={item} 
                                    onSell={handlePromptResell} // Passed directly
                                    onDelete={handleDeleteItem} // Passed directly
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Item Details Modal */}
            <ItemDetails
                item={selectedItem}
                isOpen={showItemDetails}
                onClose={handleCloseDetails}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onSell={handlePromptResell}
            />
            {/* Resell Modal (New/Merged Component) */}
            <ResellModal
                item={selectedItem}
                isOpen={showResellForm} 
                onClose={handleCloseResellForm} 
                onList={handleSellItem}
            />
        </div>
    );
}

// --- CSS Animations for Hover/Loading Effects ---
// The styles object and all related code blocks are REMOVED. 
// Only the <style> element remains, containing the keyframes and hover classes.
const styleSheet = document.createElement('style');
styleSheet.innerText = `
    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
        animation: spin-slow 2s linear infinite;
    }
    
    .add-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(107, 142, 35, 0.3);
        background-color: white !important;
    }

    .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(107, 142, 35, 0.5);
        background-color: ${THEME_COLORS.darkText} !important;
    }

    .item-wrapper:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 30px rgba(34, 51, 17, 0.15);
    }

    .seasonal-button:hover {
        background-color: ${THEME_COLORS.darkText} !important;
    }
`;
document.head.appendChild(styleSheet);


export default Wardrobe;