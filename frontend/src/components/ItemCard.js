import React from 'react';

function ItemCard({ item, onSell, onDelete }) {
  return (
    <div style={{ 
      border: '1px solid #E5E7EB', 
      padding: '20px', 
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    >
      <h3 style={{ 
        margin: '0 0 10px 0', 
        color: '#1F2937',
        fontSize: '1.25em',
        fontWeight: '600'
      }}>
        {item.item_name || item.name}
      </h3>
      
      <div style={{ marginBottom: '10px' }}>
        <span style={{ 
          display: 'inline-block',
          backgroundColor: '#E5E7EB',
          color: '#374151',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.875em',
          fontWeight: '500',
          marginRight: '8px'
        }}>
          {item.brand_name || item.brand}
        </span>
        <span style={{ 
          display: 'inline-block',
          backgroundColor: '#DBEAFE',
          color: '#1E40AF',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '0.875em',
          fontWeight: '500'
        }}>
          {item.category_name || item.category}
        </span>
      </div>

      <div style={{ color: '#6B7280', fontSize: '0.875em' }}>
        <p style={{ margin: '4px 0' }}>
          <strong>Size:</strong> {item.size_label || item.size}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong>Color:</strong> {item.color}
        </p>
        <p style={{ margin: '4px 0' }}>
          <strong>Condition:</strong> 
          <span style={{ 
            color: item.condition === 'New' ? '#10B981' : 
                   item.condition === 'Like New' ? '#059669' :
                   item.condition === 'Good' ? '#D97706' : '#DC2626',
            fontWeight: '500',
            marginLeft: '4px'
          }}>
            {item.condition}
          </span>
        </p>
        {item.material && (
          <p style={{ margin: '4px 0' }}>
            <strong>Material:</strong> {item.material}
          </p>
        )}
      </div>

      <div style={{ 
        marginTop: '15px', 
        display: 'flex', 
        gap: '10px',
        borderTop: '1px solid #F3F4F6',
        paddingTop: '15px'
      }}>
        <button 
          onClick={() => onSell(item)}
          style={{ 
            flex: 1, 
            padding: '8px 16px', 
            backgroundColor: '#10B981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875em',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10B981'}
        >
          💰 Sell Item
        </button>
        <button 
          onClick={() => onDelete(item)}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#EF4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875em',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#DC2626'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#EF4444'}
        >
          🗑️ Delete
        </button>
      </div>

      {item.lifecycle === 'Sold' && (
        <div style={{
          marginTop: '10px',
          padding: '6px 12px',
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          borderRadius: '6px',
          fontSize: '0.75em',
          fontWeight: '500',
          textAlign: 'center'
        }}>
          🏷️ Listed for Sale
        </div>
      )}
    </div>
  );
}

export default ItemCard;