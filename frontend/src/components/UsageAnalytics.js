// src/components/UsageAnalytics.js
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChartBar, FaChartPie, FaFilter, FaTable, FaUserTag, FaDollarSign } from 'react-icons/fa';
import api from '../api/axios'; 
import { useAuth } from '../contexts/AuthContext';
import SalesHistoryLineChart from '../components/SalesHistoryLineChart';
import TopCategoriesBarChart from '../components/TopCategoriesBarChart';


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

const ChartContainer = ({ title, icon: Icon, description, data, ChartComponent }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 h-96 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Icon className="mr-2 text-green-500" /> {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex-grow flex items-center justify-center text-gray-400 font-semibold">
            {/* Render the actual chart component here, passing its data */}
            {data && data.length > 0 ? (
                <ChartComponent data={data} />
            ) : (
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex-grow flex items-center justify-center">
                    No data available for this chart.
                </div>
            )}
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
    const { getAuthHeaders } = useAuth();
    const [timeFilter, setTimeFilter] = useState('30days');
    const [reportData, setReportData] = useState({
        topCategories: [],
        salesHistory: [],
        targetedUsers: [],
        inventoryReport: [],
    });

    const [loading, setLoading] = useState(false);

    // useEffect hook for fetching data on component mount or filter change
    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            try {
                const headers = getAuthHeaders();

                // Call all 4 endpoints
                const [
                    topCategoriesRes,
                    salesHistoryRes,
                    userCohortsRes,
                    inventoryRes
                ] = await Promise.all([
                    api.get('/api/marketplace/top-categories/', { headers, params: { filter: timeFilter } }),
                    api.get('/api/marketplace/sales-history/', { headers, params: { filter: timeFilter } }),
                    api.get('/api/reports/user-cohorts/', { headers }),
                    api.get('/api/reports/inventory/', { headers }),
                ]);

                // Update state with real data
                setReportData({
                    topCategories: topCategoriesRes.data,
                    salesHistory: salesHistoryRes.data,
                    targetedUsers: userCohortsRes.data,
                    inventoryReport: inventoryRes.data,
                });

                console.log('Top Categories:', topCategoriesRes.data);
                console.log('Sales History:', salesHistoryRes.data);
                console.log('User Cohorts:', userCohortsRes.data);
                console.log('Inventory:', inventoryRes.data);

            } catch (error) {
                console.error("Error fetching usage analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [timeFilter, getAuthHeaders]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics data...</div>;


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
                <ChartContainer
                    title="Top Selling Categories (Marketplace)"
                    icon={FaChartPie}
                    description="Distribution of total items sold on the marketplace, providing selling insights over the selected period."
                    data={reportData.topCategories} 
                    ChartComponent={TopCategoriesBarChart} // Use the new Bar Chart component
                />

                {/* CHART 2: Sales History (Fulfills View 6) */}
                <ChartContainer
                    title={`Sales Revenue History (${timeFilter})`}
                    icon={FaDollarSign} // Changed icon for sales
                    description="Tracking total revenue from sales over the selected time period."
                    data={reportData.salesHistory} 
                    ChartComponent={SalesHistoryLineChart} // Use the new Line Chart component
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