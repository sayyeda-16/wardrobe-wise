// src/components/ItemDetails.js
import React from 'react';

// Utility function to format cents into currency (for purchase price)
const formatCurrency = (cents) => {
    if (typeof cents !== 'number' || cents < 0) return 'N/A';
    return `$${(cents / 100).toFixed(2)}`;
};

function ItemDetails({ item, isOpen, onClose, onEdit, onDelete, onSell }) {
  if (!isOpen || !item) return null;
  
  // Destructure purchase details (which MUST now be included in the 'item' prop)
  const { 
    item_name, 
    brand, 
    category, 
    size_label, 
    color, 
    condition, 
    material, 
    season_hint,
    lifecycle, // NEW: For status display
    seller_type, // NEW: For sustainability insight
    price_cents, // NEW: For cost tracking
    purchase_date, // NEW: For context
  } = item;

  // Determine if the item is available to be listed/sold
  const isAvailableToSell = lifecycle === 'Active';
  const isListed = lifecycle === 'Listed';

  const baseButtonClass = "px-4 py-2 rounded-md text-sm font-medium transition duration-150 shadow-sm";
  const baseDetailClass = "p-2 border-b border-gray-100 last:border-b-0";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{item_name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl p-1 leading-none">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
            
            {/* Core Details */}
            <div className={baseDetailClass}><strong>Brand:</strong> {brand}</div>
            <div className={baseDetailClass}><strong>Category:</strong> {category}</div>
            <div className={baseDetailClass}><strong>Size:</strong> {size_label}</div>
            <div className={baseDetailClass}><strong>Color:</strong> {color}</div>
            <div className={baseDetailClass}><strong>Condition:</strong> {condition}</div>
            <div className={baseDetailClass}><strong>Status:</strong> <span className={`font-bold ${isAvailableToSell ? 'text-green-600' : 'text-yellow-600'}`}>{lifecycle}</span></div>
            {material && <div className={baseDetailClass}><strong>Material:</strong> {material}</div>}
            {season_hint && <div className={baseDetailClass}><strong>Season:</strong> {season_hint}</div>}
            
            <hr className="col-span-2 my-2 border-gray-200" />
            
            {/* Sustainability Details (NEW: Crucial Project Data) */}
            <div className={baseDetailClass}>
                <strong>Original Price:</strong> {formatCurrency(price_cents)}
            </div>
            <div className={baseDetailClass}>
                <strong>Source:</strong> <span className="font-semibold">{seller_type}</span>
            </div>
            <div className={baseDetailClass}>
                <strong>Purchased On:</strong> {purchase_date}
            </div>
            {seller_type !== 'Retail' && (
              <div className="col-span-2 text-green-700 bg-green-50 p-2 rounded-md font-medium">
                🌱 Eco-Friendly Choice! Purchased {seller_type.toLowerCase()}.
              </div>
            )}
            
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            {isAvailableToSell && (
              <button 
                onClick={() => onSell(item)} 
                className={`${baseButtonClass} bg-indigo-600 text-white hover:bg-indigo-700`}
              >
                Sell Item
              </button>
            )}
            {isListed && (
              <button 
                onClick={() => onSell(item)} 
                className={`${baseButtonClass} bg-yellow-600 text-white hover:bg-yellow-700`}
              >
                Manage Listing
              </button>
            )}
            <button 
              onClick={() => onEdit(item)} 
              className={`${baseButtonClass} bg-gray-200 text-gray-800 hover:bg-gray-300`}
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(item)} 
              className={`${baseButtonClass} bg-red-600 text-white hover:bg-red-700`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;