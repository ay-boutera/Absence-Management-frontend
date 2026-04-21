"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ── Mock data ─────────────────────────────────────────────────────────────────
const LEVELS = ["All", "1CP", "2CP", "1CS", "2CS", "3CS"];

const BAR_DATA = [
  { level: "1CP", rate: 54 },
  { level: "2CP", rate: 65 },
  { level: "1CS", rate: 38 },
  { level: "2CS", rate: 12 },
  { level: "3CS", rate: 48 },
];

const TABLE_DATA = [
  { id: 1, subject: "Algorithms", date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 2, subject: "Algorithms", date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 3, subject: "Algorithms", date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 4, subject: "Algorithms", date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 5, subject: "Algorithms", date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
  { id: 6, subject: "Algorithms", date: "21 - 03 - 2026", class: "1CP", absence: "10/126" },
];

const PAGE_SIZE = 7;
const TOTAL = 76;
const ABSENCE_RATE = 8.966;

// ── Gauge chart ───────────────────────────────────────────────────────────────
function AbsenceGauge({ rate }) {
  const pct = Math.min(rate / 100, 1);
  const R = 70;
  const cx = 85;
  const cy = 90;

  const bgX1 = cx + R * Math.cos(Math.PI);
  const bgY1 = cy + R * Math.sin(Math.PI);
  const bgX2 = cx + R * Math.cos(0);
  const bgY2 = cy + R * Math.sin(0);

  const arcAngle = Math.PI - pct * Math.PI;
  const fillX2 = cx + R * Math.cos(arcAngle);
  const fillY2 = cy + R * Math.sin(arcAngle);
  const largeArc = pct > 0.5 ? 1 : 0;

  const needleAngle = Math.PI - pct * Math.PI;
  const needleLen = 54;
  const needleTipX = cx + needleLen * Math.cos(needleAngle);
  const needleTipY = cy + needleLen * Math.sin(needleAngle);

  return (
    <svg width="170" height="100" viewBox="0 0 170 100">
      {/* Background track */}
      <path
        d={`M ${bgX1} ${bgY1} A ${R} ${R} 0 0 1 ${bgX2} ${bgY2}`}
        fill="none"
        stroke="#e8f0fe"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Green filled arc */}
      <path
        d={`M ${bgX1} ${bgY1} A ${R} ${R} 0 ${largeArc} 1 ${fillX2} ${fillY2}`}
        fill="none"
        stroke="#27AF5D"
        strokeWidth="16"
        strokeLinecap="round"
      />
      {/* Needle */}
      <line
        x1={cx} y1={cy}
        x2={needleTipX} y2={needleTipY}
        stroke="#27AF5D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="6" fill="#27AF5D" />
      <circle cx={cx} cy={cy} r="3" fill="#fff" />
    </svg>
  );
}

// ── Custom Y-axis tick ────────────────────────────────────────────────────────
function YTick({ x, y, payload }) {
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={12} fill="#000">
      {payload.value}%
    </text>
  );
}

export default function ExamAbsencesPage() {
  const [activeLevel, setActiveLevel] = useState("All");
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(TOTAL / PAGE_SIZE);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, TOTAL);

  function buildPageNumbers() {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const show = new Set(
      [1, totalPages, page, page - 1, page + 1].filter(
        (p) => p >= 1 && p <= totalPages
      )
    );
    const sorted = Array.from(show).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  }

  return (
    <div className="main-page" style={{ gap: 40 }}>

      {/* ── Header ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Exam Absences</h2>
          <p className="main-subtitle">Monitor student absences during examinations</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Level filter tabs */}
          <div className="exam-abs__tabs">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                className={`exam-abs__tab${activeLevel === lvl ? " exam-abs__tab--active" : ""}`}
                onClick={() => setActiveLevel(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Schedule exams button */}
          <button className="exam-abs__schedule-btn">
            Schedule exams
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="1" width="12" height="13" rx="1.5" stroke="white" strokeWidth="1.2" />
              <line x1="5"  y1="1" x2="5"  y2="4"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="11" y1="1" x2="11" y2="4"  stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="2"  y1="6.5" x2="14" y2="6.5" stroke="white" strokeWidth="1.2" />
              <line x1="5.5"  y1="9.5"  x2="5.5"  y2="9.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="8"    y1="9.5"  x2="8"    y2="9.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="10.5" y1="9.5"  x2="10.5" y2="9.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="5.5"  y1="12"   x2="5.5"  y2="12"   stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="8"    y1="12"   x2="8"    y2="12"   stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="exam-abs__charts-row">

        {/* Bar chart card */}
        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Absences by Subject</span>
            <span className="chart-year">
              2026
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6F6F6F" strokeWidth="1.5" />
                <line x1="3"  y1="9"  x2="21" y2="9"  stroke="#6F6F6F" strokeWidth="1.5" />
                <line x1="8"  y1="2"  x2="8"  y2="6"  stroke="#6F6F6F" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="2"  x2="16" y2="6"  stroke="#6F6F6F" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barCategoryGap="35%" barGap={4}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#F1F1F1" />
              <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
                tick={<YTick />}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Bar dataKey="rate" radius={[8, 8, 8, 8]} background={{ radius: [8, 8, 8, 8], fill: "#F7F7F7" }}>
                {BAR_DATA.map((entry) => (
                  <Cell
                    key={entry.level}
                    fill={
                      activeLevel === "All" || activeLevel === entry.level
                        ? "#143888"
                        : "#D0D9F0"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Absence rate card */}
        <div className="chart-card exam-abs__rate-card">
          <div className="chart-header">
            <span className="chart-title exam-abs__rate-title">Absence Rate this session</span>
            <span className="exam-abs__rate-value">
              {ABSENCE_RATE} %
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
            <AbsenceGauge rate={ABSENCE_RATE} />
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 className="main-title">Absences from exams</h2>

        <div className="admin-data-table">
          {/* Header row */}
          <div className="exam-abs__table-header">
            <span className="admin-data-table__header-cell">Subject</span>
            <span className="admin-data-table__header-cell">Date Examen</span>
            <span className="admin-data-table__header-cell">Class</span>
            <span className="admin-data-table__header-cell">Absence</span>
            <span className="admin-data-table__header-cell admin-data-table__header-cell--action">
              Action
            </span>
          </div>

          {/* Body */}
          <div className="admin-data-table__body">
            {TABLE_DATA.map((row) => (
              <div key={row.id} className="exam-abs__table-row">
                <span className="admin-data-table__text-cell">{row.subject}</span>
                <span className="admin-data-table__text-cell">{row.date}</span>
                <span className="admin-data-table__text-cell">{row.class}</span>
                <span className="admin-data-table__text-cell">{row.absence}</span>
                <div className="admin-data-table__cell--action">
                  <button className="admin-data-table__action-btn" title="More options">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="2"  r="1" fill="#4A5567" />
                      <circle cx="6" cy="6"  r="1" fill="#4A5567" />
                      <circle cx="6" cy="10" r="1" fill="#4A5567" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination footer */}
          <div className="admin-data-table__pagination-footer">
            <span className="admin-data-table__pagination-info">
              Showing&nbsp;
              <strong>{from} to {to}</strong>
              &nbsp;of {TOTAL} students
            </span>

            <div className="admin-data-table__pagination-center">
              {buildPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`e-${i}`} className="admin-data-table__page-btn">…</span>
                ) : (
                  <button
                    key={p}
                    className={`admin-data-table__page-btn${p === page ? " admin-data-table__page-btn--active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <div className="admin-data-table__pagination-nav">
              <button
                className="admin-data-table__nav-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M8.75 10.5L5.25 7L8.75 3.5" stroke="#4A5567" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
              <button
                className="admin-data-table__nav-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#4A5567" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
