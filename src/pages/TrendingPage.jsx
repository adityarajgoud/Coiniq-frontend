import React, { useEffect, useState } from "react";
import axios from "axios";
import CoinCard from "../components/CoinCard";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handleAxiosError";
import { useGlobalLoading } from "../context/LoadingContext";

function TrendingPage() {
  const [trending, setTrending] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist")) || [];
    } catch {
      return [];
    }
  });

  const { setIsLoading } = useGlobalLoading();

  useEffect(() => {
    const fetchTrending = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/coins/markets`,
          {
            params: {
              vs_currency: currency,
              order: "market_cap_desc",
              per_page: 50,
              page: 1,
              sparkline: false,
              price_change_percentage: "24h",
            },
          }
        );

        const sorted = res.data
          .filter(
            (coin) => typeof coin.price_change_percentage_24h === "number"
          )
          .sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h
          )
          .slice(0, 12); // top 12 trending gainers

        setTrending(sorted);
      } catch (err) {
        handleAxiosError(err, "Failed to fetch trending coins");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, [currency, setIsLoading]);

  const toggleWatchlist = (id, name) => {
    const alreadyIn = watchlist.includes(id);
    const updated = alreadyIn
      ? watchlist.filter((c) => c !== id)
      : [...watchlist, id];

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));

    toast[alreadyIn ? "error" : "success"](
      alreadyIn
        ? `❌ Removed ${name} from Watchlist`
        : `⭐ Added ${name} to Watchlist`
    );
  };

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-4 responsive-flex">
        <h2 className="text-2xl text-accent">🔥 Trending Coins</h2>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-glow"
        >
          <option value="usd">USD ($)</option>
          <option value="inr">INR (₹)</option>
          <option value="eur">EUR (€)</option>
        </select>
      </div>

      <div className="coin-grid">
        {trending.map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            isInWatchlist={watchlist.includes(coin.id)}
            toggleWatchlist={() => toggleWatchlist(coin.id, coin.name)}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
}

export default TrendingPage;
