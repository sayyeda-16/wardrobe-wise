// src/components/WardrobeStats.js
import React from 'react';
import { FaTshirt, FaDollarSign, FaChartLine, FaTag, FaGem, FaArrowUp } from 'react-icons/fa';

// --- MOCK DATA ---
const MOCK_STATS = [
    {
        id: 1,
        label: "Total Items",
        value: 124,
        unit: "items",
        icon: FaTshirt,
        color: 'blue'
    },
    {
        id: 2,
        label: "Total Value (Est.)",
        value: 4890,
        unit: "$",
        icon: FaDollarSign,
        color: 'green'
    },
    {
        id: 3,
        label: "Average Cost Per Wear",
        value: 1.85,
        unit: "$",
        icon: FaChartLine,
        color: 'red' // Highlighting a key sustainability metric
    },
    {
        id: 4,
        label: "Most Used Category",
        value: "Outerwear",
        unit: "",
        icon: FaArrowUp,
        color: 'indigo'
    },
    {
        id: 5,
        label: "Oldest Item",
        value: "Denim Jacket (2018)",
        unit: "",
        icon: FaTag,
        color: 'yellow'
    },
    {
        id: 6,
        label: "Investment Pieces (> $200)",
        value: 8,
        unit: "items",
        icon: FaGem,
        color: 'pink'
    },
];

// --- STAT CARD COMPONENT ---
const StatCard = ({ label, value, unit, icon: Icon, color }) => {
    // Dynamically assign Tailwind classes based on the 'color' prop
    const colors = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-400' },
        green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-400' },
        red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-400' },
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-400' },
        yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-400' },
        pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-400' },
    };

    const style = colors[color] || colors.blue; // Default to blue

    return (
        <div className={`p-6 rounded-xl shadow-lg border-b-4 ${style.border} ${style.bg}`}>
            <div className="flex items-center justify-between">
                <Icon className={`w-8 h-8 ${style.text}`} />
                <p className="text-sm font-medium text-gray-500">{label}</p>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-extrabold text-gray-900 truncate">
                    {unit}{value}
                </p>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const WardrobeStats = () => {
    return (
        <div className="py-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2 flex items-center">
                <FaChartLine className="mr-3 text-green-600"/> Wardrobe Health Overview
            </h2>
            
            <p className="text-gray-600 mb-8">
                Key metrics illustrating the size, value, and usage efficiency of your collection.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {MOCK_STATS.map(stat => (
                    <StatCard 
                        key={stat.id}
                        label={stat.label}
                        value={stat.value}
                        unit={stat.unit}
                        icon={stat.icon}
                        color={stat.color}
                    />
                ))}
            </div>
        </div>
    );
};

export default WardrobeStats;