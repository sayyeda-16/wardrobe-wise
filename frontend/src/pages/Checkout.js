// src/pages/Checkout.js (CLEANED AND FORMATTED CODE)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaSpinner, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// --- CONSTANTS ---
const DEFAULT_MOCK_ITEM = {
    id: '123',
    title: "Sustainable Denim Jeans",
    seller: "Sayyeda Faruqui",
    list_price_cents: 4500, // $45.00
    image_url: 'placeholder_image.jpg',
    condition: "Good"
};

const SHIPPING_FEE_CENTS = 500; // $5.00
const SERVICE_FEE_CENTS = 150;  // $1.50

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATE MANAGEMENT ---
    const [item, setItem] = useState(location.state?.item || DEFAULT_MOCK_ITEM);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        city: '',
        postalCode: '',
    });

    // --- CALCULATIONS & UTILITIES ---
    const subtotal = item.list_price_cents;
    const total = subtotal + SHIPPING_FEE_CENTS + SERVICE_FEE_CENTS;
    
    /** Converts cents to a formatted price string, e.g., 4500 -> "$45.00" */
    const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;
    
    const isFormValid = shippingDetails.name && shippingDetails.address && shippingDetails.city && shippingDetails.postalCode;

    // --- EVENT HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const orderPayload = {
            listing_id: item.id,
            shipping_details: shippingDetails,
            total_cents: total,
            // Payment token/details would be included here after a successful payment client-side hook
        };

        try {
            // 1. API Call to process order (simulated delay for demonstration)
            // const response = await axios.post('/api/orders/create/', orderPayload);
            // const orderId = response.data.order_id;
            
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            const orderId = 'WWD-876543'; 
            
            // 2. On success, navigate to the confirmation page
            navigate('/order-confirmation', { state: { orderId, item } });

        } catch (apiError) {
            console.error("Order processing failed:", apiError);
            setError('Payment processing failed. Please check your card details or try again.');
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER LOGIC ---
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
                <FaLock className="mr-3 text-green-600" />
                Secure Checkout
            </h1>
            
            {/* Error Message */}
            {error && (
                <div className="flex items-center p-4 bg-red-100 text-red-700 rounded-lg mb-6 text-sm border border-red-300">
                    <FaExclamationCircle className="mr-2 flex-shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-3 lg:gap-8">
                
                {/* Shipping and Payment (Left Side) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Shipping Address */}
                    <div className="bg-white p-8 shadow-2xl rounded-xl border border-green-200">
                        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                           <FaMapMarkerAlt className="mr-3 text-green-600"/> 1. Shipping Address
                        </h2>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {Object.keys(shippingDetails).map(key => (
                                <input 
                                    key={key}
                                    type="text" 
                                    name={key} 
                                    placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                    required
                                    disabled={loading}
                                    onChange={handleInputChange} 
                                    value={shippingDetails[key]}
                                    className="block w-full p-3 rounded-xl border-2 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition duration-200" 
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Payment Method */}
                    <div className="bg-white p-8 shadow-2xl rounded-xl border border-green-200">
                        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                            <FaCreditCard className="mr-3 text-green-600"/> 2. Payment Method
                        </h2>
                        <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700 rounded-md">
                            <p className='flex items-center'>
                                <FaCheckCircle className='mr-2'/>
                                Your connection is secure. Using mock payment gateway.
                            </p>
                        </div>
                        {/* Placeholder for card details input */}
                        <div className='mt-6 grid grid-cols-2 gap-4'>
                            <input type="text" placeholder="Card Number (Mock)" disabled={loading}
                                className="col-span-2 block w-full p-3 rounded-xl border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-green-500" />
                            <input type="text" placeholder="Exp Date (MM/YY)" disabled={loading}
                                className="block w-full p-3 rounded-xl border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-green-500" />
                            <input type="text" placeholder="CVC" disabled={loading}
                                className="block w-full p-3 rounded-xl border-2 border-gray-300 bg-gray-50 shadow-sm focus:border-green-500" />
                        </div>
                    </div>
                    
                </div>
                
                {/* Order Summary (Right Side) */}
                <div className="lg:col-span-1 mt-8 lg:mt-0">
                    <div className="sticky top-6 bg-green-50 p-6 rounded-xl shadow-xl border-2 border-green-500">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                        
                        {/* Item Details */}
                        <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-green-300">
                            <div className="w-16 h-16 bg-green-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {item.image_url ? (
                                    // Placeholder for image rendering
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs font-semibold text-green-800">No Image</span>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 line-clamp-2">{item.title}</p>
                                <p className="text-sm text-gray-600">Seller: {item.seller}</p>
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
                        
                        {/* Place Order Button */}
                        <button
                            type="submit"
                            disabled={loading || !isFormValid} 
                            className={`mt-6 w-full py-4 rounded-xl text-white font-bold text-lg transition duration-200 shadow-lg flex items-center justify-center transform hover:-translate-y-0.5 ${
                                (loading || !isFormValid)
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {loading ? (
                                <><FaSpinner className="animate-spin mr-2" /> Processing...</>
                            ) : (
                                `Place Order - ${formatPrice(total)}`
                            )}
                        </button>
                    </div>
                </div>
                
            </form>
        </div>
    );
};

export default Checkout;