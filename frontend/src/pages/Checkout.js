// src/pages/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for the item being checked out
const MOCK_CHECKOUT_ITEM = {
  id: 123,
  title: "Sustainable Denim Jeans",
  seller: "Sayyeda Faruqui",
  list_price_cents: 4500, // $45.00
  image: "",
  condition: "Good"
};

const SHIPPING_FEE_CENTS = 500; // $5.00
const SERVICE_FEE_CENTS = 150;  // $1.50

const Checkout = () => {
  const navigate = useNavigate();
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const subtotal = MOCK_CHECKOUT_ITEM.list_price_cents;
  const total = subtotal + SHIPPING_FEE_CENTS + SERVICE_FEE_CENTS;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app:
    // 1. Validate form data
    // 2. Call backend API to create a Sale/Order
    // 3. Handle payment processing (Stripe, etc.)
    
    console.log("Processing order for:", MOCK_CHECKOUT_ITEM.title);
    
    // On success, navigate to the confirmation page
    navigate('/order-confirmation', { state: { orderId: 'WWD-876543', item: MOCK_CHECKOUT_ITEM } });
  };
  
  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>
      
      <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-3 lg:gap-8">
        
        {/* Shipping and Payment (Left Side) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Address */}
          <div className="bg-white p-6 shadow-lg rounded-lg border border-green-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Shipping Address</h2>
            
            {/* Input fields for shipping details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input type="text" name="name" placeholder="Full Name" required
                onChange={handleInputChange} value={shippingDetails.name}
                className="block w-full rounded-md border-gray-300 shadow-sm" />
              <input type="text" name="address" placeholder="Street Address" required
                onChange={handleInputChange} value={shippingDetails.address}
                className="block w-full rounded-md border-gray-300 shadow-sm" />
              <input type="text" name="city" placeholder="City" required
                onChange={handleInputChange} value={shippingDetails.city}
                className="block w-full rounded-md border-gray-300 shadow-sm" />
              <input type="text" name="postalCode" placeholder="Postal Code" required
                onChange={handleInputChange} value={shippingDetails.postalCode}
                className="block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white p-6 shadow-lg rounded-lg border border-green-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Payment Method</h2>
            <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
                <p>Payment integration (e.g., Stripe, PayPal) goes here. Using mock payment.</p>
            </div>
            {/* Placeholder for card details input */}
            <input type="text" placeholder="Card Number (Mock)" disabled
                className="mt-4 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm" />
          </div>
          
        </div>
        
        {/* Order Summary (Right Side) */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <div className="sticky top-6 bg-green-50 p-6 rounded-lg shadow-xl border-2 border-green-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            {/* Item Details */}
            <div className="flex items-center space-x-4 mb-4 pb-4 border-b">
                {/* Item Image Placeholder */}
                <div className="w-16 h-16 bg-green-200 rounded-md flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-800">Item</span>
                </div>
                <div>
                    <p className="font-semibold text-gray-900">{MOCK_CHECKOUT_ITEM.title}</p>
                    <p className="text-sm text-gray-600">Seller: {MOCK_CHECKOUT_ITEM.seller}</p>
                </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Item Price:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-medium">{formatPrice(SHIPPING_FEE_CENTS)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee:</span>
                <span className="font-medium">{formatPrice(SERVICE_FEE_CENTS)}</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4 flex justify-between items-center text-xl font-bold text-green-700">
              <span>Order Total:</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            {/* Place Order Button */}
            <button
              type="submit"
              disabled={!shippingDetails.name} // Disable until name is entered
              className={`mt-6 w-full py-3 rounded-md text-white font-semibold transition duration-150 ${
                shippingDetails.name 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-green-400 cursor-not-allowed'
              }`}
            >
              Place Order - {formatPrice(total)}
            </button>
          </div>
        </div>
        
      </form>
    </div>
  );
};

export default Checkout;