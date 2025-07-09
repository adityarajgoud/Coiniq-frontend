// src/components/HeroSection.jsx
import React from "react";
import { Typewriter } from "react-simple-typewriter";
import "../styles/utilities.css";

function HeroSection() {
  return (
    <section className="hero-section fade-in">
      <div className="hero-content">
        <h1 className="hero-title">🚀 Welcome to COINIQ</h1>

        <p className="hero-subtitle">
          <Typewriter
            words={[
              "Track top crypto coins in real-time 📊",
              "Compare prices, volume, and market cap 💹",
              "Get latest news and sentiment insights 📰",
            ]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={30}
            delaySpeed={2000}
          />
        </p>

        <a
          href="#trending"
          className="cool-btn mt-4"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("trending")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Explore Now
        </a>
      </div>
    </section>
  );
}
export default HeroSection;
