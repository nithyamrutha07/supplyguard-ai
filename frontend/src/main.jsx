import SupplyChainCharts from "./components/SupplyChainCharts";
import React from "react";
import { createRoot } from "react-dom/client";
import SupplyChainMap from "./maps/SupplyChainMap";
import DependencyGraph from "./components/DependencyGraph";

function App() {
  return (
    <main style={{
      background: "#030712",
      minHeight: "100vh",
      padding: 24,
      color: "white"
    }}>
      <h1>SUPPLY-GUARD AI</h1>
      <p>Resilient Supply Chain Intelligence Platform</p>

      <SupplyChainMap />
      <DependencyGraph />
      <SupplyChainCharts />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);