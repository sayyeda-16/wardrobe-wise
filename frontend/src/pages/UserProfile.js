// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaEnvelope, FaTag, FaShoppingBag, FaChartLine, FaCog, FaLeaf, FaRecycle } from 'react-icons/fa'; // <<< FIXED: Added FaRecycle
import { Link } from 'react-router-dom';
import api from '../api/axios';


const statsRes = await api.get('/api/profile/stats/');

// --- MOCK DATA FOR DEMONSTRATION ---
const MOCK_USER_STATS = {
    total_items: 12,
    items_resold: 3,
    avg_csw: 15.50, // Average Cost Per Wear (CPW), using CSW for 'Sustainable Wear'
};

const MOCK_ORDERS = [
    { id: 'WWD-001', item: 'Sustainable Denim Jeans', date: '2025-10-25', status: 'Shipped', total: 5150 },
    { id: 'WWD-002', item: 'Organic Cotton T-Shirt', date: '2025-11-01', status: 'Delivered', total: 3200 },
];

const MOCK_LISTINGS = [
    { id: 'L-55', item: 'Eco-Friendly Jacket', status: 'Listed', price: 8000 },
    { id: 'L-56', item: 'Vintage Wool Scarf', status: 'Sold', price: 2500 },
];
// --- END MOCK DATA ---

const formatCurrency = (cents) => `$${(cents / 100).toFixed(2)}`;

function UserProfile() {
    // Assuming useAuth provides a 'user' object with profile data
    const { user } = useAuth(); 
    const [activeTab, setActiveTab] = useState('dashboard');
    const profile = user || {
        username: 'Eco-User',
        email: 'user@wardrobewise.com',
        joined_date: '2024-01-01',
        bio: 'Committed to circular fashion and tracking my CPW.',
    };
    console.log("PROFILE DATA:", profile);

    
    const [userStats, setUserStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching stats...");
                const statsRes = await api.get('/api/profile/stats/');
                console.log("Stats response:", statsRes.data);
                setUserStats(statsRes.data);

                console.log("Fetching orders...");
                const ordersRes = await api.get('/api/profile/orders/');
                console.log("Orders response:", ordersRes.data);
                const mappedOrders = ordersRes.data.map(o => ({
                    id: o.listing_id,
                    item: o.item_name,
                    date: o.sold_on,
                    total: o.sale_price_cents,
                    status: 'Delivered', // or map real status if available
                }));
                console.log("Mapped orders:", mappedOrders);
                setOrders(mappedOrders);

                console.log("Fetching listings...");
                const listingsRes = await api.get('/api/profile/listings/');
                console.log("Listings response:", listingsRes.data);
                const mappedListings = listingsRes.data.map(l => ({
                    id: l.listing_id,
                    item: l.item_name,
                    price: l.list_price_cents,
                    status: l.status === 'Active' ? 'Listed' : l.status,
                }));
                console.log("Mapped listings:", mappedListings);
                setListings(mappedListings);

            } catch (error) {
                if (error.response) {
                    // Server responded with a status code outside 2xx
                    console.error("API response error:", error.response.status, error.response.data);
                } else if (error.request) {
                    // Request was made but no response received
                    console.error("No response received:", error.request);
                } else {
                    // Something else happened
                    console.error("Error setting up request:", error.message);
                }
            }
        };

        fetchUserData();
    }, []);



    // Helper component for stat cards
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

    // --- Tab Content Components ---

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
                    value={formatCurrency((userStats?.avg_cpw ?? 0) * 100)}  // Displaying CPW as cents converted to currency
                    color="#F59E0B" 
                />
            </div>
            
            {/* Quick Access to Orders & Listings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <OrdersList tabTitle="Recent Orders" list={orders} />
                <ListingsList tabTitle="Active Listings" list={listings.filter(l => l.status === 'Listed')} />
            </div>
        </div>
    );

    const OrdersList = ({ tabTitle = "Order History", list = MOCK_ORDERS }) => (
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
            {tabTitle !== "Recent Orders" && (
                <Link to="#" className="mt-4 block w-full text-center text-green-600 hover:text-green-700 text-sm font-medium">
                    Load More Orders
                </Link>
            )}
        </div>
    );

    const ListingsList = ({ tabTitle = "My Listings", list = MOCK_LISTINGS }) => (
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

    // --- Main Component Render ---
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