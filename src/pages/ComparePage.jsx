import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { handleAxiosError } from "../utils/handleAxiosError";
import { useGlobalLoading } from "../context/LoadingContext";
import api from "../utils/axiosInstance";
import "../styles/utilities.css";

function ComparePage() {
  const [coins, setCoins] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [currency, setCurrency] = useState("usd");

  const symbol = currency === "inr" ? "₹" : currency === "eur" ? "€" : "$";
  const { setIsLoading } = useGlobalLoading();

  const fetchCoins = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/coins/markets`, {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 50, // 🔽 Reduced for performance
          page: 1,
        },
      });
      setCoins(res.data);
    } catch (err) {
      handleAxiosError(err, "Failed to load coin list");
    } finally {
      setIsLoading(false);
    }
  }, [currency, setIsLoading]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const fetchSelectedCoinDetails = useCallback(
    async (selected) => {
      setIsLoading(true);
      try {
        const coinDetails = await Promise.all(
          selected.map((coin) =>
            api
              .get(`/coins/${coin.value}`)
              .then((res) => res.data)
              .catch((err) => {
                handleAxiosError(err, `Failed to load ${coin.label}`);
                return null;
              })
          )
        );
        const filtered = coinDetails.filter(Boolean);
        setSelectedCoins(filtered);
      } catch (err) {
        handleAxiosError(err, "Failed to load selected coin details");
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading]
  );

  const handleSelect = async (selected) => {
    if (selected.length > 2) {
      toast.error("⚠️ You can compare a maximum of 2 coins.");
      return;
    }
    setSelectedOptions(selected);
    await fetchSelectedCoinDetails(selected);
  };

  // 🛡 Refresh every 15s ONLY if coins are selected
  useEffect(() => {
    if (selectedOptions.length === 0) return;
    const timeout = setTimeout(() => {
      fetchSelectedCoinDetails(selectedOptions);
    }, 15000);
    return () => clearTimeout(timeout);
  }, [selectedOptions, fetchSelectedCoinDetails]);

  const getBestValue = (metric) =>
    Math.max(
      ...selectedCoins.map(
        (coin) => coin.market_data?.[metric]?.[currency] || 0
      )
    );

  return (
    <div className="container p-4 compare-page" style={{ overflow: "visible" }}>
      <h2 className="text-2xl text-accent mb-4">🔍 Compare Coins</h2>

      {/* Currency + Dropdown */}
      <div
        className="compare-controls"
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
      >
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input-glow"
        >
          <option value="usd">USD ($)</option>
          <option value="inr">INR (₹)</option>
          <option value="eur">EUR (€)</option>
        </select>

        <div
          className="select-wrapper"
          style={{ flex: 1, minWidth: 200, zIndex: 999 }}
        >
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti
            value={selectedOptions}
            onChange={handleSelect}
            options={coins.map((coin) => ({
              value: coin.id,
              label: `${coin.name} (${coin.symbol.toUpperCase()})`,
            }))}
            placeholder="Select up to 2 coins..."
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              container: (base) => ({
                ...base,
                position: "relative",
                zIndex: 999,
              }),
              control: (base) => ({
                ...base,
                backgroundColor: "#2d2d2d",
                borderColor: "#555",
                color: "#fff",
                minHeight: "42px",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#333",
                zIndex: 9999,
              }),
              option: (styles, { isFocused }) => ({
                ...styles,
                backgroundColor: isFocused ? "#555" : "#333",
                color: "#fff",
              }),
              multiValue: (styles) => ({
                ...styles,
                backgroundColor: "#444",
              }),
              input: (base) => ({
                ...base,
                color: "#fff",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
            }}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="compare-grid fade-in">
        {selectedCoins.map((coin) => (
          <div key={coin.id} className="compare-card">
            <img
              src={coin.image?.large}
              alt={coin.name}
              loading="lazy" // ✅ Lazy load for mobile
              style={{ height: 60, marginBottom: 10 }}
            />
            <h3 className="text-gold">{coin.name}</h3>
            <span className="badge badge-glow">
              {coin.categories?.[0] || "Uncategorized"}
            </span>
            <span className="badge rank-badge">
              Rank #{coin.market_cap_rank || "?"}
            </span>
            <p className="text-sm mt-2">
              {coin.description?.en
                ? coin.description.en.split(".")[0] + "."
                : "No description available."}
            </p>
          </div>
        ))}
      </div>

      {/* Stat Table */}
      {selectedCoins.length > 0 && (
        <table className="compare-table fade-in responsive-table">
          <thead>
            <tr>
              <th>Metric</th>
              {selectedCoins.map((coin) => (
                <th key={coin.id}>{coin.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Price</td>
              {selectedCoins.map((coin) => (
                <td
                  key={coin.id}
                  className={
                    coin.market_data?.current_price?.[currency] ===
                    getBestValue("current_price")
                      ? "best-cell"
                      : ""
                  }
                >
                  {symbol}
                  {coin.market_data?.current_price?.[
                    currency
                  ]?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Market Cap</td>
              {selectedCoins.map((coin) => (
                <td
                  key={coin.id}
                  className={
                    coin.market_data?.market_cap?.[currency] ===
                    getBestValue("market_cap")
                      ? "best-cell"
                      : ""
                  }
                >
                  {symbol}
                  {coin.market_data?.market_cap?.[currency]?.toLocaleString() ||
                    "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Volume (24h)</td>
              {selectedCoins.map((coin) => (
                <td
                  key={coin.id}
                  className={
                    coin.market_data?.total_volume?.[currency] ===
                    getBestValue("total_volume")
                      ? "best-cell"
                      : ""
                  }
                >
                  {symbol}
                  {coin.market_data?.total_volume?.[
                    currency
                  ]?.toLocaleString() || "N/A"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Change (24h)</td>
              {selectedCoins.map((coin) => (
                <td
                  key={coin.id}
                  style={{
                    color:
                      coin.market_data?.price_change_percentage_24h >= 0
                        ? "lightgreen"
                        : "salmon",
                  }}
                >
                  {coin.market_data?.price_change_percentage_24h?.toFixed(2) ??
                    "0.00"}
                  %
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ComparePage;
