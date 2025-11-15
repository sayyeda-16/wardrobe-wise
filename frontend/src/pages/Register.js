// src/pages/Register.js (UPDATED CODE)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

function Register({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    city: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [success, setSuccess] = useState(''); // see if this should be deleted

  const formatErrors = (errors) => {
  if (!errors || typeof errors !== "object") return "Registration failed.";

  let messages = [];

  for (let field in errors) {
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach(msg => {
        messages.push(`${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`);
      });
    }
  }

  return messages.join("\n");
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    //setSuccess(''); // see whether to delete

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match. Please verify them.");
      return;
    }

    setLoading(true);

    const result = await registerUser({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword,
      full_name: formData.full_name,
      city: formData.city,
    });
    console.log("Registration result:", result);

    if (result.id || result.email) {
      alert(`Account created for ${formData.username}!`);
      navigate("/login");
    } else {
      setError(formatErrors(result));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-green-700 via-green-800 to-green-900 relative overflow-hidden">
      
      {/* Background gradients for texture */}
      <div className="absolute inset-0 bg-repeat opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='10' fill='%23ffffff' opacity='0.05'/%3E%3C/svg%3E")` 
      }}></div>

      {/* Main Form Card */}
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl relative z-10 border-t-8 border-green-600">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Create Sustainable Account</h2>
        <p className="text-center text-lg text-green-600 mb-8">Join the circular fashion movement</p>
        
        {/* Status Messages */}
        {error && (
            <div className="flex items-center p-4 bg-red-100 text-red-700 rounded-xl mb-6 text-sm border border-red-300">
                <FaTimesCircle className="mr-2 flex-shrink-0" />
                {error}
            </div>
        )}
        {/*success && (
            <div className="flex items-center p-4 bg-green-100 text-green-700 rounded-xl mb-6 text-sm border border-green-300">
                <FaCheckCircle className="mr-2 flex-shrink-0" />
                {success}
            </div>
        ) */}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Full Name Input */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaUser className="mr-2 text-green-600 text-sm" />
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaEnvelope className="mr-2 text-green-600 text-sm" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="Enter your email"
            />
          </div>

          {/* City Input */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaEnvelope className="mr-2 text-green-600 text-sm" />
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="Enter your city"
            />
          </div>

          {/* Username Input */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaUser className="mr-2 text-green-600 text-sm" />
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="Choose a username"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaLock className="mr-2 text-green-600 text-sm" />
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaLock className="mr-2 text-green-600 text-sm" />
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full p-3 border-2 border-gray-300 rounded-xl text-base focus:border-green-500 focus:ring-green-500 transition duration-300"
              placeholder="Confirm your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 rounded-xl text-white font-bold text-lg transition duration-300 shadow-md ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 transform hover:-translate-y-0.5'
            } flex items-center justify-center`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Registering...
              </>
            ) : (
              'Create Sustainable Account'
            )}
          </button>

          {/* Switch to Login */}
          <div className="text-center pt-2">
            <span className="text-gray-600">Already part of the community? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={loading}
              className="bg-transparent border-none text-blue-600 font-medium hover:text-blue-800 underline transition duration-150 cursor-pointer"
            >
              Sign in here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
