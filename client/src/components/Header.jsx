import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // State for user details
  const [userDetails, setUserDetails] = useState({ userName: "", email: "" });

  // Fetch user details when logged in
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/api/user/get-user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setUserDetails({
            userName: res.data.data.userName,
            email: res.data.data.email,
          });
        }
      } catch (err) {
        console.error("Error fetching user details:", err.response?.data?.message || err.message);
      }
    };

    if (isLoggedIn) fetchUserDetails();
  }, [isLoggedIn]);

  // Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/user/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      logout();
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err.response?.data?.message || err.message);
    }
  };

  // Change password
  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <header className="w-full sticky top-0 z-10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {isLoggedIn ? (
          <div className="text-white text-left">
            <div className="text-lg font-bold hover:text-pink-300">{userDetails.userName}</div>
            <div className="text-sm text-gray-300 hover:text-pink-300">{userDetails.email}</div>
          </div>
        ) : (
          <Link to="/" className="text-2xl font-extrabold text-white">
            Oauth 2.0
          </Link>
        )}

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