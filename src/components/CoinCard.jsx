import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "../styles/utilities.css";

function CoinCard({ coin, isInWatchlist, toggleWatchlist, currency }) {
  const navigate = useNavigate();

  // ✅ Safe numeric defaults (prevents null crashes)
  const price = coin.current_price ?? 0;
  const change24h = coin.price_change_percentage_24h ?? 0;
  const marketCap = coin.market_cap ?? 0;
  const volume = coin.total_volume ?? 0;

  const profit = change24h >= 0;
  const symbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";

  const [tiltEnabled, setTiltEnabled] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setTiltEnabled(false);
    }
  }, []);

  const handleCardClick = () => {
    navigate(`/coin/${coin.id}`);
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(coin.id, coin.name);
  };

  const Sparkline = () =>
    coin.sparkline_in_7d?.price?.length > 0 && (
      <div className="sparkline-wrapper">
        <Sparklines
          data={coin.sparkline_in_7d.price.slice(-10)}
          width={100}
          height={30}
        >
          <SparklinesLine color={profit ? "#00e676" : "#ff4f4f"} />
        </Sparklines>
      </div>
    );

  const CardContent = (
    <div className="coin-card" onClick={handleCardClick}>
      <img
        src={coin.image?.thumb || coin.image}
        alt={coin.name}
        className="coin-logo"
        loading="lazy"
        style={{ height: 50, marginBottom: 10 }}
      />

      <h2
        className="text-xl text-gold"
        style={{ wordBreak: "break-word", minHeight: "2.4rem" }}
      >
        {coin.symbol?.toUpperCase() || ""} • {coin.name}
      </h2>

      <p style={{ minHeight: "1.2rem" }}>
        Price: {symbol}
        {price.toLocaleString()}
      </p>

      <p
        className={profit ? "text-green" : "text-red"}
        style={{ minHeight: "1.2rem" }}
      >
        {profit ? "▲" : "▼"} {change24h.toFixed(2)}%
      </p>

      <Sparkline />

      <p className="text-xs mt-1" style={{ minHeight: "1rem" }}>
        💰 Market Cap: {symbol}
        {marketCap.toLocaleString()}
      </p>

      <p className="text-xs" style={{ minHeight: "1rem" }}>
        📊 Volume (24h): {symbol}
        {volume.toLocaleString()}
      </p>

      <button className="cool-btn mt-2" onClick={handleWatchlistClick}>
        {isInWatchlist ? "Remove ⭐" : "Add ⭐"}
      </button>
    </div>
  );

  return tiltEnabled ? (
    <Tilt
      glareEnable
      glareMaxOpacity={0.2}
      scale={1.03}
      transitionSpeed={400}
      style={{ margin: "0.75rem" }}
    >
      {CardContent}
    </Tilt>
  ) : (
    <div style={{ margin: "0.75rem" }}>{CardContent}</div>
  );
}

export default React.memo(CoinCard);
