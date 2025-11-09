import React from 'react';

function Wardrobe({ items = [], onAddItem }) {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1F2937', margin: 0 }}>My Wardrobe</h1>
        <button 
          onClick={onAddItem}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#3B82F6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          + Add New Item
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
          <h3>Your wardrobe is empty</h3>
          <p>Start by adding your first clothing item!</p>
          <button 
            onClick={onAddItem}
            style={{ 
              marginTop: '20px',
              padding: '12px 24px', 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {items.map(item => (
            <div key={item.id} style={{ 
              border: '1px solid #E5E7EB', 
              padding: '20px', 
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1F2937' }}>{item.name}</h3>
              <p style={{ margin: '5px 0', color: '#6B7280' }}>
                <strong>Brand:</strong> {item.brand}
              </p>
              <p style={{ margin: '5px 0', color: '#6B7280' }}>
                <strong>Size:</strong> {item.size} | <strong>Color:</strong> {item.color}
              </p>
              <p style={{ margin: '5px 0', color: '#6B7280' }}>
                <strong>Condition:</strong> {item.condition}
              </p>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button style={{ 
                  flex: 1, 
                  padding: '8px 16px', 
                  backgroundColor: '#10B981', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  Sell Item
                </button>
                <button style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#EF4444', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wardrobe;