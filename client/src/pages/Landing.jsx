import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, BarChart2, Shield, Menu } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="w-full py-4 px-4 sm:px-6 flex justify-between items-center bg-black/30 backdrop-blur-lg sticky top-0 z-20 shadow-lg"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-yellow-400">
          TradeOracle
        </h1>
        <nav className="hidden md:flex space-x-6">
          <a
            href="#home"
            className="text-sm hover:text-yellow-400 transition-colors duration-200 font-bold"
          >
           Home
          </a>
          <a
            href="#features"
            className="text-sm hover:text-yellow-400 transition-colors duration-200 font-bold"
          >
            Features
          </a>
          <Link
            to="/dashboard"
            className="text-sm hover:text-yellow-400 transition-colors duration-200 font-bold"
          >
            Go to Dashboard
          </Link>
        </nav>
        <button className="md:hidden text-white">
          <Menu size={24} />
        </button>
      </motion.header>

      {/* Hero Section */}
      <motion.main
      id="home"
        style={{ opacity, scale }}
        className="flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12 sm:py-20"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6"
        >
          Get Daily Crypto Trading Signals
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-xl text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8"
        >
          Stay ahead with real-time technical analysis and actionable insights for your favourite cryptocurrencies.
        </motion.p>
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg transition-all duration-200 text-sm sm:text-base"
          >
            View Dashboard
          </motion.button>
        </Link>
      </motion.main>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 sm:py-16 px-4 sm:px-6 bg-black/20 backdrop-blur-lg"
      >
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 text-yellow-400"
        >
          Features
        </motion.h3>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <TrendingUp size={40} className="text-yellow-400" />,
              title: "Daily Signals",
              description:
                "Get clear BUY/SELL/NEUTRAL signals every day to guide your trades.",
            },
            {
              icon: <BarChart2 size={40} className="text-yellow-400" />,
              title: "Technical Indicators",
              description:
                "See key indicators like RSI and MACD for informed decision-making.",
            },
            {
              icon: <Shield size={40} className="text-yellow-400" />,
              title: "Simple & Secure",
              description:
                "Minimal, fast, and secure dashboard to streamline your trading analysis.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="flex flex-col items-center p-6 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-xl border border-yellow-400/20 backdrop-blur-md shadow-lg hover:bg-yellow-400/10 transition-all duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-lg sm:text-xl font-semibold mb-2">
                {feature.title}
              </h4>
              <p className="text-sm sm:text-base text-center text-gray-200">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 sm:py-8 text-sm bg-black/30 backdrop-blur-lg mt-auto border-t border-gray-700">
        <p>© {new Date().getFullYear()} TradeOracle. All rights reserved.</p>
        <p className="mt-2 text-gray-300">
          Disclaimer: This app provides information only and is not financial advice.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
