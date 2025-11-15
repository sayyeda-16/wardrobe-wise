// src/components/UsageAnalytics.js
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChartBar, FaChartPie, FaFilter, FaTable, FaUserTag, FaDollarSign } from 'react-icons/fa';
// Assuming Axios or similar for AJAX calls
import axios from 'axios'; 

// --- MOCK DATA for DEMONSTRATION (WILL BE REPLACED BY API CALLS) ---
const MOCK_REPORTS = {
    // Data for v_top_selling_categories (View 9) - Used for Pie Chart
    topCategories: [
        { label: 'Tops', value: 45, color: '#00B894' },
        { label: 'Outerwear', value: 30, color: '#0984E3' },
        { label: 'Bottoms', value: 25, color: '#D63031' },
    ],
    // Data for v_item_sales_history (View 6) - Used for Audit Table
    salesHistory: [
        { id: 'ORD001', item: 'Denim Jacket', seller: 'UserA', buyer: 'UserB', price: 4500, date: '2025-10-20' },
        { id: 'ORD002', item: 'Black Boots', seller: 'UserC', buyer: 'UserA', price: 8000, date: '2025-09-15' },
        { id: 'ORD003', item: 'T-Shirt', seller: 'UserB', buyer: 'UserD', price: 1500, date: '2025-09-01' },
    ],
    // Data for v_retail_and_buyer_users (View 5) - Used for User Report
    targetedUsers: [
        { id: 101, username: 'MarketplaceMatt', retailBuys: 5, mpBuys: 12 },
        { id: 102, username: 'SustainableSam', retailBuys: 2, mpBuys: 8 },
    ],
    // Data for v_active_item_counts (View 2) - Used for Inventory Report
    inventoryReport: [
        { id: 201, username: 'HighVolHolly', activeItems: 180, avgComparison: '+75' },
        { id: 202, username: 'LowUseLiam', activeItems: 45, avgComparison: '-15' },
    ]
};

// --- CHART PLACEHOLDER COMPONENT (FOR VISUALS) ---
const ChartPlaceholder = ({ title, icon: Icon, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 h-96 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Icon className="mr-2 text-green-500" /> {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex-grow bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-semibold">
            {/* Chart Rendering Code (e.g., Chart.js) would go here */}
            [Chart Visualization Area]
        </div>
    </div>
);

// --- TABULAR HTML REPORT COMPONENT (FOR VIEWS 2, 5, 6) ---
const TabularReport = ({ title, data, icon: Icon, description }) => (
    <div className="mt-10 p-6 bg-white rounded-xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Icon className="mr-3 text-red-600" /> {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        {/* Simplified Tabular HTML Format */}
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {/* Dynamic Header Rendering based on 'data' keys */}
                    <tr>
                        {data.length > 0 && Object.keys(data[0]).map(key => (
                            <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, idx) => (
                                <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {typeof value === 'number' && (value > 1000) ? `$${(value / 100).toFixed(2)}` : value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// --- MAIN COMPONENT ---
const UsageAnalytics = () => {
    const [timeFilter, setTimeFilter] = useState('30days');
    const [reportData, setReportData] = useState(MOCK_REPORTS); // Initialize with mock data

    // useEffect hook for fetching data on component mount or filter change
    useEffect(() => {
        // Function to fetch data from the various endpoints
        const fetchAnalyticsData = async () => {
            try {
                // Example API call for View 9: Top Selling Categories
                const topCategoriesResponse = await axios.get('/api/marketplace/top-categories/', { params: { filter: timeFilter } });
                
                // Example API call for View 6: Sales History
                const salesHistoryResponse = await axios.get('/api/marketplace/sales-history/', { params: { filter: timeFilter } });

                // In a real scenario, you'd fetch data for all 4 views here
                // For this example, we rely on MOCK_REPORTS initialized above
                setReportData(prev => ({
                    ...prev,
                    topCategories: topCategoriesResponse.data,
                    salesHistory: salesHistoryResponse.data,
                    // The other reports (V2, V5) would likely not change with 'timeFilter'
                }));

            } catch (error) {
                console.error("Error fetching usage analytics data:", error);
                // Set state to handle error display in UI
            }
        };

        // fetchAnalyticsData(); // Uncomment to enable live data fetching
    }, [timeFilter]); // Rerun fetch when timeFilter changes

    return (
        <div className="py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2 flex items-center">
                <FaChartBar className="mr-3 text-green-600"/> Marketplace & Audit Analytics
            </h2>
            
            {/* Filter Controls for Time-Sensitive Data (Views 6, 9) */}
            <div className="flex items-center space-x-4 mb-8 p-4 bg-white rounded-xl shadow-md border">
                <FaFilter className="text-gray-500" />
                <label htmlFor="time-filter" className="font-medium text-gray-700">Filter Sales Data:</label>
                <select 
                    id="time-filter"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 transition-colors"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="year">Past Year</option>
                </select>
                <span className="text-sm text-gray-500 ml-auto flex items-center">
                    <FaCalendarAlt className="mr-1" /> Data window: {timeFilter.toUpperCase()}
                </span>
            </div>

            {/* SECTION 1: CHARTS (Marketplace & Efficiency Overview) */}
            {/* This section fulfills the proposal's chart requirement and View 9 */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 mt-10">Marketplace & Usage Charts</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* CHART 1: Top Selling Categories (Fulfills View 9) */}
                <ChartPlaceholder
                    title="Top Selling Categories (Marketplace)"
                    icon={FaChartPie}
                    description="Distribution of total items sold on the marketplace, providing selling insights."
                    // Data source: reportData.topCategories (from View 9)
                />

                {/* CHART 2: General Usage Frequency (Fulfills General Proposal Goal) */}
                <ChartPlaceholder
                    title={`Item Usage Frequency (${timeFilter})`}
                    icon={FaChartBar}
                    description="General usage frequency derived from detailed wear logs across all users."
                    // Data source: /api/usage/general-category-use
                />
            </div>

            {/* SECTION 2: TABULAR REPORTS (Fulfills Views 2, 5, 6 - Tabular HTML Format) */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 mt-12">Detailed Audit Reports</h3>
            
            {/* REPORT 1: Item Sales History (Fulfills View 6) */}
            <TabularReport
                title={`Transaction Audit Table (${timeFilter})`}
                icon={FaTable}
                description="Complete history of all item sales and transfers, filtered by the window above."
                data={reportData.salesHistory}
            />
            
            {/* REPORT 2: Retail & Buyer Users (Fulfills View 5) */}
            <TabularReport
                title="Targeted User Cohort Report"
                icon={FaUserTag}
                description="List of users who participate in both retail purchasing and marketplace buying."
                data={reportData.targetedUsers}
            />

            {/* REPORT 3: High Inventory Users (Fulfills View 2) */}
            <TabularReport
                title="Active Inventory Health Report"
                icon={FaDollarSign}
                description="Users whose active item count is significantly above the platform average."
                data={reportData.inventoryReport}
            />
            
        </div>
    );
};

export default UsageAnalytics;