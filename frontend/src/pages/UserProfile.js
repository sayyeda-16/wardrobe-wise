// src/pages/UserProfile.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaEnvelope, FaTag, FaShoppingBag, FaChartLine, FaCog, FaLeaf, FaRecycle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// --- MOCK DATA FOR DEMONSTRATION ---
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
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [purchaseSummary, setPurchaseSummary] = useState([]);
    const [summaryLoading, setSummaryLoading] = useState(true);

    const profile = user || {
        username: 'Eco-User',
        email: 'user@wardrobewise.com',
        joined_date: '2024-01-01',
        bio: 'Committed to circular fashion and tracking my CPW.',
    };
    // console.log("PROFILE DATA:", profile); // Debugging

    const [userStats, setUserStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [listings, setListings] = useState([]);

    const [brandSummary, setBrandSummary] = useState([]);
    const [brandSummaryLoading, setBrandSummaryLoading] = useState(true);

    // 🟢 FETCHING LOGIC
    const fetchPurchaseSummary = useCallback(async () => {
        setSummaryLoading(true);
        try {
            const response = await api.get('/api/purchases/summary/source/');
            setPurchaseSummary(response.data);
        } catch (error) {
            console.error('Error fetching purchase summary:', error);
            setPurchaseSummary([]);
        } finally {
            setSummaryLoading(false);
        }
    }, []);

    const fetchBrandSummary = useCallback(async () => {
        setBrandSummaryLoading(true);
        try {
            const response = await api.get('/api/purchases/summary/brand/');
            setBrandSummary(response.data);
        } catch (error) {
            console.error('Error fetching brand summary:', error);
            setBrandSummary([]);
        } finally {
        setBrandSummaryLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch Stats
                const statsRes = await api.get('/api/profile/stats/');
                setUserStats(statsRes.data);

                // Fetch Orders
                const ordersRes = await api.get('/api/profile/orders/');
                const mappedOrders = ordersRes.data.map(o => ({
                    id: o.listing_id,
                    item: o.item_name,
                    date: o.sold_on,
                    total: o.sale_price_cents,
                    status: 'Delivered',
                }));
                setOrders(mappedOrders);

                // Fetch Listings
                const listingsRes = await api.get('/api/profile/listings/');
                const mappedListings = listingsRes.data.map(l => ({
                    id: l.listing_id,
                    item: l.item_name,
                    price: l.list_price_cents,
                    status: l.status === 'Active' ? 'Listed' : l.status,
                }));
                setListings(mappedListings);

            } catch (error) {
                console.error("API fetch error in UserProfile:", error);
            }
        };

        if (user) {
            fetchUserData();
            fetchPurchaseSummary();
            fetchBrandSummary(); 
        }
    }, [user, fetchPurchaseSummary, fetchBrandSummary]);


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
    
    //  PURCHASE SUMMARY TAB COMPONENT
    const PurchaseSummaryTab = () => {
        const summary = purchaseSummary;
        const loading = summaryLoading;

        const containerClasses = "p-5 border border-gray-200 rounded-lg shadow-md bg-white";
        const titleClasses = "text-xl font-semibold text-green-800 mb-4";
        const tableClasses = "w-full border-collapse";
        const headerClasses = "bg-green-50 font-bold text-left p-3 border-b-2 border-green-800 text-green-700";
        const cellClasses = "p-3 border-b border-gray-200";

        if (loading) {
            return (
                <div className={containerClasses}>
                    <div className={titleClasses}>🛍️ Purchase Acquisition Summary</div>
                    <div className="italic text-gray-500 p-3">
                        Loading purchase source analysis...
                    </div>
                </div>
            );
        }

        if (summary.length === 0) {
            return (
                <div className={containerClasses}>
                    <div className={titleClasses}>🛍️ Purchase Acquisition Summary</div>
                    <p className="text-gray-600">No purchase data available to summarize.</p>
                </div>
            );
        }

        return (
            <div className={containerClasses}>
                <div className={titleClasses}>🛍️ Purchase Acquisition Summary</div>
                <table className={tableClasses}>
                    <thead>
                        <tr>
                            <th className={headerClasses}>Source</th>
                            <th className={headerClasses}>Items Count</th>
                            <th className={headerClasses}>Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                <td className={cellClasses}>
                                    <strong className="font-medium text-green-800">
                                        {item.source}
                                    </strong>
                                </td>
                                <td className={cellClasses}>{item.item_count}</td>
                                <td className={cellClasses}>
                                    {formatCurrency(item.total_spent_dollars * 100)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const BrandSummaryCard = () => {
        const summary = brandSummary;
        const loading = brandSummaryLoading;

        const containerClasses =
            "mt-5 p-5 border border-gray-200 rounded-lg shadow-md bg-white";
        const titleClasses =
            "text-xl font-semibold text-purple-800 mb-4";
        const tableClasses = "w-full border-collapse";
        const headerClasses =
            "bg-purple-50 font-bold text-left p-3 border-b-2 border-purple-800 text-purple-700";
        const cellClasses = "p-3 border-b border-gray-200";

        if (loading) {
            return (
                <div className={containerClasses}>
                    <div className={titleClasses}>💎 Spending by Brand</div>
                    <div className="italic text-slate-500 p-4">
                        Loading brand expenditure analysis...
                    </div>
                </div>
            );
        }

        if (summary.length === 0) {
            return (
                <div className={containerClasses}>
                    <div className={titleClasses}>💎 Spending by Brand</div>
                    <p>No purchase data with brand information available.</p>
                </div>
            );
        }

        return (
            <div className={containerClasses}>
                <div className={titleClasses}>💎 Spending by Brand</div>
                <table className={tableClasses}>
                    <thead>
                        <tr>
                            <th className={headerClasses}>Brand</th>
                            <th className={headerClasses}>Items Count</th>
                            <th className={headerClasses}>Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summary.map((item, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 transition duration-150 ease-in-out"
                            >
                                <td className={cellClasses}>
                                    <strong className="font-medium text-purple-800">
                                        {item.brand_name}
                                    </strong>
                                </td>
                                <td className={cellClasses}>{item.item_count}</td>
                                <td className={cellClasses}>
                                    {formatCurrency(item.total_spent_dollars * 100)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

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
                    value={formatCurrency((userStats?.avg_cpw ?? 0) * 100)}
                    color="#F59E0B"
                />
            </div>

            {/* Purchase Summary and Quick Access */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                <PurchaseSummaryTab /> 
                <div className="space-y-6">
                    <OrdersList tabTitle="Recent Orders" list={orders.slice(0, 3)} />
                    <ListingsList tabTitle="Active Listings" list={listings.filter(l => l.status === 'Listed').slice(0, 3)} />
                </div>
                <BrandSummaryCard />
            </div>
        </div>
    );
    // ------------------------------------

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