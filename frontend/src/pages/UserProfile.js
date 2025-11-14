import React, { useState } from 'react';
import { FaUser, FaEdit, FaLeaf, FaSeedling, FaRecycle, FaShoppingBag } from 'react-icons/fa';

function UserProfile() {
  const [user, setUser] = useState({
    name: 'Eco Warrior',
    email: 'eco.warrior@example.com',
    joinDate: 'January 2024',
    bio: 'Passionate about sustainable fashion and reducing environmental impact through conscious clothing choices.',
    location: 'Portland, OR',
    stats: {
      itemsListed: 12,
      itemsSold: 8,
      carbonSaved: 24 // kg
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Sustainable Profile</h1>
        <p style={styles.subtitle}>Manage your eco-friendly fashion journey</p>
      </div>

      <div style={styles.content}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <FaUser style={styles.avatarIcon} />
            </div>
            <button 
              style={styles.editButton}
              onClick={() => setIsEditing(!isEditing)}
            >
              <FaEdit style={styles.editIcon} />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
          </div>

          <div style={styles.profileInfo}>
            {isEditing ? (
              <div style={styles.editForm}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Bio</label>
                  <textarea
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                    style={styles.textarea}
                    rows="3"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                    value={editedUser.location}
                    onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                    style={styles.input}
                  />
                </div>
                <div style={styles.editActions}>
                  <button style={styles.saveButton} onClick={handleSave}>
                    Save Changes
                  </button>
                  <button style={styles.cancelButton} onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.infoDisplay}>
                <h2 style={styles.userName}>{user.name}</h2>
                <p style={styles.userEmail}>{user.email}</p>
                <p style={styles.userBio}>{user.bio}</p>
                <div style={styles.details}>
                  <span style={styles.detailItem}>📍 {user.location}</span>
                  <span style={styles.detailItem}>📅 Member since {user.joinDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Card */}
        <div style={styles.statsCard}>
          <h3 style={styles.statsTitle}>Sustainable Impact</h3>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <FaShoppingBag style={styles.statIcon} />
              <div style={styles.statNumber}>{user.stats.itemsListed}</div>
              <div style={styles.statLabel}>Items Listed</div>
            </div>
            <div style={styles.statItem}>
              <FaRecycle style={styles.statIcon} />
              <div style={styles.statNumber}>{user.stats.itemsSold}</div>
              <div style={styles.statLabel}>Items Resold</div>
            </div>
            <div style={styles.statItem}>
              <FaLeaf style={styles.statIcon} />
              <div style={styles.statNumber}>{user.stats.carbonSaved}kg</div>
              <div style={styles.statLabel}>Carbon Saved</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.activityCard}>
          <h3 style={styles.activityTitle}>Recent Sustainable Activity</h3>
          <div style={styles.activityList}>
            <div style={styles.activityItem}>
              <FaSeedling style={styles.activityIcon} />
              <div style={styles.activityText}>
                Listed "Organic Cotton Dress" for circular fashion
              </div>
              <span style={styles.activityTime}>2 days ago</span>
            </div>
            <div style={styles.activityItem}>
              <FaRecycle style={styles.activityIcon} />
              <div style={styles.activityText}>
                Sold "Sustainable Denim Jacket" to eco-conscious buyer
              </div>
              <span style={styles.activityTime}>1 week ago</span>
            </div>
            <div style={styles.activityItem}>
              <FaLeaf style={styles.activityIcon} />
              <div style={styles.activityText}>
                Joined EcoWardrobe sustainable community
              </div>
              <span style={styles.activityTime}>1 month ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f7e6 0%, #e8f4d3 100%)',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5em',
    fontWeight: '700',
    color: '#2d4a17',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '18px',
    color: '#6b8e23',
    margin: 0,
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  profileCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #556b2f 0%, #6b8e23 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(85, 107, 47, 0.3)',
  },
  avatarIcon: {
    fontSize: '50px',
    color: '#d4e6a4',
  },
  editButton: {
    padding: '10px 16px',
    backgroundColor: '#d4e6a4',
    color: '#2d4a17',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  editIcon: {
    fontSize: '14px',
  },
  profileInfo: {
    flex: 1,
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px',
    border: '2px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '16px',
    fontFamily: 'inherit',
  },
  textarea: {
    padding: '12px',
    border: '2px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '16px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  editActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  saveButton: {
    padding: '12px 24px',
    backgroundColor: '#6b8e23',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: '1px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  infoDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userName: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d4a17',
    margin: 0,
  },
  userEmail: {
    fontSize: '16px',
    color: '#6b8e23',
    margin: 0,
  },
  userBio: {
    fontSize: '16px',
    color: '#374151',
    lineHeight: '1.6',
    margin: '10px 0',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    marginTop: '10px',
  },
  detailItem: {
    fontSize: '14px',
    color: '#6b7280',
  },
  statsCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
  },
  statsTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d4a17',
    margin: '0 0 20px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
  },
  statItem: {
    textAlign: 'center',
    padding: '20px',
    background: '#f0f7e6',
    borderRadius: '15px',
    border: '1px solid #d4e6a4',
  },
  statIcon: {
    fontSize: '24px',
    color: '#6b8e23',
    marginBottom: '10px',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2d4a17',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b8e23',
    fontWeight: '500',
  },
  activityCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(34, 51, 17, 0.1)',
  },
  activityTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2d4a17',
    margin: '0 0 20px 0',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f8faf3',
    borderRadius: '10px',
    border: '1px solid #e8f4d3',
  },
  activityIcon: {
    fontSize: '18px',
    color: '#6b8e23',
    flexShrink: 0,
  },
  activityText: {
    flex: 1,
    fontSize: '14px',
    color: '#374151',
  },
  activityTime: {
    fontSize: '12px',
    color: '#9ca3af',
    flexShrink: 0,
  },
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  .edit-button:hover {
    background-color: #e8f4d3 !important;
    transform: translateY(-1px);
  }
  
  .save-button:hover {
    background-color: #556b2f !important;
    transform: translateY(-1px);
  }
  
  .cancel-button:hover {
    background-color: #f3f4f6 !important;
  }
`;

document.head.appendChild(styleSheet);

Object.assign(styles.editButton, { className: 'edit-button' });
Object.assign(styles.saveButton, { className: 'save-button' });
Object.assign(styles.cancelButton, { className: 'cancel-button' });

export default UserProfile;