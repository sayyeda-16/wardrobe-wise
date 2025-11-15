// src/pages/ItemDetail.js (UPDATED CODE)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingCart, FaSpinner, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Default user object to prevent crashes if user is null during initial render
  const { user } = useAuth() || { user: {} }; 
  
  const [item, setItem] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  // Helper function to format price from cents to dollars
  const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. Fetch the Item Details
      const itemRes = await api.get(`/api/items/${id}/`);
      setItem(itemRes.data);
      
      // 2. EFFICIENTLY Fetch the Listing (assuming an API endpoint exists)
      // IMPROVEMENT: Instead of fetching ALL listings, fetch just the relevant one.
      try {
        // A more efficient API call is preferred here:
        const listingRes = await api.get(`/api/listings/?item_id=${id}&status=Active`); 
        // Assuming the endpoint returns an array, take the first result
        setListing(listingRes.data[0] || null); 
      } catch (listingError) {
        // Not finding a listing is often expected if the item is just in the wardrobe
        setListing(null);
      }
    } catch (error) {
      setError('Failed to fetch item details.');
      console.error('Error fetching item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = async () => {
    if (isBuying || !listing) return;

    setIsBuying(true);
    setStatusMessage({ type: '', message: '' });

    try {
      // Use Item ID or Listing ID for purchase endpoint
      await api.post(`/api/listings/${listing.listing_id}/buy/`);
      
      setStatusMessage({ type: 'success', message: 'Purchase successful! Item is now in your wardrobe.' });
      
      // Navigate to wardrobe after a brief delay
      setTimeout(() => navigate('/wardrobe'), 2500);
    } catch (error) {
      setStatusMessage({ type: 'error', message: 'Purchase failed. Please try again.' });
      console.error('Error purchasing item:', error);
    } finally {
      setIsBuying(false);
    }
  };

  // --- Loading, Error, and Not Found States ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-4xl text-green-600" />
        <div className="text-xl ml-3 text-gray-700">Loading item details...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-20 bg-gray-50 max-w-lg mx-auto rounded-xl shadow-lg mt-10">
        <p className="text-red-500 text-xl font-semibold mb-4">{error || 'Item not found'}</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  // --- Component Logic ---
  const isOwner = user && user.user_id === item.user_id;
  const isListed = listing && listing.status === 'Active';

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-green-600">
        <div className="md:flex">
          
          {/* Image Section */}
          <div className="md:w-1/2 p-4">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.item_name}
                className="w-full h-[500px] object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500 text-lg border border-gray-300">
                Image Not Available
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{item.item_name}</h1>
              <p className="text-lg text-gray-600 mb-6">Listed by {item.seller_name || 'Anonymous'}</p>

              {/* Status Message */}
              {statusMessage.message && (
                <div className={`flex items-center p-4 rounded-xl mb-6 font-medium ${
                    statusMessage.type === 'success' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {statusMessage.type === 'error' ? <FaTimesCircle className="mr-2" /> : <FaCheckCircle className="mr-2" />}
                  {statusMessage.message}
                </div>
              )}

              {/* Item Specs */}
              <div className="space-y-4 text-base mb-8 p-4 bg-gray-50 rounded-lg">
                {Object.entries({
                  Brand: item.brand_name, 
                  Category: item.category_name, 
                  Size: item.size_label, 
                  Color: item.color, 
                  Material: item.material, 
                  Condition: item.condition, 
                  Season: item.season_hint, 
                  Source: item.purchase_source
                }).map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-200 pb-1">
                    <span className="text-gray-600 font-medium">{label}:</span>
                    <span className="text-gray-800">{value || 'Not specified'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Area */}
            <div className="border-t pt-6">
              
              {isListed && (
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-3xl font-extrabold text-green-700">
                    {formatPrice(listing.price)} {/* FIXED: Assuming price is in cents */}
                  </span>
                  <span className="text-sm text-gray-500">
                    {listing.views || 0} views
                  </span>
                </div>
              )}

              {isListed && (
                isOwner ? (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-xl font-medium text-center">
                    This is **your** item, currently listed for sale.
                  </div>
                ) : (
                  <button
                    onClick={handleBuyItem}
                    disabled={isBuying}
                    className={`w-full py-4 px-4 rounded-xl font-bold text-xl transition-colors shadow-lg ${
                      isBuying 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-[1.01]'
                    } flex items-center justify-center`}
                  >
                    {isBuying ? <FaSpinner className="animate-spin mr-3" /> : <FaShoppingCart className="mr-3" />}
                    {isBuying ? 'Processing Purchase...' : 'Buy Now'}
                  </button>
                )
              )}

              {!isListed && isOwner && (
                <div className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-xl font-medium text-center">
                  This item is in your wardrobe but is not currently listed for sale.
                </div>
              )}

              {/* Footer Buttons */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => navigate('/marketplace')}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Back to Marketplace
                </button>
                {isOwner && (
                  <button
                    onClick={() => navigate('/wardrobe')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm"
                  >
                    Go to Wardrobe
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;