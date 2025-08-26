import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-10 bg-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-white">
          My App
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/login"
            className="text-slate-200 hover:text-pink-400"
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className="text-slate-200 hover:text-pink-400"
          >
            Sign Up
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
