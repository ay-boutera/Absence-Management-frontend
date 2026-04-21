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
    <rect
      x="1"
      y="2.5"
      width="12"
      height="10.5"
      rx="1.5"
      stroke="#6f6f6f"
      strokeWidth="1.2"
    />
    <path
      d="M1 6h12"
      stroke="#6f6f6f"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M4 1v3M10 1v3"
      stroke="#6f6f6f"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
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
      <div className="chart-header">
        <h3 className="chart-title">Absences by Academic Year</h3>
        <div className="chart-year">
          <span className="font-medium text-[14px] leading-[9.285713945116315%] text-[#6f6f6f]">
            {year}
          </span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.625 9.375H9.375M13.125 5H1.875M10 1.25V3.125M5 1.25V3.125M4.875 13.75H10.125C11.1751 13.75 11.7001 13.75 12.1012 13.5456C12.454 13.3659 12.7409 13.079 12.9206 12.7262C13.125 12.3251 13.125 11.8001 13.125 10.75V5.5C13.125 4.4499 13.125 3.92485 12.9206 3.52377C12.7409 3.17096 12.454 2.88413 12.1012 2.70436C11.7001 2.5 11.1751 2.5 10.125 2.5H4.875C3.8249 2.5 3.29985 2.5 2.89877 2.70436C2.54596 2.88413 2.25913 3.17096 2.07936 3.52377C1.875 3.92485 1.875 4.4499 1.875 5.5V10.75C1.875 11.8001 1.875 12.3251 2.07936 12.7262C2.25913 13.079 2.54596 13.3659 2.89877 13.5456C3.29985 13.75 3.8249 13.75 4.875 13.75Z"
              stroke="#6F6F6F"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 0, left: -25, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid vertical={false} stroke="#f0f0f0" strokeDasharray="" />
          <XAxis
            dataKey="level"
            axisLine={false}
            tickLine={false}
            tick={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fill: "#000",
            }}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            axisLine={false}
            tickLine={false}
            tick={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fill: "#000",
            }}
            domain={[0, 80]}
            ticks={[0, 20, 40, 60, 80]}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar
            dataKey="absences"
            radius={[8, 8, 8, 8]}
            background={{ fill: "#f7f7f7", radius: 8 }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill="#143888" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
