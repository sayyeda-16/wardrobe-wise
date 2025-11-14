// src/components/UsageAnalytics.js
import React, { useState } from 'react';
import { FaCalendarAlt, FaChartBar, FaChartPie, FaFilter } from 'react-icons/fa';

// --- MOCK DATA ---
const MOCK_USAGE_DATA = {
    // Data for a Bar Chart (Usage by Category over 30 days)
    categoryUsage: [
        { name: 'Tops', uses: 22 },
        { name: 'Bottoms', uses: 15 },
        { name: 'Outerwear', uses: 8 },
        { name: 'Dresses', uses: 3 },
        { name: 'Shoes', uses: 18 },
    ],
    // Data for a Pie Chart (Cost Per Wear distribution)
    cpwDistribution: [
        { label: 'Under $1', value: 45, color: '#4CAF50' }, // Green: Efficient
        { label: '$1 - $5', value: 30, color: '#FFEB3B' }, // Yellow: Moderate
        { label: 'Over $5', value: 25, color: '#F44336' }, // Red: Needs more wear
    ],
};

// --- CHART PLACEHOLDER COMPONENT ---
const ChartPlaceholder = ({ title, icon: Icon, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 h-96 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
            <Icon className="mr-2 text-green-500" /> {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex-grow bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-semibold">
            [Chart Visualization Area: Bar or Pie Chart]
        </div>
    </div>
);

// --- MAIN COMPONENT ---
const UsageAnalytics = () => {
    const [timeFilter, setTimeFilter] = useState('30days');

    return (
        <div className="py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2 flex items-center">
                <FaChartBar className="mr-3 text-green-600"/> Usage & Efficiency Analytics
            </h2>
            
            {/* Filter Controls */}
            <div className="flex items-center space-x-4 mb-8 p-4 bg-white rounded-xl shadow-md border">
                <FaFilter className="text-gray-500" />
                <label htmlFor="time-filter" className="font-medium text-gray-700">Filter:</label>
                <select 
                    id="time-filter"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-green-500 transition-colors"
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="year">Past Year</option>
                </select>
                <span className="text-sm text-gray-500 ml-auto flex items-center">
                    <FaCalendarAlt className="mr-1" /> Data window: {timeFilter.toUpperCase()}
                </span>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Chart 1: Usage Frequency */}
                <ChartPlaceholder
                    title={`Item Usage by Category (${timeFilter})`}
                    icon={FaChartBar}
                    description={`Shows the total number of times items from each category were logged as worn in the last ${timeFilter}.`}
                />

                {/* Chart 2: Efficiency (Cost Per Wear) */}
                <ChartPlaceholder
                    title="Cost Per Wear (CPW) Distribution"
                    icon={FaChartPie}
                    description="Distribution of items based on their calculated cost per wear, highlighting highly efficient items."
                />

            </div>
            
            {/* Raw Data List Placeholder (Optional Detail) */}
            <div className="mt-10 p-6 bg-white rounded-xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top 5 Most Worn Items</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    {MOCK_USAGE_DATA.categoryUsage
                        .sort((a, b) => b.uses - a.uses)
                        .slice(0, 5)
                        .map((item, index) => (
                        <li key={index} className="flex justify-between items-center border-b border-gray-100 pb-1">
                            <span>{item.name}</span>
                            <span className="font-semibold text-green-600">{item.uses} times</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default UsageAnalytics;