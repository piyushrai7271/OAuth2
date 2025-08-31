import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams(); 
  const navigate = useNavigate(); // For redirecting after success
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `/api/user/reset-password/${token}`,
        { newPassword, confirmPassword }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        setNewPassword("");
        setConfirmPassword("");

        // Redirect to login after 1.5 sec
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Try again!"
      );
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-[#0B0F1A]">
      <div className="bg-[#1B2333] p-8 rounded-2xl shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="relative mb-4">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-full bg-[#2C3445] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              className="absolute right-4 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password Field */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-full bg-[#2C3445] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              className="absolute right-4 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full p-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Reset Password
          </button>
        </form>

        {successMessage && (
          <p className="mt-4 text-green-400 text-center">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="mt-4 text-red-400 text-center">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
