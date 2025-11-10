import React from 'react';

function Marketplace() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ color: '#1F2937', fontSize: '2.5em', marginBottom: '20px' }}>
        🛍️ Marketplace
      </h1>
      <p style={{ fontSize: '1.2em', color: '#6B7280', marginBottom: '30px' }}>
        Browse items from other users
      </p>
      <button 
        onClick={() => alert('Marketplace is working!')}
        style={{
          padding: '15px 30px',
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          cursor: 'pointer'
        }}
      >
        Test Marketplace Button
      </button>
    </div>
  );
}

export default Marketplace;