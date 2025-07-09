import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setShowDropdown(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="glass-nav">
      {/* Logo */}
      <Link to="/" className="stylish-logo text-gold text-2xl">
        🪙 COINIQ
      </Link>

      {/* Hamburger (shown only on mobile) */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <div className={`nav-links-container ${menuOpen ? "open" : ""}`}>
        {[
          { label: "Home", path: "/" },
          { label: "Trending", path: "/trending" },
          { label: "Watchlist", path: "/watchlist" },
          { label: "Compare", path: "/compare" },
          { label: "News", path: "/news" },
        ].map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link ${
              location.pathname === path ? "active-link" : ""
            }`}
          >
            {label}
          </Link>
        ))}

        {!user ? (
          <Link to="/login" className="nav-link login-link">
            Login / Signup
          </Link>
        ) : (
          <div className="profile-dropdown" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="nav-link user-btn"
            >
              {user?.email ? user.email.split("@")[0] : "User"} ⏷
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  👤 Profile
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}

        <Link
          to="/about"
          className={`nav-link ${
            location.pathname === "/about" ? "active-link" : ""
          }`}
        >
          About
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
