import React, { useState } from "react";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if both passwords match
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Call backend API to reset password here
    console.log("Password reset successfully:", newPassword);
    setSuccessMessage("Your password has been reset successfully!");

    // Clear fields after success
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full flex justify-center items-center h-screen bg-[#0B0F1A]">
      <div className="bg-[#1B2333] p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-full bg-[#2C3445] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-4 rounded-full bg-[#2C3445] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
      </div>
    </div>
  );
};

export default ResetPassword;
