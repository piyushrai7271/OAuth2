import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // ✅ Send request to backend (via proxy)
      const response = await axios.post("/api/user/forgot-password", { email });

      // ✅ Handle success message from backend
      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Server error, please try again later"
      );
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className={`w-full p-3 rounded-full font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* ✅ Success / Error Messages */}
        {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        <button
          onClick={() => navigate("/login")}
          className="w-full p-3 mt-4 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
