import React, { useEffect, useState } from "react";
import axios from "axios";

const CRYPTOPANIC_API_KEY = import.meta.env.VITE_CRYPTOPANIC_API_KEY; 
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY; 


const symbolToTradingView = {
  BTCUSD: "BINANCE:BTCUSDT",
  ETHUSD: "BINANCE:ETHUSDT",
  SOLUSD: "BINANCE:SOLUSDT",
};

const ChartsAndNews = ({ symbol }) => {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState(null);

  // ✅ Fetch News
const fetchNews = async () => {
  setLoadingNews(true);
  setNewsError(null);
  try {
    const res = await axios.get(
      `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=crypto&language=en`
    );
    console.log(res.data);
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
      console.error("Invalid news response:", data);
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
    const widgetContainer = document.getElementById("tradingview-widget");
    if (!widgetContainer) return;

    widgetContainer.innerHTML = ""; // Clear previous

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
      colorTheme: "light",
      isTransparent: false,
      autosize: true,
    });
    widgetContainer.appendChild(script);
  }, [symbol]);

  // ✅ Fetch news whenever symbol changes
  useEffect(() => {
    fetchNews();
  }, [symbol]);

  return (
    <div className="mt-8">
      {/* Chart */}
      <h3 className="text-lg font-bold mb-4">Market Chart</h3>
      <div className="bg-white rounded-lg shadow p-4">
        <div id="tradingview-widget" />
      </div>

      {/* News */}
      <h3 className="text-lg font-bold mt-8 mb-4">Latest Crypto News</h3>
      <div className="bg-white rounded-lg shadow p-4">
        {loadingNews && <p className="text-gray-600">Loading news...</p>}
        {newsError && <p className="text-red-500">{newsError}</p>}
        {!loadingNews && news.length > 0 ? (
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(item.published_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          !loadingNews && <p className="text-gray-600">No news available.</p>
        )}
      </div>
    </div>
  );
};

export default ChartsAndNews;
