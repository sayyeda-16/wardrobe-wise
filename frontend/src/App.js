// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wardrobe from "./pages/Wardrobe";
import Marketplace from "./pages/Marketplace";
import AddItem from "./pages/AddItem";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

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
            fontSize: "16px",
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
            fontSize: "16px",
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
            fontSize: "16px",
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
            fontSize: "16px",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </nav>
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
    <Router>
      <Navbar />

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/wardrobe" element={<Wardrobe items={wardrobeItems} />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route
            path="/add-item"
            element={<AddItem onAddItem={handleAddItem} />}
          />

          {/* Default route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
