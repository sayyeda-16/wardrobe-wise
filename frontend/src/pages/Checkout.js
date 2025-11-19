// src/pages/ContactSellerSummary.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLock, FaMapMarkerAlt, FaUserCircle, FaEnvelope, FaShoppingCart } from 'react-icons/fa';


// --- CONSTANTS ---
const DEFAULT_MOCK_ITEM = {
    id: '123',
    title: "Red Turtleneck Sweater",
    list_price_cents: 3000, // $30.00
    image_url: 'placeholder_image.jpg',
    condition: "Good",
    // s-- CHANGED: 'seller' is now an object to hold dynamic info
    seller: {
        name: "Mock Seller Name",
        email: "mock.seller@example.com"
    }
};


// <-- REMOVED: This hardcoded object is no longer needed.
// const MOCK_SELLER_INFO = { ... }


const SHIPPING_FEE_CENTS = 500; // $5.00
const SERVICE_FEE_CENTS = 150;  // $1.50


const ContactSellerSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();


    // --- STATE MANAGEMENT ---
    const [item] = useState(location.state?.item || DEFAULT_MOCK_ITEM);
   
    // --- CALCULATIONS & UTILITIES ---
    const subtotal = item.list_price_cents;
    const total = subtotal + SHIPPING_FEE_CENTS + SERVICE_FEE_CENTS;
   
    const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;
   
    // --- EVENT HANDLERS ---
    const handleBackToMarketplace = () => {
        navigate('/marketplace');
    };
    // --- RENDER LOGIC ---
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
                <FaLock className="mr-3 text-green-600" />
                Order Summary & Seller Contact
            </h1>
           
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
               
                {/* Seller Contact Info (Replaces Shipping/Payment) */}
                <div className="lg:col-span-2 space-y-8">
                   
                    {/* Seller Information */}
                    <div className="bg-white p-8 shadow-2xl rounded-xl border-2 border-green-500">
                        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                           <FaUserCircle className="mr-3 text-green-600"/> 1. Contact the Seller
                        </h2>
                       
                       <div className="p-5 bg-green-50 rounded-lg space-y-3">
    <p className="font-semibold text-lg text-gray-800">
        Please contact the seller directly to arrange payment and delivery/pickup.
    </p>


    <div className="flex items-center text-gray-700">
        <FaMapMarkerAlt className="mr-3 text-green-600 flex-shrink-0" />
        <span className="font-semibold mr-2">Seller Name:</span>
        <span>{item.seller_name || 'Seller Not Found'}</span>
    </div>


    <div className="flex items-center text-gray-700">
        <FaEnvelope className="mr-3 text-green-600 flex-shrink-0" />
        <span className="font-semibold mr-2">Seller Email:</span>
        <span>{item.seller_email || 'No Email Provided'}</span>
    </div>
</div>


                        <div className='mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md'>
                            <p className='font-medium'>
                                **NOTE:** Payment is handled **off-platform** between you and the seller. WardrobeWise is not responsible for the transaction.
                            </p>
                        </div>
                    </div>
                   
                    {/* Placeholder for "Next Steps" or removed payment section */}
                    <div className="bg-white p-8 shadow-xl rounded-xl border border-gray-200">
                         <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <FaShoppingCart className="mr-3 text-gray-500"/> Item Details Summary
                        </h2>
                        <p className='text-gray-600 mt-2'>This is what you are ordering for the total price listed on the right.</p>
                    </div>
                   
                </div>
               
                {/* Order Summary (Right Side - UNCHANGED) */}
                <div className="lg:col-span-1 mt-8 lg:mt-0">
    <div className="sticky top-6 bg-green-50 p-6 rounded-xl shadow-xl border-2 border-green-500">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
       
        {/* Item Details */}
        <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-green-300">
            <div className="w-16 h-16 bg-green-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                    <span className="text-xs font-semibold text-green-800">No Image</span>
                ) : (
                    <span className="text-xs font-semibold text-green-800">No Image</span>
                )}
            </div>
            <div>
                <p className="font-semibold text-gray-900 line-clamp-2">{item.title}</p>
                <p className="text-sm text-gray-600">Seller: {item.seller_name || 'N/A'}</p>
            </div>
        </div>
       
        {/* Price Breakdown */}
        <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
                <span className='text-sm'>Item Price:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
                <span className='text-sm'>Shipping Fee:</span>
                <span className="font-medium">{formatPrice(SHIPPING_FEE_CENTS)}</span>
            </div>
            <div className="flex justify-between">
                <span className='text-sm'>Service Fee:</span>
                <span className="font-medium">{formatPrice(SERVICE_FEE_CENTS)}</span>
            </div>
        </div>
       
        <div className="border-t border-green-300 pt-4 mt-4 flex justify-between items-center text-2xl font-bold text-green-700">
            <span>Order Total:</span>
            <span>{formatPrice(total)}</span>
        </div>
       
        {/* Back to Marketplace Button */}
        <button
            type="button"
            onClick={handleBackToMarketplace}
            className={`mt-6 w-full py-4 rounded-xl text-white font-bold text-lg transition duration-200 shadow-lg flex items-center justify-center transform hover:-translate-y-0.5 bg-green-600 hover:bg-green-700`}
        >
            Back to Marketplace
        </button>
    </div>
</div>
            </div>
        </div>
    );
};


export default ContactSellerSummary;

