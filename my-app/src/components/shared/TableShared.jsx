// ============================================
// AMS — ESI Sidi Bel Abbès
// tableShared.jsx — Shared table atoms
// ============================================

export function IconGroup() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.5" r="2.2" stroke="#4a5567" strokeWidth="1.2" />
      <path
        d="M2 13c0-2.2 1.8-4 4-4s4 1.8 4 4"
        stroke="#4a5567"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="11.5" cy="5.5" r="1.8" stroke="#4a5567" strokeWidth="1.2" />
      <path
        d="M13.5 13c0-1.8-1-3.2-2-3.6"
        stroke="#4a5567"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="#6b7280" strokeWidth="1.3" />
      <path
        d="M12.5 12.5l2.5 2.5"
        stroke="#6b7280"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 3h10M4.5 7h5M6 11h2"
        stroke="#111827"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 3v8M5 11l-2-2M5 11l2-2M9 11V3M9 3l-2 2M9 3l2 2"
        stroke="#111827"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconDots() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="6" cy="2" r="1" fill="#6b7280" />
      <circle cx="6" cy="6" r="1" fill="#6b7280" />
      <circle cx="6" cy="10" r="1" fill="#6b7280" />
    </svg>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

export function Avatar({ name, fallback = "?", color = "#e2e8f0" }) {
  const initials = (name || fallback)
    .split(" ")
    .map((n) => n?.[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-semibold text-gray-600 shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
// Figma exact colors from design inspection

const STATUS_STYLES = {
  // Account statuses
  active: {
    bg: "#e8f8ef",
    color: "#069855",
    border: "#ccebd9",
    label: "Active",
  },
  disabled: {
    bg: "#fff1f1",
    color: "#b42318",
    border: "#f0d3d3",
    label: "Disabled",
  },
  // Absence statuses
  safe: { bg: "#e7f6ef", color: "#069855", border: "#c3ebd8", label: "Safe" },
  warning: {
    bg: "#ffeded",
    color: "#d62525",
    border: "#fbbfbf",
    label: "Warning",
  },
  excluded: {
    bg: "#ececec",
    color: "#111827",
    border: "#d4d4d4",
    label: "Exclu",
  },
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? {
    bg: "#f1f5f9",
    color: "#64748b",
    border: "#e2e8f0",
    label: status ?? "—",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 8px",
        height: 24,
        borderRadius: 4,
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: 12,
        letterSpacing: "-0.24px",
        whiteSpace: "nowrap",
      }}
    >
      {style.label}
    </span>
  );
}

// ─── YearBadge ───────────────────────────────────────────────────────────────

export function YearBadge({ value, className = "", style }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-[#dbe3ff] bg-[#eef3ff] px-2 py-0.5 text-[14px] font-medium text-[#143888] ${className}`.trim()}
      style={style}
    >
      {value || "—"}
    </span>
  );
}
