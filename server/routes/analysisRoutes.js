const express = require("express");
const router = express.Router();
const axios = require("axios");
const NodeCache = require("node-cache");
const axiosRetry = require("axios-retry");

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes
require("dotenv").config();
const TAAPI_KEY = process.env.TAAPI_KEY;
// console.log(TAAPI_KEY)


const normalizeSymbol = (symbol) => symbol.replace("USDT", "/USDT");
const supportedSymbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];

router.get("/analysis", async (req, res) => {
  const { symbol } = req.query;
  const normalizedSymbol = normalizeSymbol(symbol);
  const cacheKey = `analysis-${symbol}`;

  if (!symbol) return res.status(400).json({ error: "Symbol is required" });
  if (!TAAPI_KEY) return res.status(500).json({ error: "TAAPI key not configured" });
  if (!supportedSymbols.includes(normalizedSymbol)) {
    return res.status(400).json({ error: `Unsupported symbol: ${symbol}` });
  }

//   console.log("TAAPI_KEY loaded:", !!TAAPI_KEY); // Debug
//   console.log("Requesting analysis for:", normalizedSymbol); // Debug

  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    const response = await axios.post(
      `https://api.taapi.io/bulk`,
      {
        secret: TAAPI_KEY,
        construct: {
          exchange: "binance",
          symbol: normalizedSymbol,
          interval: "1h",
          indicators: [
            { id: "rsi", indicator: "rsi" },
            { id: "macd", indicator: "macd" },
            { id: "sma", indicator: "sma" },
          ],
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // console.log("TAAPI Bulk Response:", JSON.stringify(response.data, null, 2)); 

    const rsi = response.data.data.find((d) => d.id === "rsi")?.result?.value || 0;
    const macd = response.data.data.find((d) => d.id === "macd")?.result?.valueMACD || 0;
    const sma = response.data.data.find((d) => d.id === "sma")?.result?.value || 0;

    const recommendation = rsi > 70 ? "SELL" : rsi < 30 ? "BUY" : "NEUTRAL";
    const normalizedData = {
      summary: { RECOMMENDATION: recommendation },
      indicators: { RSI: rsi, MACD: macd, SMA: sma },
    };

    cache.set(cacheKey, normalizedData);
    res.json(normalizedData);
  } catch (err) {
    console.error("TAAPI error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    cache.del(cacheKey);
    if (err.response?.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    } else if (err.response?.status === 401) {
      res.status(401).json({ error: "Invalid TAAPI key" });
    } else if (err.response?.status === 400) {
      res.status(400).json({ error: `Invalid request: ${err.response?.data?.error || "Check symbol or parameters"}` });
    } else {
      res.status(500).json({ error: "Failed to fetch analysis. Please try again." });
    }
  }
});

module.exports = router;