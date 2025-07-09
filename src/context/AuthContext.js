// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { getLocalWatchlist, setLocalWatchlist } from "../utils/watchlist"; // ✅ helper for local storage

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState(getLocalWatchlist());
  const token = localStorage.getItem("token");

  // ✅ Check token on first load
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ email: decoded.email });
      } catch {
        setUser(null);
      }
    }
  }, [token]);

  // ✅ Fetch server watchlist if user logs in
  useEffect(() => {
    const fetchServerWatchlist = async () => {
      if (!token) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/watchlist`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWatchlist(res.data.watchlist);
      } catch (err) {
        console.error("❌ Failed to load server watchlist:", err.message);
      }
    };

    fetchServerWatchlist();
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({ email: decoded.email });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("watchlist"); // 🧹 Clear guest watchlist
    setUser(null);

    // ✅ Restore local watchlist after logout
    const localList = getLocalWatchlist();
    setWatchlist(localList);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        watchlist,
        setWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
