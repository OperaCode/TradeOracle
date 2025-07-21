import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertCircle, Menu } from "lucide-react";
import { Link } from "react-router-dom";
// import SymbolSelector from "../components/SymbolSelector";
import MarketPrice from "../components/MarketPrice";
import MarketAnalysis from "../components/MarketAnalysis";
import ChartsAndNews from "../components/ChartsAndNews";

const BASE_URL = import.meta.env.VITE_FRONTEND_URL;

const symbolToId = {
  BTCUSD: "bitcoin",
  ETHUSD: "ethereum",
  SOLUSD: "solana",
};

const symbolToBinanceSymbol = {
  BTCUSD: "BTCUSDT",
  ETHUSD: "ETHUSDT",
  SOLUSD: "SOLUSDT",
};

const Dashboard = () => {
  const [symbol, setSymbol] = useState("BTCUSD");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchPrice = async () => {
    try {
      const id = symbolToId[symbol] || "bitcoin";
      const res = await axios.get(`${BASE_URL}/api/price`, {
        params: { id, currency: "usd" },
      });
      setPrice(res.data[id].usd);
    } catch (err) {
      console.error("Error fetching price:", err);
      setPrice(null);
    }
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/api/analysis`, {
        params: { symbol: symbolToBinanceSymbol[symbol] },
      });
      setData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching analysis:", err);
      setData(null);
      setError("Failed to fetch analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    fetchAnalysis();
    const interval = setInterval(() => {
      fetchPrice();
      fetchAnalysis();
    }, 60000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-blue-800 to-indigo-950 text-white font-sans">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="w-full py-4 px-4 sm:px-6 flex justify-between items-center bg-black/30 backdrop-blur-lg sticky top-0 z-20 shadow-lg"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">TradeOracle</h1>
        <nav className="hidden md:flex space-x-6">
          {/* <a href="#features" className="text-sm hover:text-yellow-400 transition-colors duration-200">Features</a> */}
          <Link to="/" className="text-sm hover:text-yellow-400 transition-colors duration-200">Back to Home</Link>
          {/* <a href="#contact" className="text-sm hover:text-yellow-400 transition-colors duration-200">Contact</a> */}
        </nav>
        <button className="md:hidden text-white">
          <Menu size={24} />
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 max-w-7xl mx-auto grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Sidebar - News */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 bg-white/10 rounded-2xl shadow-lg p-4 sm:p-6 h-fit lg:sticky lg:top-20 backdrop-blur-lg hover:bg-white/20 transition-all duration-300"
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-yellow-400">
            📰 Latest Crypto News
          </h2>
          <ChartsAndNews symbol={symbol} />
        </motion.div>

        {/* Right Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 rounded-2xl shadow-lg p-4 sm:p-6 hover:bg-white/15 backdrop-blur-lg transition-all duration-300"
          >
            <MarketPrice symbol={symbol} setSymbol={setSymbol} price={price} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 rounded-2xl shadow-lg p-4 sm:p-6 hover:bg-white/15 backdrop-blur-lg transition-all duration-300"
          >
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-400 py-4">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}
            {!loading && !error && <MarketAnalysis data={data} loading={loading} error={error} />}
          </motion.div>

          {lastUpdated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xs text-gray-300 text-right"
            >
              Last updated {Math.floor((new Date() - lastUpdated) / 1000)} seconds ago
            </motion.p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;