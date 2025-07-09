// src/pages/SignupPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/utilities.css";

function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSignup = async () => {
    if (!email || !password) {
      showToast("❗ Please fill in all fields", "error");
      return;
    }

    if (password.length < 6) {
      showToast("🔐 Password must be at least 6 characters", "error");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/signup`,
        { email, password }
      );

      const { token } = res.data;
      login(token);
      showToast("✅ Signup successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      showToast("❌ Signup failed. Try another email.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    setRedirecting(true);
    setTimeout(() => navigate("/login"), 800);
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>📝 Signup</h2>

        <label>Email</label>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <label>Create Password</label>
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button onClick={handleSignup} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loader-small mr-2"></span> Signing up...
            </>
          ) : (
            "Signup"
          )}
        </button>

        <div className="text-center mt-4">
          <span className="block text-sm text-gray-400 mb-2">
            Already have an account?
          </span>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2"
            onClick={handleRedirectToLogin}
            disabled={redirecting}
          >
            {redirecting ? (
              <>
                <span className="loader-small"></span> Redirecting...
              </>
            ) : (
              "Go to Login"
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

export default SignupPage;
