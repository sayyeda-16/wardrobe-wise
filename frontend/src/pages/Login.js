// src/pages/Login.js (UPDATED CODE)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { FaLeaf, FaEnvelope, FaLock, FaUser, FaSeedling, FaRecycle, FaTree, FaSpinner } from 'react-icons/fa';
import { useAuth } from "../contexts/AuthContext";

function Login({ onLogin, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Submitting login with:", email, password);

    try {
      const result = await login(email, password);
      console.log("Login result:", result);

      if (result.access) {
        localStorage.setItem("access_token", result.access);
        localStorage.setItem("refresh_token", result.refresh);
        navigate("/wardrobe");
      } else {
        setError(result?.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error");
    }
    
    setLoading(false);

  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-green-700 via-green-800 to-green-900 relative overflow-hidden">
      
      {/* Background radial gradients for texture */}
      <div className="absolute inset-0 bg-repeat opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='10' fill='%23ffffff' opacity='0.05'/%3E%3C/svg%3E")` 
      }}></div>

      {/* Main Content Card */}
      <div className="flex w-full max-w-6xl bg-white bg-opacity-95 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] relative z-10">
        
        {/* Left Side - Features */}
        <div className="hidden lg:flex flex-col flex-1 p-16 bg-gradient-to-br from-green-800 to-green-900 text-white justify-between">
          <div className="mb-16">
            <div className="flex items-center mb-3">
              <FaLeaf className="text-4xl mr-3 text-green-300" />
              <span className="text-3xl font-bold tracking-tight">WardrobeWise</span>
            </div>
            <p className="text-lg text-green-200 italic">Sustainable Fashion Marketplace</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start">
              <FaRecycle className="text-2xl mr-4 mt-1 text-green-300 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Circular Fashion</h3>
                <p className="text-green-100 text-sm">Give clothes a second life through sustainable trading.</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaSeedling className="text-2xl mr-4 mt-1 text-green-300 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Eco-Friendly</h3>
                <p className="text-green-100 text-sm">Reduce fashion waste and environmental impact.</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaTree className="text-2xl mr-4 mt-1 text-green-300 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Sustainable Community</h3>
                <p className="text-green-100 text-sm">Join like-minded individuals promoting green fashion.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-1 p-16 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-lg text-green-600">Sign in to your sustainable fashion account</p>
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-100 text-red-700 rounded-xl mb-6 text-sm border border-red-300">
                <span className="mr-2 text-lg">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="mr-2 text-green-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <FaLock className="mr-2 text-green-600" />
                    Password
                  </label>
                  <a href="#forgot" className="text-sm text-green-600 font-medium hover:text-green-800 transition duration-150">Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full p-4 rounded-xl text-white font-bold text-lg transition duration-300 shadow-md ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-700 hover:bg-green-800 transform hover:-translate-y-0.5'
                } flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In to WardrobeWise'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">
                  New to sustainable fashion?
                </span>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
              className="w-full p-4 bg-transparent text-green-700 border-2 border-green-700 rounded-xl font-bold text-lg transition duration-300 hover:bg-green-700 hover:text-white flex items-center justify-center transform hover:-translate-y-0.5"
            >
              <FaUser className="mr-2 text-sm" />
              Create Sustainable Account
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;