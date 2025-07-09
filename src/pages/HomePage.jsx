import React, { useEffect, useState } from "react";
import axios from "axios";
import CoinCard from "../components/CoinCard";
import { toast } from "react-toastify";
import TrendingCarousel from "../components/TrendingCarousel";
import { useRealTimePrices } from "../hooks/useRealTimePrices";
import HeroSection from "../components/HeroSection";
import { handleAxiosError } from "../utils/handleAxiosError";
import { useGlobalLoading } from "../context/LoadingContext";

function HomePage() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("market_cap_desc");
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
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/coins/markets`,
          {
            params: {
              vs_currency: currency,
              order: "market_cap_desc",
              per_page: 50,
              page,
              sparkline: true,
              price_change_percentage: "24h",
            },
          }
        );
        setCoins(res.data);
      } catch (err) {
        handleAxiosError(err, "Failed to fetch coins");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
  }, [page, currency, setIsLoading]);

  // 🔁 Real-time price updates every 15s
  useRealTimePrices({ coins, setCoins, currency });

  // ⭐ Watchlist toggler
  const toggleWatchlist = (id, name) => {
    const isInList = watchlist.includes(id);
    const updated = isInList
      ? watchlist.filter((c) => c !== id)
      : [...watchlist, id];
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
    toast[isInList ? "error" : "success"](
      isInList
        ? `❌ Removed ${name} from Watchlist`
        : `⭐ Added ${name} to Watchlist`
    );
  };

  // 🔍 Filtered & Sorted coins
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const manuallySorted = [...filteredCoins].sort((a, b) => {
    if (sortType === "price_desc") return b.current_price - a.current_price;
    if (sortType === "price_asc") return a.current_price - b.current_price;
    if (sortType === "market_cap_desc") return b.market_cap - a.market_cap;
    if (sortType === "market_cap_asc") return a.market_cap - b.market_cap;
    return 0;
  });

  return (
    <div className="container p-4">
      <HeroSection />

      <div id="trending" style={{ marginBottom: "2rem" }}>
        <TrendingCarousel currency={currency} />
      </div>

      <input
        type="text"
        placeholder="Search Coins..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-glow w-full mb-4"
      />

      <div className="flex justify-between items-center mb-4 responsive-flex">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="input-glow"
        >
          <option value="market_cap_desc">Market Cap ↓</option>
          <option value="market_cap_asc">Market Cap ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="price_asc">Price ↑</option>
        </select>

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
        {manuallySorted.slice(0, 12).map((coin) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            isInWatchlist={watchlist.includes(coin.id)}
            toggleWatchlist={() => toggleWatchlist(coin.id, coin.name)}
            currency={currency}
          />
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="cool-btn"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ◀️ Prev
        </button>
        <span className="text-sm">Page {page}</span>
        <button className="cool-btn" onClick={() => setPage((p) => p + 1)}>
          Next ▶️
        </button>
      </div>
    </div>
  );
}

export default HomePage;
