import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // TODO: call your API then navigate("/");
  };

  return (
    <div className="w-full max-w-md bg-slate-800/80 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-full bg-slate-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

        <div className="flex justify-between text-sm text-slate-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Remember me
          </label>
          <button type="button" className="text-pink-400">Forgot password</button>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-full bg-pink-600 hover:bg-pink-700 font-semibold"
        >
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-slate-300">
        New here?{" "}
        <Link to="/signup" className="text-pink-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
