// src/components/ItemCard.js (UPDATED CODE)
import React from 'react';
import { Link } from 'react-router-dom';
import { FaTag, FaLeaf, FaRecycle, FaSeedling, FaTshirt, FaShoePrints, FaGem, FaShoppingCart, FaTrash } from 'react-icons/fa';

// --- Utility Functions (Kept in JS as they generate dynamic styles) ---

// Map condition to Tailwind-compatible color class names
const getConditionColor = (condition) => {
  switch (condition) {
    case 'New': return 'text-emerald-600'; // Matches #10b981
    case 'Like New': return 'text-green-700'; // Matches #059669
    case 'Good': return 'text-amber-600'; // Matches #d97706
    case 'Fair': return 'text-red-600'; // Matches #dc2626
    default: return 'text-gray-500';
  }
};

// Define dynamic color themes for the card based on the existing logic
const getCardColor = (itemId) => {
  // NOTE: These colors are dynamic and MUST be applied via the `style` prop
  const colors = [
    { background: '#f0f7e6', border: '#d4e6a4', accent: '#6b8e23' }, // Sage (Primary)
    { background: '#e8f4d3', border: '#b8d4a4', accent: '#556b2f' }, // Olive (Secondary)
    { background: '#d4e6a4', border: '#a4b884', accent: '#3a5c1e' }, // Dark Olive (Tertiary)
    { background: '#f5f9eb', border: '#e2edc4', accent: '#87a96b' }, // Pale Green (Quaternary)
  ];
  return colors[(itemId || 0) % colors.length];
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Tops': return <FaTshirt className="text-sm" />;
    case 'Bottoms': return <FaSeedling className="text-sm" />;
    case 'Shoes': return <FaShoePrints className="text-sm" />;
    case 'Accessories': return <FaGem className="text-sm" />;
    default: return <FaLeaf className="text-sm" />;
  }
};

const formatPrice = (cents) => `$${(cents / 100).toFixed(2)}`;

// --- Main Component ---

function ItemCard({ item, onSell, onDelete, isMarketplace = false }) { 
  
  const cardColor = getCardColor(item.item_id || item.id);
  
  // Dynamic styles are handled via inline style prop using the calculated colors
  const cardStyle = {
    backgroundColor: cardColor.background,
    borderColor: cardColor.border,
  };

  const accentStyle = {
    color: cardColor.accent,
  };

  return (
    <div 
      className="border-2 p-5 rounded-2xl transition-all duration-300 cursor-pointer h-full flex flex-col hover:shadow-xl hover:-translate-y-1"
      style={cardStyle}
    >
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 
          className="text-xl font-semibold leading-tight flex-1"
          style={accentStyle}
        >
          {item.item_name || item.name || item.title}
        </h3>
        
        {/* Price Tag (Marketplace) or Listed Badge (Wardrobe) */}
        {isMarketplace && item.list_price_cents && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-amber-700 rounded-full text-sm font-medium border border-yellow-300 ml-2 flex-shrink-0">
            <FaTag className="text-xs" />
            <span className="font-bold">{formatPrice(item.list_price_cents)}</span>
          </div>
        )}
        
        {!isMarketplace && item.lifecycle === 'Listed' && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-amber-800 rounded-full text-xs font-medium ml-2 flex-shrink-0">
            <FaTag className="text-xs" />
            Listed
          </div>
        )}
      </div>

      {/* Brand and Category */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 border-opacity-50">
        <span className="text-sm font-semibold text-gray-700" style={{ color: cardColor.accent }}>
          {item.brand_name || item.brand || item.seller || 'Unknown Brand'}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          {getCategoryIcon(item.category_name || item.category)}
          <span>{item.category_name || item.category}</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 mb-5 text-sm space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Size:</span>
          <span className="text-gray-800">{item.size_label || item.size || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Color:</span>
          <span className="text-gray-800">{item.color || 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Condition:</span>
          <span className={`font-semibold text-xs uppercase ${getConditionColor(item.condition)}`}>
            {item.condition}
          </span>
        </div>
        {item.material && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">Material:</span>
            <span className="text-gray-800">{item.material}</span>
          </div>
        )}
      </div>

      {/* Actions (Conditional based on isMarketplace) */}
      <div className="flex gap-2.5 mt-auto">
        {isMarketplace ? (
          // Marketplace Action: Buy Now button
          <Link 
            to="/checkout" 
            state={{ item: item }} 
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-white rounded-xl text-sm font-semibold transition duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: cardColor.accent }}
          >
            <FaShoppingCart className="text-sm" />
            Buy Now
          </Link>
        ) : (
          // Wardrobe Actions: Resell and Remove buttons
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSell(item);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-white rounded-xl text-sm font-semibold transition duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-md"
              style={{ backgroundColor: cardColor.accent }}
            >
              <FaRecycle className="text-sm" />
              Resell
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="px-3 py-2 bg-transparent text-red-600 border border-red-600 rounded-xl text-sm font-medium transition duration-200 hover:bg-red-50 hover:text-red-700 hover:-translate-y-0.5"
            >
              <FaTrash className="text-xs" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ItemCard;