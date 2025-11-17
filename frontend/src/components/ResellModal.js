import React, { useState, useEffect } from 'react';
import { FaRecycle, FaTimes, FaSpinner } from 'react-icons/fa';

// Simplified styles based on your THEME_COLORS (assuming you pass them or import them)
const MODAL_STYLES = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1000 },
    modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#f0f7e6', padding: '30px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', maxWidth: '450px', width: '90%', zIndex: 1001 },
    // ... other styles
};

const ResellModal = ({ item, isOpen, onClose, onList }) => {
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset state when item changes or modal opens
    useEffect(() => {
        if (isOpen && item) {
            setPrice('');
            // Pre-populate description with item name for context
            setDescription(`Selling my gently used ${item.item_name} from ${item.brand || 'a great brand'}.`); 
        }
    }, [isOpen, item]);

    if (!isOpen || !item) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const floatPrice = parseFloat(price);
        if (isNaN(floatPrice) || floatPrice <= 0) {
            alert('Please enter a valid price greater than $0.');
            return;
        }

        setLoading(true);
        // Call the parent handler with all required data
        await onList(item, price, description); 
        setLoading(false);
    };

    return (
        <div style={MODAL_STYLES.overlay}>
            <div style={MODAL_STYLES.modal}>
                <h2 style={{ color: '#3c5a17', borderBottom: '2px solid #8ea67c', paddingBottom: '10px' }}>
                    <FaRecycle style={{ marginRight: '10px' }} />
                    List for Sustainable Resale
                </h2>
                <p style={{ color: '#556b2f', marginBottom: '20px' }}>
                    Final details for: **{item.item_name}** (Current lifecycle: **{item.lifecycle}**)
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Listing Price (USD)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            placeholder="e.g., 45.00"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                            Description (Max 250 chars)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={250}
                            rows={4}
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            <FaTimes style={{ marginRight: '5px' }} />
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#6b8e23', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {loading ? <FaSpinner className="spin" /> : <FaRecycle style={{ marginRight: '5px' }} />}
                            {loading ? 'Listing...' : 'List Item Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResellModal;