// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { handleAxiosError } from "../utils/handleAxiosError";
import "../styles/utilities.css";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      showToast("❗ Please fill in all fields", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("🔐 Password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("❌ Passwords do not match", "error");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/reset-password`,
        { token, newPassword }
      );

      showToast("✅ Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      handleAxiosError(err, "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>🔒 Reset Password</h2>

        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          disabled={isLoading}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          disabled={isLoading}
        />

        <button onClick={handleReset} disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>

      {toast.show && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default ResetPasswordPage;
