// src/pages/OrderConfirmation.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

// Constants for fees (Must match Checkout.js)
const SHIPPING_FEE_CENTS = 500; // $5.00
const SERVICE_FEE_CENTS = 150;  // $1.50

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Attempt to retrieve state passed from Checkout
    const { orderId, item } = location.state || {};

    // Redirect logic if state is missing (e.g., user navigated directly)
    if (!orderId || !item) {
        // If data is missing, redirect user to the homepage or a safe starting point
        return (
            <div className="max-w-xl mx-auto py-12 px-4 text-center">
                <h1 className="text-3xl font-extrabold text-red-600 mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-6">It looks like you landed here without a valid order ID. Please start your transaction again.</p>
                <button 
                    onClick={() => navigate('/')} 
                    className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Go to Homepage
                </button>
            </div>
        );
    }
    
    // --- Calculations & Utilities ---
    const subtotal = item.list_price_cents;
    const total = subtotal + SHIPPING_FEE_CENTS + SERVICE_FEE_CENTS;
    const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
            
            {/* Confirmation Banner */}
            <div className="text-center p-8 bg-green-50 border-4 border-green-300 rounded-xl shadow-lg mb-10">
                <FaCheckCircle className="mx-auto text-green-600 w-16 h-16 mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-xl text-green-700 font-semibold">Thank you for your sustainable purchase.</p>
                <p className="mt-4 text-gray-600">Your order number is: <span className="font-mono font-bold text-gray-800 bg-green-100 p-1 rounded">{orderId}</span></p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaShoppingBag className="mr-2 text-green-600"/> Order Summary
            </h2>
            
            {/* Item Details Card */}
            <div className="bg-gray-50 p-6 border border-gray-200 rounded-xl mb-8">
                <div className="flex justify-between items-start pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                         <div className="w-16 h-16 bg-green-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {item.image_url ? (
                                <img 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover" 
                                /> 
                            ) : (
                                <span className="text-xs font-semibold text-green-800">No Image</span>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500">From: {item.seller}</p>
                            <p className="text-xs text-gray-500">Condition: {item.condition}</p>
                        </div>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
                </div>

                {/* Price Breakdown */}
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping Fee:</span>
                        <span>{formatPrice(SHIPPING_FEE_CENTS)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Service Fee:</span>
                        <span>{formatPrice(SERVICE_FEE_CENTS)}</span>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4 flex justify-between items-center text-xl font-bold text-green-700">
                    <span>Final Total:</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            {/* Next Steps */}
            <div className='flex justify-between pt-4'>
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center text-green-600 hover:text-green-800 font-medium transition duration-150"
                >
                    <FaArrowLeft className="mr-2"/> Continue Shopping
                </button>
                <button 
                    // In a real app, this would link to /profile/orders
                    onClick={() => console.log('Viewing Order History...')} 
                    className="py-3 px-6 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition duration-150"
                >
                    View Order Details
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;