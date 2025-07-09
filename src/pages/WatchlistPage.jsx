import React, { useEffect, useState } from "react";
import axios from "axios";
import CoinCard from "../components/CoinCard";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handleAxiosError";
import { useGlobalLoading } from "../context/LoadingContext"; // ✅ Import

function WatchlistPage() {
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist")) || [];
    } catch {
      return [];
    }
  });

  const { setIsLoading } = useGlobalLoading(); // ✅ Use loading context

  useEffect(() => {
    const fetchCoins = async () => {
      if (watchlist.length === 0) {
        setCoins([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/coins/markets`,
          {
            params: {
              vs_currency: currency,
              ids: watchlist.join(","),
              order: "market_cap_desc",
              per_page: 50,
              page: 1,
              sparkline: false,
              price_change_percentage: "24h",
            },
          }
        );

        const validCoins = res.data.filter((coin) =>
          watchlist.includes(coin.id)
        );
        setCoins(validCoins);
      } catch (err) {
        handleAxiosError(err, "Failed to fetch watchlist coins");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, [watchlist, currency, setIsLoading]);

  const toggleWatchlist = (id, name) => {
    const updated = watchlist.filter((c) => c !== id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    toast.error(`❌ Removed ${name} from Watchlist`);
  };

  return (
    <div className="container p-4">
      <h2 className="text-2xl mb-4 text-accent">⭐ My Watchlist</h2>

      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="input-glow mb-4"
      >
        <option value="usd">USD ($)</option>
        <option value="inr">INR (₹)</option>
        <option value="eur">EUR (€)</option>
      </select>

      {coins.length === 0 ? (
        <p className="text-muted text-center mt-4">
          Your watchlist is empty or coins are unavailable.
        </p>
      ) : (
        <div className="coin-grid">
          {coins.map((coin) => (
            <CoinCard
              key={coin.id}
              coin={coin}
              isInWatchlist={true}
              toggleWatchlist={() => toggleWatchlist(coin.id, coin.name)}
              currency={currency}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistPage;
