// routes/priceRoute.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/price", async (req, res) => {
  console.log("➡️ Received request to /api/price");
  const { id = "bitcoin", currency = "usd" } = req.query;

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: id,
        vs_currencies: currency
      }
    });

    console.log("✅ CoinGecko response:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ CoinGecko API error:", err.message);
    res.status(500).json({ error: "Failed to fetch live price" });
  }
});

module.exports = router;
