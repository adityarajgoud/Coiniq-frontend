// src/components/CoinCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "../styles/utilities.css";

function CoinCard({ coin, isInWatchlist, toggleWatchlist, currency }) {
  const navigate = useNavigate();
  const profit = coin.price_change_percentage_24h >= 0;

  const symbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const handleCardClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation(); // Prevent navigation
    toggleWatchlist(coin.id, coin.name);
  };

  return (
    <Tilt glareEnable glareMaxOpacity={0.2} scale={1.03} transitionSpeed={400}>
      <div className="coin-card" onClick={handleCardClick}>
        <img
          src={coin.image}
          alt={coin.name}
          className="coin-logo"
          style={{ height: 50, marginBottom: 10 }}
        />

        <h2 className="text-xl text-gold">
          {coin.symbol.toUpperCase()} • {coin.name}
        </h2>

        <p>
          Price: {symbol}
          {coin.current_price.toLocaleString()}
        </p>

        <p className={profit ? "text-green" : "text-red"}>
          {profit ? "▲" : "▼"} {coin.price_change_percentage_24h.toFixed(2)}%
        </p>

        {coin.sparkline_in_7d?.price?.length > 0 && (
          <Sparklines
            data={coin.sparkline_in_7d.price}
            limit={14}
            width={100}
            height={30}
          >
            <SparklinesLine color={profit ? "#00e676" : "#ff4f4f"} />
          </Sparklines>
        )}

        <p className="text-xs mt-1">
          💰 Market Cap: {symbol}
          {coin.market_cap.toLocaleString()}
        </p>
        <p className="text-xs">
          📊 Volume (24h): {symbol}
          {coin.total_volume.toLocaleString()}
        </p>

        <button className="cool-btn mt-2" onClick={handleWatchlistClick}>
          {isInWatchlist ? "Remove ⭐" : "Add ⭐"}
        </button>
      </div>
    </Tilt>
  );
}

export default CoinCard;
