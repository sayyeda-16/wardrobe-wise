// src/pages/Settings.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUserEdit, FaCog, FaEnvelope, FaLock, FaLeaf, FaBell, FaSignOutAlt, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Settings() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock initial state for form fields
    const initialProfile = user || {
        username: 'Eco-User',
        email: 'user@wardrobewise.com',
        phone: '555-123-4567',
        bio: 'Committed to circular fashion and tracking my CPW.',
    };

    const [profile, setProfile] = useState(initialProfile);
    const [password, setPassword] = useState('');
    const [sustainabilityPrefs, setSustainabilityPrefs] = useState({
        notifications: true,
        default_donation: false,
        eco_tips: true,
    });
    const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

    // Handle input change for profile fields
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    // Handle checkbox/toggle changes for preferences
    const handlePrefChange = (e) => {
        const { name, checked } = e.target;
        setSustainabilityPrefs(prev => ({ ...prev, [name]: checked }));
    };

    // Handle form submission (update profile)
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        // In a real app: Call API to update user profile
        console.log("Saving profile:", profile);
        setStatusMessage({ type: 'success', message: 'Profile updated successfully!' });
        setTimeout(() => setStatusMessage({ type: '', message: '' }), 3000);
    };

    // Handle password change submission
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setStatusMessage({ type: 'error', message: 'Password must be at least 8 characters.' });
            return;
        }
        // In a real app: Call API to update password
        console.log("Changing password...");
        setStatusMessage({ type: 'success', message: 'Password updated successfully!' });
        setPassword('');
        setTimeout(() => setStatusMessage({ type: '', message: '' }), 3000);
    };

    // Handle logout
    const handleLogout = () => {
        logout(); // Call auth context logout function
        navigate('/login'); // Redirect to login page
    };

    // Helper component for input fields
    const InputField = ({ label, name, type = 'text', value, onChange }) => (
        <div className="sm:col-span-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-1">
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                />
            </div>
        </div>
    );
    
    // Helper component for preference toggles
    const ToggleField = ({ label, name, checked, onChange }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    name={name} 
                    checked={checked} 
                    onChange={onChange} 
                    className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
        </div>
    );


    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <FaCog className="text-green-600" /> Account Settings
            </h1>

            {/* Status Message */}
            {statusMessage.message && (
                <div className={`flex items-center p-4 rounded-lg mb-6 font-medium ${
                    statusMessage.type === 'success' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }`}>
                    {statusMessage.type === 'error' && <FaTimesCircle className="mr-2" />}
                    {statusMessage.message}
                </div>
            )}

            {/* 1. Profile Information Section */}
            <div className="bg-white p-6 shadow-xl rounded-xl mb-10 border-t-4 border-green-500">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FaUserEdit /> Edit Profile Information
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InputField 
                            label="Username" 
                            name="username" 
                            value={profile.username} 
                            onChange={handleProfileChange} 
                        />
                        <InputField 
                            label="Email Address" 
                            name="email" 
                            type="email" 
                            value={profile.email} 
                            onChange={handleProfileChange} 
                        />
                        <InputField 
                            label="Phone Number" 
                            name="phone" 
                            value={profile.phone} 
                            onChange={handleProfileChange} 
                        />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio / Sustainability Commitment
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows="3"
                            value={profile.bio}
                            onChange={handleProfileChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Save Profile Changes
                    </button>
                </form>
            </div>
            
            {/* 2. Security / Password Section */}
            <div className="bg-white p-6 shadow-xl rounded-xl mb-10 border-t-4 border-blue-500">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FaLock /> Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <InputField 
                        label="New Password" 
                        name="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Update Password
                    </button>
                </form>
            </div>

            {/* 3. Sustainability Preferences Section */}
            <div className="bg-white p-6 shadow-xl rounded-xl mb-10 border-t-4 border-yellow-500">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FaLeaf /> Sustainability & App Preferences
                </h2>
                <div className="space-y-2">
                    <ToggleField
                        label={<><FaBell className="inline mr-1" /> Receive Order and Listing Notifications</>}
                        name="notifications"
                        checked={sustainabilityPrefs.notifications}
                        onChange={handlePrefChange}
                    />
                    <ToggleField
                        label={<>✅ Default to **Donation** upon Item Deletion prompt</>}
                        name="default_donation"
                        checked={sustainabilityPrefs.default_donation}
                        onChange={handlePrefChange}
                    />
                    <ToggleField
                        label={<><FaLeaf className="inline mr-1" /> Show Weekly Eco-Fashion Tips</>}
                        name="eco_tips"
                        checked={sustainabilityPrefs.eco_tips}
                        onChange={handlePrefChange}
                    />
                </div>
            </div>
            
            {/* 4. Logout / Danger Zone */}
            <div className="bg-white p-6 shadow-xl rounded-xl border-t-4 border-red-500">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FaSignOutAlt /> Account Actions
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Sign out of your account or manage permanent deletion (use with caution).
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleLogout}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={() => alert('Account Deletion initiated. This action requires email confirmation for safety.')}
                        className="flex-1 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;