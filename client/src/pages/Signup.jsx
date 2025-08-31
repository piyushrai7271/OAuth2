import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/user/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Signup Success:", res.data);
      navigate("/login"); // redirect to login after success
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800/80 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

      {error && <p className="text-red-400 text-center mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-slate-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label className="flex items-center gap-2 text-slate-300 text-sm">
          <input type="checkbox" required /> I agree with privacy and policy
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full bg-pink-600 hover:bg-pink-700 font-semibold disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-300">
        Already have an account?{" "}
        <Link to="/login" className="text-pink-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
