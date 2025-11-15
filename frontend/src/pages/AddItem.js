// src/pages/AddItem.js (UPDATED CODE)
import React, { useState } from 'react';
import { FaTshirt, FaTag, FaCheckCircle, FaSpinner, FaTimesCircle, FaCamera } from 'react-icons/fa';
import api from 'axios';
import { useNavigate } from 'react-router-dom';


// Assuming onAddItem prop is no longer needed since we handle navigation internally
function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    size: '',
    color: '',
    condition: 'Good',
    price: '',
    image: null, // New state for image file
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categoryOptions = ['Tops', 'Bottoms', 'Dresses', 'Shoes', 'Accessories', 'Outerwear'];
  const conditionOptions = ['New', 'Like New', 'Good', 'Fair'];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    setFormData({
      ...formData,
      [name]: files ? files[0] : value // Handle file upload separately
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 1. Prepare data for submission
    // NOTE: For a real file upload, you would use FormData()
    const submissionData = new FormData();
    for (const key in formData) {
      // Convert price from string/float to cents for API safety
      if (key === 'price' && formData.price) {
        submissionData.append('list_price_cents', Math.round(parseFloat(formData.price) * 100));
      } else if (formData[key] !== null) {
        submissionData.append(key, formData[key]);
      }
    }
    
    // If you were not using FormData, the JSON payload would look like this:
    // const payload = { 
    //     ...formData, 
    //     list_price_cents: formData.price ? Math.round(parseFloat(formData.price) * 100) : null,
    //     price: undefined // Remove client-side price field
    // };

    try {
      // API call to add the item (and optionally list it if price is included)
      // Assuming the API endpoint handles both item creation and optional listing setup
      await api.post('/api/items/add/', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(`Item "${formData.name}" successfully added to your wardrobe!`);
      
      // Navigate after success delay
      setTimeout(() => navigate('/wardrobe'), 1500);

    } catch (apiError) {
      console.error('Error adding item:', apiError);
      setError('Failed to add item. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          <FaTshirt className="inline-block mr-3 text-green-600" />
          Add New Item to Wardrobe
        </h1>
        
        {/* Status Messages */}
        {error && (
            <div className="flex items-center p-4 bg-red-100 text-red-700 rounded-xl mb-6 text-sm border border-red-300">
                <FaTimesCircle className="mr-2 flex-shrink-0" />
                {error}
            </div>
        )}
        {success && (
            <div className="flex items-center p-4 bg-green-100 text-green-700 rounded-xl mb-6 text-sm border border-green-300">
                <FaCheckCircle className="mr-2 flex-shrink-0" />
                {success}
            </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 space-y-6">
          
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="e.g., Blue Jeans, White T-Shirt"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              disabled={loading}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="e.g., Levi's, Nike, Zara"
            />
          </div>

          {/* Grid: Category & Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300 bg-white"
              >
                <option value="" disabled>Select Category</option>
                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
                placeholder="e.g., M, L, 42, 10"
              />
            </div>
          </div>

          {/* Grid: Color & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
                placeholder="e.g., Blue, Black, Red"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300 bg-white"
              >
                {conditionOptions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
              </select>
            </div>
          </div>

          {/* Price & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FaTag className="mr-1 text-green-600" />
                Price (USD) - Optional Listing
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
                className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FaCamera className="mr-1 text-green-600" />
                Item Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
                className="w-full text-gray-900 border-2 border-gray-300 rounded-xl bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center p-4 rounded-xl text-white font-bold text-lg transition duration-300 shadow-md ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Adding Item...
                </>
              ) : (
                'Add to Wardrobe'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/wardrobe')} // Use navigate instead of onCancel prop
              disabled={loading}
              className="p-4 px-8 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-lg font-semibold transition duration-300 shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItem;