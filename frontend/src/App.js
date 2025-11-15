import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Contexts
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// --- Core Imports (Day 1) ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wardrobe from "./pages/Wardrobe";
import Marketplace from "./pages/Marketplace";
import AddItem from "./pages/AddItem";
import Navbar from "./components/Navbar";
import ItemDetail from './pages/ItemDetail'; 
// In your main router file (e.g., App.js, Router.js)

import AnalyticsPage from './pages/AnalyticsPage'; 
// ... other imports



// --- Day 2 Transaction System Imports (Dev 2) ---
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

// --- Day 2/4 Feature Imports (Dev 1 Tasks) ---
import UserProfile from './pages/UserProfile'; 	 	 
import Settings from './pages/Settings'; 	 	 	 	 
import WardrobeStats from './components/WardrobeStats'; 

// protected Route Component
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// main App Content
function AppContent() {
	const { user, login, register, logout } = useAuth();
	const navigate = useNavigate();

	// State for wardrobe items (Mock Data)
	const [wardrobeItems, setWardrobeItems] = useState([
		{ id: 1, name: 'Organic Cotton T-Shirt', brand: 'Patagonia', size: 'M', color: 'Natural', condition: 'Like New', item_name: 'Organic Cotton T-Shirt', brand_name: 'Patagonia', size_label: 'M', lifecycle: 'Active' },
		{ id: 2, name: 'Sustainable Denim Jeans', brand: 'Levi\'s', size: '32', color: 'Indigo', condition: 'Good', item_name: 'Sustainable Denim Jeans', brand_name: 'Levi\'s', size_label: '32', lifecycle: 'Active' },
		{ id: 3, name: 'Eco-Friendly Jacket', brand: 'The North Face', size: 'L', color: 'Forest Green', condition: 'Excellent', item_name: 'Eco-Friendly Jacket', brand_name: 'The North Face', size_label: 'L', lifecycle: 'Active' }
	]);

	// --- NAVIGATION HELPER FUNCTIONS ---
	const navToRegister = () => navigate('/register');
	const navToLogin = () => navigate('/login');
	const navToAddItem = () => navigate('/add-item');
	const navToWardrobe = () => navigate('/wardrobe');

	// --- HANDLERS (Unchanged) ---

	const handleRegister = async (userData) => {
		try {
			const response = await register(userData);
			navigate('/login');
			return response;
		} catch (error) {
			throw error;
		}
	};

	const handleLogin = async (email, password) => {
		try {
			const response = await login(email, password);
		
			navigate('/wardrobe');
			return response;
		} catch (error) {
		
			throw error;
		}
	};

	const handleAddItem = (newItem) => {
		const itemWithId = {
			...newItem,
			id: Date.now(),
			item_name: newItem.name,
			brand_name: newItem.brand,
			size_label: newItem.size,
			lifecycle: 'Active'
		};
		setWardrobeItems([...wardrobeItems, itemWithId]);
		
		navToWardrobe(); // Navigate after adding item
	};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

	// Show auth pages if not logged in (Unchanged)
	if (!user) {
		return (
			<div style={styles.appContainer}>
				<Routes>
					<Route path="/login" element={
						<Login onLogin={handleLogin} onSwitchToRegister={navToRegister} />
					} />
					<Route path="/register" element={
						<Register onRegister={handleRegister} onSwitchToLogin={navToLogin} />
					} />
					{/* Redirect any other path to login */}
					<Route path="*" element={<Navigate to="/login" />} />
				</Routes>
				<GlobalStyles />
			</div>
		);
	}

	// Logged-in application view
	return (
		<div style={styles.appContainer}>
			{/* PASS HANDLE LOGOUT TO NAVBAR */}
			<Navbar onLogout={handleLogout} />

			{/* Page Content with React Router */}
			<main style={styles.mainContent}>
				<Routes>
					{/* Core Routes */}
					<Route path="/wardrobe" element={
						<Wardrobe
							items={wardrobeItems}
							onAddItem={navToAddItem}
						/>
					} />
					<Route path="/marketplace" element={<Marketplace />} />
					<Route path="/add-item" element={
						<AddItem
							onAddItem={handleAddItem}
							onCancel={navToWardrobe}
						/>
					} />
					
					{/* Item Detail Route (Dynamic URL) */}
					<Route path="/item/:itemId" element={<ItemDetail />} /> 


					{/* Day 2 Transaction Routes (Dev 2) */}
					<Route path="/checkout" element={<Checkout />} />
					{/* Using a dynamic route for confirmation is best practice */}
					<Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} /> 

					{/* Day 2/4 Feature Routes (Dev 1) */}
					<Route path="/profile" element={<UserProfile />} /> 	
					<Route path="/settings" element={<Settings />} /> 	 	
					<Route path="/stats" element={<AnalyticsPage />} /> 	
					
					{/* Default Routes: Redirect base path or unknown path to wardrobe */}
					<Route path="/" element={<Navigate to="/wardrobe" />} />
					<Route path="*" element={<Navigate to="/wardrobe" />} />
				</Routes>
			</main>
			<GlobalStyles />
		</div>
	);
}

// Inline component for global styles (UPDATED for Lora)
const GlobalStyles = () => (
	<style>{`
		/* 1. Import Lora font */
		@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap');

		body {
			margin: 0;
			padding: 0;
			/* 2. Set Lora as the default font, overriding any other settings */
			font-family: 'Lora', serif;
			background-color: #f0f7e6;
		}

		* {
			box-sizing: border-box;
		}

		/* Global Green Theme Override */
		.text-green-600 { color: #6b8e23 !important; }
		.bg-green-600 { background-color: #6b8e23 !important; }

		/* Base styles for a clean app look */
		.app-page-container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 40px 20px;
		}
	`}</style>
);


// styling
const styles = {
	appContainer: {
		minHeight: '100vh',
		background: 'linear-gradient(135deg, #f0f7e6 0%, #e8f4d3 100%)',
	},
	mainContent: {
		minHeight: 'calc(100vh - 80px)', // Subtract typical navbar height (adjust as needed)
	},
};

// Main App wrapper with AuthProvider, Router, and ToastProvider (Unchanged)
function App() {
	return (
		<Router>
			<AuthProvider>
				{/* Use the standalone AppContent component */}
				<AppContent />
			</AuthProvider>
		</Router>
	);
}

export default App;

