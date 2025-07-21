import React from "react";

const SymbolSelector = ({ symbol, setSymbol }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <h2 className="text-xl font-semibold">Dashboard</h2>
    <select
      className="mt-2 md:mt-0 p-2 border rounded"
      value={symbol}
      onChange={(e) => setSymbol(e.target.value)}
    >
      <option value="BTCUSD">BTC/USD</option>
      <option value="ETHUSD">ETH/USD</option>
      <option value="SOLUSD">SOL/USD</option>
    </select>
  </div>
);

export default SymbolSelector;
