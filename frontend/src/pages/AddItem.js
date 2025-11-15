// src/pages/AddItem.js (UPDATED STYLING)
import React, { useState } from 'react';
import { FaTshirt, FaTag, FaCheckCircle, FaSpinner, FaTimesCircle, FaCamera, FaLeaf } from 'react-icons/fa';
import api from 'axios';
import { useNavigate } from 'react-router-dom';

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
    image: null,
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
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const submissionData = new FormData();
    for (const key in formData) {
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
      
      setTimeout(() => navigate('/wardrobe'), 1500);

    } catch (apiError) {
      console.error('Error adding item:', apiError);
      setError('Failed to add item. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section with Background Image */}
      <div style={styles.header}>
        <div style={styles.headerBackground}></div>
        <div style={styles.headerContent}>
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <FaLeaf style={styles.logoIcon} />
              <span style={styles.logoText}>WardrobeWise</span>
            </div>
            <h1 style={styles.title}>Add Sustainable Item</h1>
            <p style={styles.subtitle}>
              Extend the lifecycle of your fashion by adding items to your eco-friendly collection
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Status Messages */}
        {error && (
          <div style={styles.error}>
            <FaTimesCircle style={styles.errorIcon} />
            {error}
          </div>
        )}
        {success && (
          <div style={styles.success}>
            <FaCheckCircle style={styles.successIcon} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Item Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              style={styles.input}
              placeholder="e.g., Blue Jeans, White T-Shirt"
            />
          </div>

          {/* Brand */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              disabled={loading}
              style={styles.input}
              placeholder="e.g., Levi's, Nike, Zara"
            />
          </div>

          {/* Grid: Category & Size */}
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                style={styles.select}
              >
                <option value="" disabled>Select Category</option>
                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                disabled={loading}
                style={styles.input}
                placeholder="e.g., M, L, 42, 10"
              />
            </div>
          </div>

          {/* Grid: Color & Condition */}
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                disabled={loading}
                style={styles.input}
                placeholder="e.g., Blue, Black, Red"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                disabled={loading}
                style={styles.select}
              >
                {conditionOptions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
              </select>
            </div>
          </div>

          {/* Grid: Price & Image */}
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaTag style={styles.labelIcon} />
                Price (USD) - Optional Listing
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={loading}
                style={styles.input}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaCamera style={styles.labelIcon} />
                Item Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
                style={styles.fileInput}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.disabledButton : {})
              }}
            >
              {loading ? (
                <>
                  <FaSpinner style={styles.buttonIcon} />
                  Adding Item...
                </>
              ) : (
                'Add to Wardrobe'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/wardrobe')}
              disabled={loading}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#edf7e6ff',
    padding: '20px',
  },
  header: {
    position: 'relative',
    padding: '40px',
    marginBottom: '30px',
    color: 'white',
    boxShadow: '0 10px 40px rgba(34, 51, 17, 0.2)',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(rgba(233, 244, 213, 0.4), rgba(233, 244, 213, 0.4)), url("https://betterworldapparel.com/wp-content/uploads/2019/11/sustainable-fashion-scaled.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  headerContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
  },
  brandSection: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  logoIcon: {
    fontSize: '32px',
    marginRight: '12px',
    color: '#6f8260ff',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
  },
  title: {
    fontSize: '2.5em',
    fontWeight: '700',
    margin: '0 0 10px 0',
    color: 'white',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6f8260ff',
    margin: 0,
    opacity: 0.9,
  },
  mainContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #f5c6cb',
  },
  success: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#d1edff',
    color: '#155724',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #c3e6cb',
  },
  errorIcon: {
    marginRight: '10px',
    fontSize: '16px',
  },
  successIcon: {
    marginRight: '10px',
    fontSize: '16px',
  },
  form: {
    backgroundColor: 'white',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
    border: '1px solid #e8f4d3',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#556b2f',
    marginBottom: '8px',
  },
  labelIcon: {
    marginRight: '8px',
    fontSize: '14px',
    color: '#6f8260ff',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e8f4d3',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e8f4d3',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
  },
  fileInput: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e8f4d3',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    paddingTop: '20px',
  },
  submitButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 24px',
    backgroundColor: '#8ea67cff',
    color: '#556b2f',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(142, 166, 124, 0.3)',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  cancelButton: {
    padding: '16px 24px',
    backgroundColor: '#6f8260ff',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonIcon: {
    marginRight: '8px',
    fontSize: '16px',
    animation: 'spin 1s linear infinite',
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(142, 166, 124, 0.4);
    background-color: #a2ba71;
  }

  .cancel-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(111, 130, 96, 0.4);
    background-color: #5a6f4c;
  }

  input:focus, select:focus {
    border-color: #8ea67cff !important;
    outline: none;
  }
`;

document.head.appendChild(styleSheet);

// Add hover effects
Object.assign(styles.submitButton, {
  className: 'submit-button',
});

Object.assign(styles.cancelButton, {
  className: 'cancel-button',
});

export default AddItem;