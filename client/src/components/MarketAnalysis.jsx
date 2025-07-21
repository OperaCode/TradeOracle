import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { PulseLoader } from "react-spinners";

const MarketAnalysis = ({ data, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <PulseLoader color="#FBBF24" size={10} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 text-red-400 py-4">
        <AlertCircle size={18} />
        <p>{error}</p>
        <button
          onClick={onRetry}
          className="mt-2 bg-yellow-400 text-black px-3 py-1 rounded-full hover:bg-yellow-500"
          aria-label="Retry fetching analysis"
        >
          Try Again
        </button>
      </div>
    );
  }
  if (!data || !data.summary || !data.indicators) {
    return <p className="text-gray-300 text-center py-4">No data available.</p>;
  }

  const signalStyles = {
    BUY: "bg-green-500/20 text-green-400 border-green-500/50",
    SELL: "bg-red-500/20 text-red-400 border-red-500/50",
    NEUTRAL: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  };

  const indicatorLabels = {
    RSI: "Overbought/Oversold Indicator",
    MACD: "Trend Strength",
    SMA: "Average Price Trend",
  };

  const indicatorRows = useMemo(() => {
    return Object.entries(data.indicators).map(([key, value]) => (
      <div
        key={key}
        className="p-2 bg-white/5 rounded-lg shadow-sm hover:bg-white/10 transition-all"
      >
        <p className="text-xs text-gray-300">{indicatorLabels[key] || key}</p>
        <p className="text-base font-medium text-white">{value.toFixed(2)}</p>
      </div>
    ));
  }, [data.indicators]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-4 backdrop-blur-md border border-yellow-400/20 max-w-md mx-auto"
      aria-live="polite"
    >
      <h3 className="text-md font-medium text-yellow-400 mb-3">Market Overview</h3>
      <p className="mb-4 text-gray-200">
        <strong>Suggested Action:</strong>{" "}
        <span
          className={`px-2 py-1 rounded-full border ${
            signalStyles[data.summary.RECOMMENDATION] || "bg-white/10 text-gray-200 border-gray-200/50"
          }`}
        >
          {data.summary.RECOMMENDATION || "N/A"}
        </span>
      </p>
      <h4 className="text-sm font-medium text-yellow-400 mb-2">Market Indicators</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{indicatorRows}</div>
    </motion.div>
  );
};

export default React.memo(MarketAnalysis);