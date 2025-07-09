// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/utilities.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false); // ✅ New state
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("❗ Please fill in all fields", "error");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        { email, password }
      );
      const { token } = res.data;

      login(token);
      showToast("✅ Login successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      showToast("❌ Login failed. Check your credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToSignup = () => {
    setRedirecting(true);
    setTimeout(() => navigate("/signup"), 800); // short delay for visual
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>🔐 Login</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="reset-message">
          Forgot password?{" "}
          <Link to="/forgot-password" className="text-blue-600 underline">
            Reset here
          </Link>
        </p>

        <div className="text-center mt-4">
          <span className="block text-sm text-gray-400 mb-2">
            Don't have an account?
          </span>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2"
            onClick={handleRedirectToSignup}
            disabled={redirecting}
          >
            {redirecting ? (
              <>
                <span className="loader-small"></span> Redirecting...
              </>
            ) : (
              "Create New Account"
            )}
          </button>
        </div>
      </div>

      {toast.show && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default LoginPage;
