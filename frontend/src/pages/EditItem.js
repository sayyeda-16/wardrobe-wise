// src/pages/EditItem.js
import React, { useState, useEffect } from 'react';
import { FaTshirt, FaTag, FaCheckCircle, FaSpinner, FaTimesCircle, FaCamera, FaLeaf } from 'react-icons/fa';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';


// Utility to convert cents to dollars
const centsToDollars = (cents) => {
    return (cents / 100).toFixed(2);
};


// Utility to convert dollars to cents (safe rounding)
const dollarsToCents = (dollars) => {
    return Math.round(parseFloat(dollars) * 100);
};


function EditItem() {
  const navigate = useNavigate();
  const { item_id } = useParams(); // Get item ID from URL parameter


  const [initialLoad, setInitialLoad] = useState(true);
  const [formData, setFormData] = useState({
    item_name: '',
    brand: '',
    category: '',
    size_label: '',
    color: '',
    condition: 'New',
    current_image_url: '', // To display existing image
    item_image: null, // Holds the newly selected file, if any
    purchase_price: '',
    seller_type: 'Retail',
    location: '',
    purchase_date: '',
    list_for_sale: false,
    list_price: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const categoryOptions = ['Tops', 'Bottoms', 'Shoes', 'Accessories', 'Outerwear'];
  const conditionOptions = ['New', 'LikeNew', 'Good', 'Fair'];




  // --- FETCH INITIAL DATA ---
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You must be logged in to edit an item.');
        setLoading(false);
        setInitialLoad(false);
        return;
      }


      try {
        // const response = await api.get(`api/items/<int:item_id>/`,
        // 👇 CORRECTED LINE: Use the itemId variable
            const response = await api.get(`/api/items/${item_id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
        });
       
        const item = response.data;


        // Map API response to form state
        setFormData({
            item_name: item.item_name || '',
            brand: item.brand || '',
            category: item.category || '',
            size_label: item.size_label || '',
            color: item.color || '',
            condition: item.condition || 'New',
            current_image_url: item.item_image || '', // Image URL for display
            item_image: null, // File input remains null initially
           
            // Handle Purchase Info
            purchase_price: item.purchase_info?.price_cents ? centsToDollars(item.purchase_info.price_cents) : '',
            seller_type: item.purchase_info?.seller_type || 'Retail',
            location: item.purchase_info?.location || '',
            purchase_date: item.purchase_info?.purchase_date || '',


            // Handle Listing Info
            list_for_sale: item.list_for_sale || false,
            list_price: item.list_price_cents ? centsToDollars(item.list_price_cents) : '',
        });


      } catch (apiError) {
        console.error('Error fetching item for edit:', apiError);
        setError('Failed to load item data. It may not exist or you lack permission.');
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };


    if (item_id) {
        fetchItem();
    } else {
        navigate('/wardrobe');
    }
  }, [item_id, navigate]);




  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
   
    setFormData({
      ...formData,
      [name]:
        type === 'checkbox' ? checked :
        files ? files[0] :
        value
    });
  };




  // --- SUBMIT HANDLER MODIFIED FOR PUT/PATCH ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);


    // TARGET: Specific item ID for PUT/PATCH request
    const apiUrl = `/api/items/${item_id}/`;
   
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to edit an item.');
      setLoading(false);
      return;
    }


    const submissionData = new FormData();
   
    // Append Item fields
    submissionData.append('item_name', formData.item_name);
    submissionData.append('brand', formData.brand);
    submissionData.append('category', formData.category);
    submissionData.append('size_label', formData.size_label);
    submissionData.append('color', formData.color);
    submissionData.append('condition', formData.condition);


    // Only append item_image if a NEW file was selected
    if (formData.item_image) {
      submissionData.append('item_image', formData.item_image);
    }
   
    // 1. Handle Purchase Info
    if (formData.purchase_price && parseFloat(formData.purchase_price) > 0) {
        submissionData.append('purchase_info.price_cents', dollarsToCents(formData.purchase_price));
        submissionData.append('purchase_info.seller_type', formData.seller_type);
       
        if (formData.location) {
          submissionData.append('purchase_info.location', formData.location);
        }
        if (formData.purchase_date) {
          submissionData.append('purchase_info.purchase_date', formData.purchase_date);
        }
    } else {
        submissionData.append('purchase_info.price_cents', 0); // Allow clearing price
    }


    // 2. Handle Listing Info
    submissionData.append('list_for_sale', formData.list_for_sale);
   
    if (formData.list_for_sale && formData.list_price && parseFloat(formData.list_price) > 0) {
        submissionData.append('list_price_cents', dollarsToCents(formData.list_price));
    } else if (formData.list_for_sale) {
        setError("Listing is checked, but a valid listing price is required.");
        setLoading(false);
        return;
    } else {
        submissionData.append('list_price_cents', 0);
    }




    try {
        // Changed from api.post to api.put
        await api.patch(apiUrl, submissionData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });


      setSuccess(`Item "${formData.item_name}" successfully updated!`);
      setTimeout(() => navigate('/wardrobe'), 1500);


    } catch (apiError) {
      console.error('Error updating item:', apiError);
      let errorMsg = 'Failed to update item. Please try again.';
      if (apiError.response && apiError.response.data) {
        errorMsg = JSON.stringify(apiError.response.data);
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  // --- RENDERING ---
  if (initialLoad) {
    return (
        <div style={styles.loadingContainer}>
            <FaSpinner style={styles.spinner} />
            <p>Loading item details...</p>
        </div>
    );
  }


  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerBackground}></div>
        <div style={styles.headerContent}>
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <FaLeaf style={styles.logoIcon} />
              <span style={styles.logoText}>WardrobeWise</span>
            </div>
            {/* Title changed to Edit Item */}
            <h1 style={styles.title}>Edit Item in Wardrobe</h1>
            <p style={styles.subtitle}>
              Update details for item ID: {item_id}. Make sure to save your changes.
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
              name="item_name"
              value={formData.item_name}
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
                name="size_label"
                value={formData.size_label}
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


        {/* Purchase Details Section */}
        <h3 style={styles.sectionHeader}>Purchase Details (Optional)</h3>
        <div style={styles.grid}>
            {/* Purchase Price */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Original Price (CAD)</label>
                <input
                    type="number"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleChange}
                    disabled={loading}
                    style={styles.input}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                />
            </div>
           
            {/* Seller Type */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Seller Type</label>
                <select
                    name="seller_type"
                    value={formData.seller_type}
                    onChange={handleChange}
                    disabled={loading}
                    style={styles.select}
                >
                    <option value="Retail">Retail</option>
                    <option value="LocalMarket">Local Market</option>
                    <option value="SecondHand">Second Hand</option>
                    <option value="Gift">Gift</option>
                </select>
            </div>
        </div>


        <div style={styles.grid}>
            {/* Location */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Purchase Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={loading}
                    style={styles.input}
                    placeholder="e.g., Online, New York, Thrift Store"
                />
            </div>
           
            {/* Purchase Date */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Purchase Date</label>
                <input
                    type="date"
                    name="purchase_date"
                    value={formData.purchase_date}
                    onChange={handleChange}
                    disabled={loading}
                    style={styles.input}
                />
            </div>
        </div>


        <div style={styles.spacer}></div>
          {/* Image & Current Image Display */}
          <div style={styles.grid}>
            {/* Current Image Preview */}
            {formData.current_image_url && !formData.item_image && (
                <div style={styles.formGroup}>
                    <label style={styles.label}>Current Image</label>
                    <img
                        src={formData.current_image_url}
                        alt="Current Item"
                        style={styles.currentImage}
                    />
                    <p style={styles.imageNote}>To keep current image, leave the file input below empty.</p>
                </div>
            )}
           
            {/* File Input */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaCamera style={styles.labelIcon} />
                New Item Image (Optional)
              </label>
              <input
                type="file"
                name="item_image"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
                style={styles.fileInput}
              />
              <p style={styles.imageNote}>Upload a new image to replace the current one.</p>
            </div>
          </div>
       
        <h3 style={styles.sectionHeader}>Sell Item Now? (Optional)</h3>


        {/* Listing Toggle */}
        <div style={{...styles.formGroup, ...styles.checkboxGroup}}>
            <input
                type="checkbox"
                id="list_for_sale"
                name="list_for_sale"
                checked={formData.list_for_sale}
                onChange={handleChange}
                disabled={loading}
                style={styles.checkboxInput}
            />
            <label htmlFor="list_for_sale" style={styles.label}>
                <FaTag style={styles.labelIcon} /> List this item for sale immediately.
            </label>
        </div>


        {/* Listing Price Input - Only visible if list_for_sale is checked */}
        {formData.list_for_sale && (
            <div style={styles.formGroup}>
                <label style={styles.label}>Listing Price (USD) *</label>
                <input
                    type="number"
                    name="list_price"
                    value={formData.list_price}
                    onChange={handleChange}
                    required={formData.list_for_sale}
                    disabled={loading}
                    style={styles.input}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                />
            </div>
        )}


        <div style={styles.spacer}></div>


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
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
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


// --- STYLES (Copied from AddItem.js and extended) ---
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
    loadingContainer: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '18px',
        color: '#556b2f',
    },
    spinner: {
        fontSize: '30px',
        marginBottom: '10px',
        animation: 'spin 1s linear infinite',
    },
    sectionHeader: {
        fontSize: '1.2em',
        color: '#556b2f',
        borderBottom: '1px solid #e8f4d3',
        paddingBottom: '10px',
        marginBottom: '20px',
        fontWeight: '700',
    },
    spacer: {
        height: '20px',
    },
    checkboxGroup: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    checkboxInput: {
        width: '20px',
        height: '20px',
        border: '2px solid #e8f4d3',
    },
    currentImage: {
        maxWidth: '100%',
        height: 'auto',
        maxHeight: '200px',
        objectFit: 'cover',
        border: '1px solid #e8f4d3',
        marginBottom: '8px',
    },
    imageNote: {
        fontSize: '12px',
        color: '#556b2f',
        marginTop: '5px',
    }
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
 
export default EditItem;

