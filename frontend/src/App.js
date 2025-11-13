import  React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wardrobe from "./pages/Wardrobe";
import Marketplace from "./pages/Marketplace";
import AddItem from "./pages/AddItem";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // Hide navbar when logged out

  return (
    <nav
      style={{
        padding: "15px",
        backgroundColor: "#3B82F6",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1
        style={{ margin: 0, cursor: "pointer" }}
        onClick={() => navigate("/wardrobe")}
      >
        🧥 Wardrobe Wise
      </h1>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link
          to="/wardrobe"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1D4ED8",
            color: "white",
            border: "1px solid white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          👕 My Wardrobe
        </Link>

        <Link
          to="/marketplace"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1D4ED8",
            color: "white",
            border: "1px solid white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          🛍️ Marketplace
        </Link>

        <Link
          to="/add-item"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1D4ED8",
            color: "white",
            border: "1px solid white",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          ➕ Add Item
        </Link>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#EF4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

// ✅ Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={user ? <Navigate to="/wardrobe" /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/wardrobe" /> : <Register />}
      />

      {/* Protected routes */}
      <Route
        path="/wardrobe"
        element={
          <PrivateRoute>
            <Wardrobe />
          </PrivateRoute>
        }
      />
      <Route
        path="/marketplace"
        element={
          <PrivateRoute>
            <Marketplace />
          </PrivateRoute>
        }
      />
      <Route
        path="/add-item"
        element={
          <PrivateRoute>
            <AddItem />
          </PrivateRoute>
        }
      />

      {/* Default route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  const [wardrobeItems, setWardrobeItems] = useState([
    { id: 1, name: "Blue Jeans", brand: "Levi's", size: "M", color: "Blue", condition: "Good" },
    { id: 2, name: "White T-Shirt", brand: "Uniqlo", size: "L", color: "White", condition: "Like New" },
    { id: 3, name: "Black Jacket", brand: "Zara", size: "M", color: "Black", condition: "Excellent" },
  ]);

  const handleAddItem = (newItem) => {
    const itemWithId = { ...newItem, id: Date.now() };
    setWardrobeItems([...wardrobeItems, itemWithId]);
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
export default App;
