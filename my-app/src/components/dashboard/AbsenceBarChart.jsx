// ============================================
// AMS — ESI Sidi Bel Abbès
// components/dashboard/AbsenceBarChart.jsx
// ============================================

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── Default data (replace with real API data via props) ───────────────────────


// ── Calendar icon ─────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="10.5" rx="1.5" stroke="#6f6f6f" strokeWidth="1.2"/>
    <path d="M1 6h12" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M4 1v3M10 1v3" stroke="#6f6f6f" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// ── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">{payload[0].value}%</p>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   data   { level: string, absences: number }[]  – chart data
 *   year   string | number                        – year shown top-right
 */
export function AbsenceBarChart({ data = DEFAULT_DATA, year = 2026 }) {
  return (
    <div className="chart-card">

      {/* Header */}
      <div className="chart-header">
        <h3 className="chart-title">Absences by Academic Year</h3>
        <div className="chart-year">
          <span>{year}</span>
          <CalendarIcon />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 0, left: -10, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            vertical={false}
            stroke="#f0f0f0"
            strokeDasharray=""
          />
          <XAxis
            dataKey="level"
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
            domain={[0, 80]}
            ticks={[0, 20, 40, 60, 80]}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="absences" radius={[8, 8, 8, 8]} background={{ fill: "#f7f7f7", radius: 8 }}>
            {data.map((entry, index) => (
              <Cell key={index} fill="#143888" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}