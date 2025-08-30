import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call backend API to send reset link
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-[#0B0F1A]">
      <div className="bg-[#1B2333] p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 rounded-full bg-[#2C3445] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full p-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Send Reset Link
          </button>
        </form>
        <button
          onClick={() => navigate("/login")}  // <-- navigate to login page
          className="w-full p-3 mt-4 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
