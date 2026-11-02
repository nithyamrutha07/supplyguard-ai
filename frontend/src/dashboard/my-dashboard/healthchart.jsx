
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const chartData = [
  { day: "Mon", health: 88, risk: 42 },
  { day: "Tue", health: 91, risk: 38 },
  { day: "Wed", health: 86, risk: 55 },
  { day: "Thu", health: 93, risk: 35 },
  { day: "Fri", health: 89, risk: 48 },
  { day: "Sat", health: 95, risk: 28 },
  { day: "Sun", health: 94, risk: 32 },
];

function HealthChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          Supply Chain Performance
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Weekly health and risk monitoring
        </p>
      </div>

      <div className="mb-5 flex gap-5 text-xs">
        <span className="flex items-center gap-2 text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Supply Health
        </span>
        <span className="flex items-center gap-2 text-slate-400">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          Risk Level
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="healthColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#263449" strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#101e30",
                border: "1px solid #334155",
                borderRadius: "10px",
                color: "#fff",
              }}
            />

            <Legend />

            <Area
              type="monotone"
              dataKey="health"
              name="Supply Health"
              stroke="#34d399"
              fill="url(#healthColor)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="risk"
              name="Risk Level"
              stroke="#22d3ee"
              fill="url(#riskColor)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HealthChart;
