import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { handleAxiosError } from "../utils/handleAxiosError";
import { useGlobalLoading } from "../context/LoadingContext";

// Register required Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function CoinDetailsPage() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [days, setDays] = useState(7);
  const { setIsLoading } = useGlobalLoading();

  // Fetch coin details and chart data
  useEffect(() => {
    const fetchCoin = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/coins/${id}`
        );
        setCoin(res.data);
      } catch (err) {
        handleAxiosError(err, "Failed to fetch coin details");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchChart = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/coins/chart/${id}`,
          {
            params: {
              vs_currency: currency,
              days,
            },
          }
        );
        setChartData(res.data?.prices || []);
      } catch (err) {
        handleAxiosError(err, "Failed to fetch chart data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoin();
    fetchChart();
  }, [id, currency, days, setIsLoading]);

  if (!coin) return null;

  const symbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  const change = coin?.market_data?.price_change_percentage_24h || 0;
  const profit = change >= 0;

  const chart = {
    labels: chartData.map(([timestamp]) => {
      const date = new Date(timestamp);
      return days === 1 ? date.toLocaleTimeString() : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: `${coin.name} Price (${currency.toUpperCase()})`,
        data: chartData.map(([, price]) => price),
        borderColor: "#00ffc3",
        backgroundColor: "rgba(0,255,204,0.1)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="container p-4">
      {/* 🔹 Coin Header */}
      <div className="flex items-center gap-4 mb-4 responsive-flex">
        <img
          src={coin.image?.large}
          alt={coin.name}
          style={{ width: "60px", height: "60px" }}
        />
        <div>
          <h2 className="text-2xl font-bold text-accent">
            {coin.name} ({coin.symbol?.toUpperCase()})
          </h2>
          <p className="text-sm text-gray-500">
            Market Cap Rank: #{coin.market_cap_rank || "?"}
          </p>
        </div>
      </div>

      {/* 🔹 Filters */}
      <div className="flex gap-2 mb-4 responsive-flex">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-glow"
        >
          <option value="usd">USD ($)</option>
          <option value="inr">INR (₹)</option>
          <option value="eur">EUR (€)</option>
        </select>

        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="input-glow"
        >
          <option value={1}>24h</option>
          <option value={7}>7d</option>
          <option value={30}>30d</option>
        </select>
      </div>

      {/* 🔹 Chart */}
      <div className="mb-4">
        <Line data={chart} />
      </div>

      {/* 🔹 Market Stats */}
      <div className="mt-4 space-y-2">
        <p className="text-sm">
          💵 Current Price: {symbol}
          {coin.market_data?.current_price?.[currency]?.toLocaleString() ||
            "N/A"}
        </p>

        <p
          className={`text-sm font-semibold ${
            profit ? "text-green" : "text-red"
          }`}
        >
          {profit ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </p>

        <p className="text-sm">
          💰 Market Cap: {symbol}
          {coin.market_data?.market_cap?.[currency]?.toLocaleString() || "N/A"}
        </p>

        <p className="text-sm">
          📊 24h Volume: {symbol}
          {coin.market_data?.total_volume?.[currency]?.toLocaleString() ||
            "N/A"}
        </p>
      </div>
    </div>
  );
}

export default CoinDetailsPage;
