import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { PulseLoader } from "react-spinners";

const MarketAnalysis = ({ data, loading, error, onRetry }) => {
  const signalStyles = {
    BUY: "bg-green-500/20 text-green-400 border-green-500/50",
    SELL: "bg-red-500/20 text-red-400 border-red-500/50",
    NEUTRAL: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  };

  const indicatorLabels = {
    RSI: "Overbought/Oversold Indicator(RSI)",
    MACD: "Trend Strength (MACD)",
    SMA: "Average Price Trend (SMA)",
  };

  const indicatorRows = useMemo(() => {
    if (!data?.indicators) return null;
    return Object.entries(data.indicators).map(([key, value]) => (
      <div
        key={key}
        className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow hover:shadow-lg hover:bg-gray-800/80 transition-all"
      >
        <p className="text-xs text-gray-400 mb-1">{indicatorLabels[key] || key}</p>
        <p className="text-base font-semibold text-white">{value.toFixed(2)}</p>
      </div>
    ));
  }, [data?.indicators]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <PulseLoader color="#FBBF24" size={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 text-red-400 py-6">
        <AlertCircle size={20} />
        <p>{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-medium hover:bg-yellow-500 transition"
          aria-label="Retry fetching analysis"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || !data.summary || !data.indicators) {
    return (
      <p className="text-gray-400 text-center py-6">
        No market analysis data available.
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 backdrop-blur-lg border border-yellow-400/20 shadow-lg"
      aria-live="polite"
    >
      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Market Analysis</h3>

      <div className="mb-6">
        <p className="text-gray-300">
          <strong className="text-yellow-400">Suggested Action:</strong>{" "}
          <span
            className={`inline-block px-3 py-1 rounded-full border ${
              signalStyles[data.summary.RECOMMENDATION] ||
              "bg-white/10 text-gray-200 border-gray-200/50"
            }`}
          >
            {data.summary.RECOMMENDATION || "N/A"}
          </span>
        </p>
      </div>

      <h4 className="text-md font-medium text-yellow-400 mb-3">Indicators</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{indicatorRows}</div>
    </motion.div>
  );
};

export default MarketAnalysis;
