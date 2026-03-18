// ============================================
// AMS — ESI Sidi Bel Abbès
// components/dashboard/StatsCard.jsx
// ============================================

// ── Icons (inline SVG, colour set by icon background) ────────────────────────
const StudentsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
    <path d="M15 6.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="#4361ee" strokeWidth="1.5"/>
    <path d="M17 14c0-2.21-2.239-4-5-4s-5 1.79-5 4" stroke="#4361ee" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="5.5" cy="7.5" r="2" stroke="#4361ee" strokeWidth="1.5"/>
    <path d="M3 14c0-1.657 1.119-2.8 2.5-3.2" stroke="#4361ee" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const AbsenceIcon = () => (
  <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
    <path d="M3 15l4-5 3.5 2.5 3-4.5 3 4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17h14" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
    <path d="M10 3L18 17H2L10 3Z" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 9v3.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="14.5" r="0.75" fill="#f59e0b"/>
  </svg>
);

const ExclusionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="14" height="14" rx="3" stroke="#ef4444" strokeWidth="1.5"/>
    <path d="M7.5 10h5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── StatsCard ─────────────────────────────────────────────────────────────────
/**
 * Props:
 *   icon        ReactNode  – the icon element to render inside the coloured badge
 *   iconBg      string     – background colour of the icon badge  (e.g. "#eaf0ff")
 *   label       string     – small label in the top-right          (e.g. "Across 5 levels")
 *   title       string     – metric name below the badge           (e.g. "Total Students")
 *   value       string|number – the big bold number                (e.g. 945)
 */
export function StatsCard({ icon, iconBg, label, title, value }) {
  return (
    <div className="stats-card">
      <div className="stats-card-top">
        <div className="stats-card-icon" style={{ background: iconBg }}>
          {icon}
        </div>
        <span className="stats-card-label">{label}</span>
      </div>
      <div className="stats-card-body">
        <p className="stats-card-title">{title}</p>
        <p className="stats-card-value">{value}</p>
      </div>
    </div>
  );
}

// ── Pre-built icon exports (re-usable in the data array below) ────────────────
StatsCard.StudentsIcon  = StudentsIcon;
StatsCard.AbsenceIcon   = AbsenceIcon;
StatsCard.WarningIcon   = WarningIcon;
StatsCard.ExclusionIcon = ExclusionIcon;