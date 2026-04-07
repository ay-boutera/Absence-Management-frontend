// ============================================
// AMS — ESI Sidi Bel Abbès
// app/admin/page.jsx
// ============================================

"use client";

import { useAuthStore } from "@/store/authStore";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AbsenceBarChart } from "@/components/dashboard/AbsenceBarChart";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";

// ── Stats data ────────────────────────────────────────────────────────────────
const STATS = [
  {
    icon:   <StatsCard.StudentsIcon />,
    iconBg: "#eaf0ff",
    label:  "Across 5 levels",
    title:  "Total Students",
    value:  945,
  },
  {
    icon:   <StatsCard.AbsenceIcon />,
    iconBg: "#e7f6ef",
    label:  "Current semester",
    title:  "Absence Rate",
    value:  "63.2%",
  },
  {
    icon:   <StatsCard.WarningIcon />,
    iconBg: "#fffaea",
    label:  "Near Limit",
    title:  "Students at warning",
    value:  15,
  },
  {
    icon:   <StatsCard.ExclusionIcon />,
    iconBg: "#ffecea",
    label:  "Exceeded limit",
    title:  "Students at Exclusion",
    value:  3,
  },
];

// ── Chart data ────────────────────────────────────────────────────────────────
const YEAR_DATA = [
  { level: "CP1", absences: 54 },
  { level: "CP2", absences: 65 },
  { level: "CS1", absences: 38 },
  { level: "CS2", absences: 12 },
  { level: "CS3", absences: 55 },
];

const MONTHLY_DATA = [
  { month: "Sep",   absences: 32 },
  { month: "Oct",   absences: 46 },
  { month: "Nov",   absences: 44 },
  { month: "Dec",   absences: 24 },
  { month: "Jan",   absences: 15 },
  { month: "Feb",   absences: 17 },
  { month: "March", absences: 40 },
  { month: "Apr",   absences: 67 },
  { month: "May",   absences: 60 },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  return (
    <div className="main-page">

      {/* ── Header row ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Dashboard</h2>
          <p className="main-subtitle">View ESI attendance statistics</p>
        </div>

        <button className="main-export-btn">
          Export
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M11.652 6.007C11.657 6.007 11.662 6.007 11.667 6.007C13.324 6.007 14.667 7.353 14.667 9.013C14.667 10.56 13.5 11.834 12 12M11.652 6.007C11.662 5.897 11.667 5.786 11.667 5.673C11.667 3.645 10.025 2 8 2C6.082 2 4.508 3.475 4.347 5.355M11.652 6.007C11.584 6.765 11.286 7.456 10.829 8.011M4.347 5.355C2.656 5.516 1.333 6.943 1.333 8.679C1.333 10.295 2.479 11.642 4 11.952M4.347 5.355C4.452 5.345 4.559 5.339 4.667 5.339C5.417 5.339 6.11 5.588 6.667 6.007"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 8.667L8 14M8 8.667C7.533 8.667 6.661 9.996 6.333 10.333M8 8.667C8.467 8.667 9.339 9.996 9.667 10.333"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ── Stats cards ── */}
      <div className="stats-cards-grid">
        {STATS.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="charts-grid">
        <AbsenceBarChart  data={YEAR_DATA}    year={2026} />
        <MonthlyTrendChart data={MONTHLY_DATA} year={2026} />
      </div>

    </div>
  );
}