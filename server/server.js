const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


// CORS config 
app.use(
  cors({
    origin: ["http://localhost:5173", "https://trade-oracle.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);


const analysisRoute = require("./routes/analysisRoutes");
const priceRoute = require("./routes/priceRoute");



// parse JSON body
app.use(express.json());

// Routes
app.use("/api", analysisRoute);
app.use("/api", priceRoute);

// ✅ test root route
// app.get("/", (req, res) => {
//   res.send("Technical Analysis Backend is running 🚀");
// });

// ✅ start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
