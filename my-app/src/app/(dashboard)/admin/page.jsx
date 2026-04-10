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
    icon:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.63338 9.05829C7.55005 9.04996 7.45005 9.04996 7.35838 9.05829C5.37505 8.99163 3.80005 7.36663 3.80005 5.36663C3.80005 3.32496 5.45005 1.66663 7.50005 1.66663C9.54172 1.66663 11.2 3.32496 11.2 5.36663C11.1917 7.36663 9.61672 8.99163 7.63338 9.05829Z" stroke="#143888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.675 3.33337C15.2916 3.33337 16.5916 4.64171 16.5916 6.25004C16.5916 7.82504 15.3417 9.10837 13.7833 9.16671C13.7167 9.15837 13.6417 9.15837 13.5667 9.16671" stroke="#143888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.4666 12.1334C1.44993 13.4834 1.44993 15.6834 3.4666 17.025C5.75827 18.5584 9.5166 18.5584 11.8083 17.025C13.8249 15.675 13.8249 13.475 11.8083 12.1334C9.52494 10.6084 5.7666 10.6084 3.4666 12.1334Z" stroke="#143888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.2834 16.6666C15.8834 16.5416 16.4501 16.3 16.9168 15.9416C18.2168 14.9666 18.2168 13.3583 16.9168 12.3833C16.4584 12.0333 15.9001 11.8 15.3084 11.6666" stroke="#143888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
,
    iconBg: "#eaf0ff",
    label:  "Across 5 levels",
    title:  "Total Students",
    value:  945,
  },
  {
    icon:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.24733 6.7035L9.15056 6.7035M1.7937 15.0029L6.37505 10.4914C6.55132 10.3178 6.82668 10.2983 7.02541 10.4453L10.5636 13.0623C10.772 13.2165 11.0628 13.1866 11.2359 12.9932L17.8644 5.58845M15.2174 5.00293H17.5692C18.0258 5.00293 18.3986 5.37024 18.408 5.82942L18.4604 8.39034" stroke="#069855" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
,
    iconBg: "#e7f6ef",
    label:  "Current semester",
    title:  "Absence Rate",
    value:  "63.2%",
  },
  {
    icon:  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.99984 13.3333H10.0073" stroke="#F6C420" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 10.8333L10 6.66659" stroke="#F6C420" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.5903 3.65324C13.0978 3.65324 12.8515 3.65324 12.6272 3.57C12.596 3.55844 12.5653 3.54572 12.5351 3.53186C12.3176 3.43208 12.1435 3.25795 11.7952 2.90968C10.9936 2.1081 10.5928 1.70731 10.0997 1.67035C10.0334 1.66538 9.96679 1.66538 9.90048 1.67035C9.40733 1.70731 9.00654 2.1081 8.20496 2.90968C7.85669 3.25795 7.68256 3.43208 7.46506 3.53186C7.43485 3.54572 7.40413 3.55844 7.37297 3.57C7.14862 3.65324 6.90236 3.65324 6.40984 3.65324H6.31899C5.0624 3.65324 4.43411 3.65324 4.04374 4.04361C3.65337 4.43399 3.65337 5.06228 3.65337 6.31886V6.40971C3.65337 6.90224 3.65337 7.1485 3.57012 7.37285C3.55856 7.40401 3.54584 7.43473 3.53198 7.46493C3.4322 7.68244 3.25807 7.85657 2.9098 8.20484C2.10822 9.00642 1.70743 9.40721 1.67047 9.90036C1.66551 9.96666 1.66551 10.0333 1.67047 10.0996C1.70743 10.5927 2.10822 10.9935 2.9098 11.7951C3.25807 12.1433 3.4322 12.3175 3.53198 12.535C3.54584 12.5652 3.55856 12.5959 3.57012 12.6271C3.65337 12.8514 3.65337 13.0977 3.65337 13.5902V13.6811C3.65337 14.9376 3.65337 15.5659 4.04374 15.9563C4.43411 16.3467 5.0624 16.3467 6.31899 16.3467H6.40984C6.90236 16.3467 7.14862 16.3467 7.37297 16.4299C7.40413 16.4415 7.43485 16.4542 7.46506 16.4681C7.68256 16.5678 7.85669 16.742 8.20496 17.0902C9.00654 17.8918 9.40733 18.2926 9.90048 18.3296C9.96679 18.3345 10.0334 18.3345 10.0997 18.3296C10.5928 18.2926 10.9936 17.8918 11.7952 17.0902C12.1435 16.742 12.3176 16.5678 12.5351 16.4681C12.5653 16.4542 12.596 16.4415 12.6272 16.4299C12.8515 16.3467 13.0978 16.3467 13.5903 16.3467H13.6812C14.9378 16.3467 15.5661 16.3467 15.9564 15.9563C16.3468 15.5659 16.3468 14.9376 16.3468 13.6811V13.5902C16.3468 13.0977 16.3468 12.8514 16.43 12.6271C16.4416 12.5959 16.4543 12.5652 16.4682 12.535C16.568 12.3175 16.7421 12.1433 17.0904 11.7951C17.8919 10.9935 18.2927 10.5927 18.3297 10.0996C18.3347 10.0333 18.3347 9.96666 18.3297 9.90036C18.2927 9.40721 17.8919 9.00642 17.0904 8.20484C16.7421 7.85657 16.568 7.68244 16.4682 7.46493C16.4543 7.43473 16.4416 7.40401 16.43 7.37285C16.3468 7.1485 16.3468 6.90224 16.3468 6.40971V6.31886C16.3468 5.06228 16.3468 4.43399 15.9564 4.04361C15.5661 3.65324 14.9378 3.65324 13.6812 3.65324H13.5903Z" stroke="#F6C420" stroke-width="1.5"/>
</svg>
,
    iconBg: "#fffaea",
    label:  "Near Limit",
    title:  "Students at warning",
    value:  15,
  },
  {
    icon:   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.08325 10C2.08325 6.26809 2.08325 4.40211 3.24262 3.24274C4.40199 2.08337 6.26797 2.08337 9.99992 2.08337C13.7319 2.08337 15.5978 2.08337 16.7572 3.24274C17.9166 4.40211 17.9166 6.26809 17.9166 10C17.9166 13.732 17.9166 15.598 16.7572 16.7573C15.5978 17.9167 13.7319 17.9167 9.99992 17.9167C6.26797 17.9167 4.40199 17.9167 3.24262 16.7573C2.08325 15.598 2.08325 13.732 2.08325 10Z" stroke="#D62525" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 6.66663V10.4166" stroke="#D62525" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 13.3236V13.3319" stroke="#D62525" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
,
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
    <div className="dashboard-page">

      {/* ── Header row ── */}
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h2 className="main-title">Dashboard</h2>
          <p className="dashboard-subtitle">View ESI attendance statistics</p>
        </div>

        <button className="main-export-btn font-normal ">
          Export
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.6519 6.00737C11.6569 6.00735 11.6618 6.00734 11.6668 6.00734C13.3237 6.00734 14.6668 7.35295 14.6668 9.01284C14.6668 10.5599 13.5001 11.8339 12.0002 12M11.6519 6.00737C11.6618 5.89737 11.6668 5.78597 11.6668 5.67339C11.6668 3.64463 10.0252 2 8.00016 2C6.08232 2 4.50838 3.47511 4.34711 5.35461M11.6519 6.00737C11.5837 6.76506 11.2859 7.4564 10.8287 8.01101M4.34711 5.35461C2.65615 5.51582 1.3335 6.94261 1.3335 8.6789C1.3335 10.2945 2.47867 11.6421 4.00016 11.9515M4.34711 5.35461C4.45233 5.34458 4.55898 5.33945 4.66683 5.33945C5.41738 5.33945 6.10999 5.58796 6.66715 6.00734" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.00016 8.66663L8.00016 14M8.00016 8.66663C7.53334 8.66663 6.66118 9.99616 6.3335 10.3333M8.00016 8.66663C8.46698 8.66663 9.33914 9.99616 9.66683 10.3333" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
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