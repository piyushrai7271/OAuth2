import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // get saved token
      await axios.post(
        "http://localhost:5100/api/user/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // send token
          },
          withCredentials: true, // if using cookies
        }
      );

      logout(); // update auth state
      localStorage.removeItem("token"); // remove token
      navigate("/"); // redirect to home after logout
    } catch (err) {
      console.error("Logout failed:", err.response?.data?.message || err.message);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password"); // navigate to change password page
  };

  return (
    <header className="w-full sticky top-0 z-10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-white">
          Oauth 2.0
        </Link>

        <nav className="flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleChangePassword}
                className="text-slate-200 hover:text-pink-400"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-200 hover:text-pink-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-slate-200 hover:text-pink-400">
                Login
              </NavLink>
              <NavLink to="/signup" className="text-slate-200 hover:text-pink-400">
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
