import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const deliveryData = [
  { name: "On time", shipments: 78 },
  { name: "Delayed", shipments: 22 },
];

const riskData = [
  { name: "Low", value: 55 },
  { name: "Medium", value: 30 },
  { name: "High", value: 15 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

export default function SupplyChainCharts() {
  return (
    <section style={{
      background: "#111827",
      color: "white",
      padding: 20,
      borderRadius: 12,
      marginTop: 24
    }}>
      <h2>Supply Chain Analytics</h2>
      <p style={{ color: "#9ca3af" }}>Illustrative demo data</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24
      }}>
        <div>
          <h3>Delivery Performance (%)</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="white" />
                <YAxis stroke="white" />
                <Tooltip />
                <Bar dataKey="shipments" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3>Supply Chain Risk Distribution (%)</h3>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {riskData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}