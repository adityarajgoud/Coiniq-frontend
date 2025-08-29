// src/components/TrendingCarousel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "../utils/handleAxiosError";
import { useGlobalLoading } from "../context/LoadingContext";

function TrendingCarousel({ currency }) {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const navigate = useNavigate();
  const { setIsLoading } = useGlobalLoading();

  useEffect(() => {
    const fetchTrendingCoins = async () => {
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
          .slice(0, 8); // Increased to 8 slides

        setTrendingCoins(sorted);
      } catch (err) {
        handleAxiosError(err, "Failed to fetch trending coins");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingCoins();
  }, [currency, setIsLoading]);

  const loopEnabled = trendingCoins.length > 4;

  return (
    <div className="mb-6">
      <h2 className="text-2xl text-accent mb-2">🚀 Trending Coins (24h)</h2>

      {trendingCoins.length > 0 && (
        <Swiper
          key={loopEnabled ? "loop" : "no-loop"} // 🔑 force re-render
          modules={[Autoplay]}
          autoplay={{ delay: 2000 }}
          spaceBetween={20}
          slidesPerView={1.5}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          loop={loopEnabled}
        >
          {trendingCoins.map((coin) => (
            <SwiperSlide key={coin.id}>
              <div
                className="trending-coin-circle cursor-pointer"
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  width={50}
                  height={50}
                  style={{ objectFit: "contain" }}
                />
                <h4 className="mt-2">{coin.name}</h4>
                <p
                  className={
                    coin.price_change_percentage_24h > 0
                      ? "text-green"
                      : "text-red"
                  }
                >
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
                <p className="text-sm">
                  {currency.toUpperCase()}{" "}
                  {coin.current_price?.toLocaleString()}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default TrendingCarousel;
