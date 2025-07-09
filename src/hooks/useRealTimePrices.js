import { useEffect } from "react";
import axios from "axios";
import { handleAxiosError } from "../utils/handleAxiosError"; // ✅ Centralized error handler

export function useRealTimePrices({ coins, setCoins, currency }) {
  useEffect(() => {
    if (!coins.length) return;

    const interval = setInterval(async () => {
      try {
        const ids = coins.map((coin) => coin.id).join(",");

        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/coins/markets`,
          {
            params: {
              vs_currency: currency,
              ids,
              order: "market_cap_desc",
              per_page: coins.length,
              price_change_percentage: "24h",
            },
          }
        );

        const updated = res.data;

        setCoins((prevCoins) =>
          prevCoins.map((coin) => {
            const newCoin = updated.find((c) => c.id === coin.id);
            if (!newCoin) return coin;

            return {
              ...newCoin,
              _priceChanged:
                newCoin.current_price !== coin.current_price
                  ? newCoin.current_price > coin.current_price
                    ? "up"
                    : "down"
                  : null,
            };
          })
        );
      } catch (err) {
        handleAxiosError(err, "Real-time price update failed");
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [coins, currency, setCoins]);
}
