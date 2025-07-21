import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";
import { AlertCircle } from "lucide-react";

const symbolToTradingView = {
  BTCUSD: "BINANCE:BTCUSDT",
  ETHUSD: "BINANCE:ETHUSDT",
  SOLUSD: "BINANCE:SOLUSDT",
};

const ChartsAndNews = ({ symbol }) => {
  const widgetRef = useRef(null);
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState(null);

  // ✅ Fetch News
  const fetchNews = async () => {
    setLoadingNews(true);
    setNewsError(null);
    try {
      const res = await axios.get(
        `https://newsdata.io/api/1/news?apikey=${import.meta.env.VITE_NEWS_API_KEY}&q=crypto&language=en`
      );
      const data = res.data;

      if (data && Array.isArray(data.results)) {
        const newsItems = data.results.slice(0, 5).map((item, index) => ({
          id: index,
          title: item.title,
          description: item.description,
          url: item.link,
          published_at: item.pubDate,
        }));
        setNews(newsItems);
      } else {
        setNews([]);
        setNewsError("Invalid news data received.");
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setNewsError("Failed to load news.");
    } finally {
      setLoadingNews(false);
    }
  };

  // ✅ TradingView widget
  useEffect(() => {
    if (!widgetRef.current) return;

    try {
      widgetRef.current.innerHTML = "";

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: symbolToTradingView[symbol] || "BINANCE:BTCUSDT",
        width: "100%",
        height: "220",
        locale: "en",
        dateRange: "1D",
        colorTheme: "dark",
        isTransparent: false,
        autosize: true,
      });
      widgetRef.current.appendChild(script);
    } catch (err) {
      console.error("Error loading TradingView widget:", err);
    }
  }, [symbol]);

  useEffect(() => {
    fetchNews();
  }, [symbol]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 backdrop-blur-lg border border-yellow-400/20 shadow-lg"
    >
      {/* Market Chart */}
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Market Chart</h3>
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow mb-8">
        <div ref={widgetRef} />
      </div>

      {/* Latest News */}
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Latest Crypto News</h3>
      <div className="bg-gray-800 rounded-xl p-4 shadow">
        {loadingNews && (
          <div className="flex items-center justify-center py-6">
            <PulseLoader color="#FBBF24" size={10} />
          </div>
        )}
        {newsError && (
          <div className="flex flex-col items-center gap-2 text-red-400 py-6">
            <AlertCircle size={20} />
            <p>{newsError}</p>
            <button
              onClick={fetchNews}
              className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-500 transition"
              aria-label="Retry fetching news"
            >
              Try Again
            </button>
          </div>
        )}
        {!loadingNews && !newsError && news.length > 0 ? (
          <ul className="space-y-4">
            {news.map((item) => (
              <li
                key={item.id}
                className="border-b border-gray-700 pb-4 last:border-none"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:underline font-medium"
                >
                  {item.title}
                </a>
                {/* <p className="text-gray-300 text-sm mt-1">{item.description}</p> */}
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(item.published_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          !loadingNews && !newsError && (
            <p className="text-gray-400 text-center py-6">No news available.</p>
          )
        )}
      </div>
    </motion.div>
  );
};

export default ChartsAndNews;
