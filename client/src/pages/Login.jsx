import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // <-- show/hide state
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        "/api/user/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
      }

      login();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:5100/auth/${provider}`;
  };

  return (
    <div className="w-full max-w-md bg-slate-800/80 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>

      {error && <p className="text-red-400 text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

        {/* Password Input with show/hide */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-slate-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Remember me + Forgot password */}
        <div className="flex justify-between text-sm text-slate-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Remember me
          </label>
          <button
            type="button"
            onClick={() => navigate("/forget-password")}
            className="text-pink-400"
          >
            Forgot password
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full bg-pink-600 hover:bg-pink-700 font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <div className="flex-1 h-px bg-slate-600"></div>
        <span className="px-3 text-slate-400 text-sm">or continue with</span>
        <div className="flex-1 h-px bg-slate-600"></div>
      </div>

      {/* OAuth Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="flex-1 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium"
        >
          Google
        </button>
        <button
          onClick={() => handleOAuthLogin("twitter")}
          className="flex-1 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-medium"
        >
          Twitter
        </button>
        <button
          onClick={() => handleOAuthLogin("github")}
          className="flex-1 py-2 rounded-full bg-gray-800 hover:bg-gray-900 text-white font-medium"
        >
          GitHub
        </button>
      </div>

      <p className="mt-6 text-center text-slate-300">
        New here?{" "}
        <Link to="/signup" className="text-pink-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
