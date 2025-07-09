// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import TrendingPage from "./pages/TrendingPage";
import WatchlistPage from "./pages/WatchlistPage";
import CoinDetailsPage from "./pages/CoinDetailsPage";
import NewsPage from "./pages/NewsPage";
import About from "./pages/About";
import ComparePage from "./pages/ComparePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import Navbar from "./components/Navbar";
import GlobalLoader from "./components/GlobalLoader";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/ProfilePage";
import { LoadingProvider, useGlobalLoading } from "./context/LoadingContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ Import Auth context

function AppContent() {
  const { isLoading } = useGlobalLoading();

  return (
    <>
      {isLoading && <GlobalLoader />}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/coin/:id" element={<CoinDetailsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        pauseOnHover={false}
        theme="dark"
        hideProgressBar
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <LoadingProvider>
        <AuthProvider>
          {" "}
          {/* ✅ Wrap with AuthProvider */}
          <AppContent />
        </AuthProvider>
      </LoadingProvider>
    </Router>
  );
}

export default App;
