import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Separate visibility states for each field
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5100/api/user/change-password",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(res.data.message || "Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Change password failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800/80 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>

      {success ? (
        <p className="text-green-400 text-center text-lg font-semibold">
          {success}
        </p>
      ) : (
        <>
          {error && <p className="text-red-400 text-center mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                placeholder="Current-Password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                required
              />
              <span
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 cursor-pointer text-slate-300"
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="New-Password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                required
              />
              <span
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 cursor-pointer text-slate-300"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm-Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 cursor-pointer text-slate-300"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-full bg-pink-600 hover:bg-pink-700 font-semibold disabled:opacity-50"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}