// pages/ItemDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const [itemRes, listingsRes] = await Promise.all([
        axios.get(`/api/items/${id}/`),
        axios.get('/api/listings/')
      ]);
      
      setItem(itemRes.data);
      
      // Find listing for this item
      const itemListing = listingsRes.data.find(
        listing => listing.item_id === parseInt(id)
      );
      setListing(itemListing);
    } catch (error) {
      setError('Failed to fetch item details');
      console.error('Error fetching item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyItem = async () => {
    if (!window.confirm('Are you sure you want to buy this item?')) return;

    try {
      await axios.post(`/api/listings/${listing.listing_id}/buy/`);
      alert('Purchase successful! Item added to your wardrobe.');
      navigate('/wardrobe');
    } catch (error) {
      alert('Failed to purchase item');
      console.error('Error purchasing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading item details...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error || 'Item not found'}</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  const isOwner = user.user_id === item.user_id;
  const isListed = listing && listing.status === 'Active';

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:w-1/2">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.item_name}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{item.item_name}</h1>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Brand:</span>
              <span className="font-medium">{item.brand_name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category:</span>
              <span className="font-medium">{item.category_name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium">{item.size_label || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Color:</span>
              <span className="font-medium">{item.color || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Material:</span>
              <span className="font-medium">{item.material || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Condition:</span>
              <span className="font-medium">{item.condition || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Season:</span>
              <span className="font-medium">{item.season_hint || 'All season'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Purchase Source:</span>
              <span className="font-medium">{item.purchase_source || 'Not specified'}</span>
            </div>
          </div>

          {isListed && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ${listing.price}
                </span>
                <span className="text-sm text-gray-500">
                  {listing.views} views
                </span>
              </div>

              {isOwner ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  This is your item listed for sale
                </div>
              ) : (
                <button
                  onClick={handleBuyItem}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium text-lg transition-colors"
                >
                  Buy Now
                </button>
              )}
            </div>
          )}

          {!isListed && isOwner && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              This item is in your wardrobe but not listed for sale
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => navigate('/marketplace')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Back to Marketplace
            </button>
            {isOwner && (
              <button
                onClick={() => navigate('/wardrobe')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Go to Wardrobe
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;