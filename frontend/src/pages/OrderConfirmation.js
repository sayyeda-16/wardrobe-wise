// src/pages/OrderConfirmation.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, item } = location.state || {}; // Destructure state passed from Checkout

  // Fallback if accessed directly without state
  if (!orderId || !item) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-red-600">Order Not Found</h1>
        <p className="mt-4 text-gray-600">It looks like you accessed this page directly. Please return to the marketplace.</p>
        <Link to="/marketplace" className="mt-6 inline-block text-green-600 hover:text-green-800 font-semibold">
          Go to Marketplace
        </Link>
      </div>
    );
  }
  
  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl border-4 border-green-500 text-center">
        
        <div className="text-6xl text-green-500 mb-4">
            <span role="img" aria-label="Checkmark">✅</span>
        </div>
        
        <h1 className="text-4xl font-extrabold text-green-700 mb-2">Order Confirmed!</h1>
        <p className="text-xl text-gray-600 mb-8">Thank you for your sustainable purchase.</p>
        
        {/* Order Details and Tracking */}
        <div className="text-left border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-700">
                <p className="font-semibold">Order ID:</p>
                <p className="font-mono text-right text-lg text-green-800">{orderId}</p>

                <p className="font-semibold">Item Purchased:</p>
                <p className="text-right">{item.title}</p>
                
                <p className="font-semibold">Seller:</p>
                <p className="text-right">{item.seller}</p>

                <p className="font-semibold">Current Status:</p>
                <p className="text-right text-yellow-600 font-bold">Processing Shipment</p>
                
                <p className="font-semibold">Estimated Delivery:</p>
                <p className="text-right">5-7 Business Days</p>
            </div>
        </div>
        
        {/* Next Steps */}
        <div className="mt-10 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What's Next?</h2>
            <div className="space-y-3">
                <Link to="/marketplace" className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Continue Shopping
                </Link>
                <Link to="/user-profile" className="w-full inline-flex justify-center py-3 px-4 border border-green-600 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    View My Orders (Tracking)
                </Link>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default OrderConfirmation;