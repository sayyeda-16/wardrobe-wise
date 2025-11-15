// src/pages/AnalyticsPage.js (New File)
import React from 'react';
import WardrobeStats from '../components/WardrobeStats'; // Assuming this is correct path
import UsageAnalytics from '../components/UsageAnalytics'; // Assuming this is correct path

const AnalyticsPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-green-500 pb-2">
                Comprehensive Usage Analytics
            </h1>

            {/* Section 1: Wardrobe Stats (KPIs - View 3) */}
            <section className="mb-10">
                <WardrobeStats /> 
            </section>
            
            {/* Horizontal rule for visual separation of KPI cards and detailed reports */}
            <hr className="my-10 border-gray-300" /> 

            {/* Section 2: Usage Analytics (Detailed Reports & Charts - Views 2, 5, 6, 9, 10) */}
            <section>
                {/* * UsageAnalytics.js will render the tabs/sections for the 
                  * rest of the complex analytical views (2, 5, 6, 9, 10).
                  */}
                <UsageAnalytics /> 
            </section>

        </div>
    );
};

export default AnalyticsPage;