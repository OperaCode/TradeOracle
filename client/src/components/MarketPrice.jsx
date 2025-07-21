import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bitcoin,  } from "lucide-react";
import { SiEthereum , SiSolana} from "react-icons/si"; // Ethereum icon

const MarketPrice = ({ symbol, setSymbol, price }) => {
  const [prevPrice, setPrevPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);

  // Calculate price change percentage when price updates
  useEffect(() => {
    if (price && prevPrice) {
      const change = ((price - prevPrice) / prevPrice) * 100;
      setPriceChange(change.toFixed(2));
    }
    setPrevPrice(price);
  }, [price]);

  const cryptoIcons = {
    BTCUSD: <Bitcoin size={20} className="text-yellow-400" />,
    ETHUSD: <SiEthereum size={20} className="text-yellow-400" />,
    SOLUSD: <SiSolana size={20} className="text-yellow-400" />,
  };

  const symbolOptions = [
    { value: "BTCUSD", label: "BTC/USD", icon: cryptoIcons.BTCUSD },
    { value: "ETHUSD", label: "ETH/USD", icon: cryptoIcons.ETHUSD },
    { value: "SOLUSD", label: "SOL/USD", icon: cryptoIcons.SOLUSD },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 backdrop-blur-lg border border-yellow-400/20 shadow-lg"
    >
      {/* Symbol Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-yellow-400 mb-4 sm:mb-0">
          Current {symbol.slice(0, 3)} Price
        </h3>
        <div className="flex space-x-2">
          {symbolOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSymbol(option.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                symbol === option.value
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-gray-200 hover:bg-white/10"
              }`}
              aria-label={`Select ${option.label}`}
            >
              {option.icon}
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price Display */}
      <motion.div
        animate={price ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <p className="text-2xl sm:text-3xl font-bold text-white">
          {price ? `$${price.toLocaleString()}` : "Loading..."}
        </p>
        {priceChange && (
          <span
            className={`text-sm font-medium ${
              priceChange >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChange}% (1h)
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MarketPrice;
