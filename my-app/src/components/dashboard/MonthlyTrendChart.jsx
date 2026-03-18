// ============================================
// AMS — ESI Sidi Bel Abbès
// components/dashboard/MonthlyTrendChart.jsx
// ============================================

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
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

// ── Custom dot ────────────────────────────────────────────────────────────────
const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#ffffff"
      stroke="#e0161a"
      strokeWidth={2}
    />
  );
};

// ── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value" style={{ color: "#e0161a" }}>
        {payload[0].value} absences
      </p>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   data   { month: string, absences: number }[]  – chart data
 *   year   string | number                        – year shown top-right
 */
export function MonthlyTrendChart({ data = DEFAULT_DATA, year = 2026 }) {
  return (
    <div className="chart-card">

      {/* Header */}
      <div className="chart-header">
        <h3 className="chart-title">Monthly Absence Trends</h3>
        <div className="chart-year">
          <span>{year}</span>
          <CalendarIcon />
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#f0f0f0"
            strokeDasharray=""
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: "Inter, sans-serif", fontSize: 12, fill: "#000" }}
            domain={[0, 80]}
            ticks={[0, 20, 40, 60, 80]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="absences"
            stroke="#e0161a"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: "#e0161a", stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}