import React from "react";

const MarketPrice = ({ symbol, price }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-6">
    <h3 className="text-lg font-semibold">
      Current {symbol.slice(0, 3)} Price:
    </h3>
    <p className="text-2xl text-green-600 font-bold mt-2">
      {price ? `$${price.toLocaleString()}` : "Loading..."}
    </p>
  </div>
);

export default MarketPrice;
