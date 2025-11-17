// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
// <<< ADDED: FaChartPie, FaChartBar for the new visualizations
import { FaUserCircle, FaEnvelope, FaTag, FaShoppingBag, FaChartLine, FaCog, FaLeaf, FaRecycle, FaChartPie, FaChartBar, FaGlobe } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
import api from '../api/axios';


// --- UTILITY FUNCTIONS ---
const formatCurrency = (cents) => `$${(cents / 100).toFixed(2)}`;

// Helper component for C.3: Purchase Source Breakdown
const PurchaseSourceBreakdown = ({ data }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaGlobe className="text-blue-500" /> Purchase Source Summary</h2>
        {data.length > 0 ? (
            <ul className="space-y-3">
                {data.map((item, index) => (
                    <li key={item.source || index} className="flex justify-between items-center text-sm border-b pb-2">
                        <span className="text-gray-600 font-medium">{item.source}</span>
                        <span className="font-bold text-indigo-600">{item.count} items</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-center text-gray-500 py-4">No purchase source data recorded yet.</p>
        )}
    </div>
);

// Helper component for C.4: Brand Purchase Breakdown
const BrandPurchaseBreakdown = ({ data }) => {
    // Show only the top 5 brands
    const topBrands = data.slice(0, 5); 
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaTag className="text-purple-500" /> Top Purchased Brands</h2>
            {topBrands.length > 0 ? (
                <ul className="space-y-3">
                    {topBrands.map((item, index) => (
                        <li key={item.brand_name || index} className="flex justify-between items-center text-sm border-b pb-2">
                            <span className="font-medium text-gray-700">
                                {index + 1}. **{item.brand_name}** ({item.count} items)
                            </span>
                            <span className="font-bold text-green-600">
                                {formatCurrency(item.total_spent)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-4">No brand purchase data recorded yet.</p>
            )}
        </div>
    );
};


function UserProfile() {
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState('dashboard');
    const profile = user || {
        username: 'Eco-User',
        email: 'user@wardrobewise.com',
        joined_date: '2024-01-01',
        bio: 'Committed to circular fashion and tracking my CPW.',
    };

    // <<< NEW STATES FOR VIEWS C.3 & C.4 >>>
    const [userStats, setUserStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [listings, setListings] = useState([]);
    const [purchaseSummary, setPurchaseSummary] = useState([]); // C.3
    const [brandSummary, setBrandSummary] = useState([]);       // C.4


    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            try {
                // 1. Fetch Core Stats (C.1/C.6 component)
                const statsRes = await api.get('/api/profile/stats/');
                setUserStats(statsRes.data);

                // 2. Fetch Orders (C.6 raw data)
                const ordersRes = await api.get('/api/profile/orders/');
                const mappedOrders = ordersRes.data.map(o => ({
                    id: o.listing_id,
                    item: o.item_name,
                    date: o.sold_on,
                    total: o.sale_price_cents,
                    status: 'Delivered', 
                }));
                setOrders(mappedOrders);

                // 3. Fetch Listings (C.6 raw data)
                const listingsRes = await api.get('/api/profile/listings/');
                const mappedListings = listingsRes.data.map(l => ({
                    id: l.listing_id,
                    item: l.item_name,
                    price: l.list_price_cents,
                    status: l.status === 'Active' ? 'Listed' : l.status,
                }));
                setListings(mappedListings);

                // 4. Fetch Purchase Source Summary (C.3) <<< NEW FETCH >>>
                const summaryRes = await api.get('/api/profile/purchase-summary/');
                setPurchaseSummary(summaryRes.data);

                // 5. Fetch Brand Purchase Summary (C.4) <<< NEW FETCH >>>
                const brandRes = await api.get('/api/profile/brand-summary/');
                setBrandSummary(brandRes.data);


            } catch (error) {
                console.error("Error fetching user data:", error.response || error.message);
                // Optionally set mock data or an error state here
            }

        };
        fetchUserData(); 
    }, [user]);


    // Helper component for stat cards (No change)
    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4" style={{ borderColor: color }}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <Icon className={`text-4xl opacity-50`} style={{ color }} />
            </div>
        </div>
    );

    // --- Dashboard Tab Content (Modified to include C.3 and C.4) ---
    const DashboardTab = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><FaChartLine /> Sustainability Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={FaTag} 
                    title="Total Items" 
                    value={userStats?.total_items ?? 0} 
                    color="#4F46E5" 
                />
                <StatCard 
                    icon={FaRecycle} 
                    title="Items Resold/Donated" 
                    value={userStats?.items_resold ?? 0} 
                    color="#10B981" 
                />
                <StatCard 
                    icon={FaLeaf} 
                    title="Avg. Cost/Item (CPI)" 
                    // avg_cpw is already in dollars, multiply by 100 for formatCurrency helper
                    value={formatCurrency((userStats?.avg_cpw ?? 0) * 100)} 
                    color="#F59E0B" 
                />
            </div>

            {/* <<< NEW ANALYTICS SECTION FOR C.3 & C.4 >>> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <PurchaseSourceBreakdown data={purchaseSummary} /> {/* C.3 */}
                <BrandPurchaseBreakdown data={brandSummary} />      {/* C.4 */}
            </div>
            {/* <<< END NEW ANALYTICS SECTION >>> */}
            
            {/* Quick Access to Orders & Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <OrdersList tabTitle="Recent Orders" list={orders} />
                <ListingsList tabTitle="Active Listings" list={listings.filter(l => l.status === 'Listed')} />
            </div>
        </div>
    );

    // OrdersList and ListingsList components (No functional change)
    const OrdersList = ({ tabTitle = "Order History", list = [] }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaShoppingBag /> {tabTitle}</h2>
            <ul className="divide-y divide-gray-100">
                {list.length > 0 ? list.map((order) => (
                    <li key={order.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium text-gray-700">{order.item}</p>
                            <p className="text-xs text-gray-500">Order ID: {order.id} | {order.date}</p>
                        </div>
                        <div className="text-right">
                            <span className="font-semibold text-green-600">{formatCurrency(order.total)}</span>
                            <p className={`text-xs font-medium mt-1 ${order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'}`}>{order.status}</p>
                        </div>
                    </li>
                )) : (
                    <p className="text-center text-gray-500 py-4">No orders found.</p>
                )}
            </ul>
        </div>
    );

    const ListingsList = ({ tabTitle = "My Listings", list = [] }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><FaTag /> {tabTitle}</h2>
            <ul className="divide-y divide-gray-100">
                {list.length > 0 ? list.map((listing) => (
                    <li key={listing.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                            <p className="font-medium text-gray-700">{listing.item}</p>
                            <p className="text-xs text-gray-500">Listing ID: {listing.id}</p>
                        </div>
                        <div className="text-right">
                            <span className="font-semibold text-green-600">{formatCurrency(listing.price)}</span>
                            <p className={`text-xs font-medium mt-1 ${listing.status === 'Sold' ? 'text-red-500' : 'text-blue-500'}`}>{listing.status}</p>
                        </div>
                    </li>
                )) : (
                    <p className="text-center text-gray-500 py-4">No active listings.</p>
                )}
            </ul>
        </div>
    );

    // --- Main Component Render (No change) ---
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="bg-white shadow-lg rounded-xl p-8 mb-8 border-t-8 border-green-500">
                <div className="flex items-center space-x-6">
                    <FaUserCircle className="text-6xl text-gray-400 flex-shrink-0" />
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">{profile.username}</h1>
                        <p className="text-lg text-gray-600 flex items-center gap-2 mt-1"><FaEnvelope className="text-sm" /> {profile.email}</p>
                        <p className="text-sm text-gray-500 mt-2 italic">Joined: {new Date(profile.date_joined).toLocaleString("en-US", {year: "numeric",month: "long",day: "numeric"})}</p>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                        { name: 'Dashboard', key: 'dashboard', icon: FaChartLine },
                        { name: 'Orders', key: 'orders', icon: FaShoppingBag },
                        { name: 'Listings/Sales', key: 'listings', icon: FaTag },
                        { name: 'Settings', key: 'settings', icon: FaCog, link: '/settings' },
                    ].map((tab) => {
                        const TabIcon = tab.icon;
                        const isCurrent = activeTab === tab.key;
                        
                        if (tab.link) {
                            return (
                                <Link
                                    key={tab.key}
                                    to={tab.link}
                                    className="flex items-center gap-2 py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    <TabIcon />{tab.name}
                                </Link>
                            );
                        }
                        
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 py-4 px-1 text-sm font-medium transition duration-150 ease-in-out ${
                                    isCurrent
                                        ? 'border-b-2 border-green-500 text-green-600 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                                aria-current={isCurrent ? 'page' : undefined}
                            >
                                <TabIcon />{tab.name}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'orders' && <OrdersList tabTitle="All Order History" list={orders} />}
                {activeTab === 'listings' && <ListingsList tabTitle="All Sales & Listings" list={listings} />}
            </div>
        </div>
    );
}

export default UserProfile;