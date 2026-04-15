/**
 * components/shared/StatusBadge.jsx
 *
 * A small colored pill badge used to display a student's status
 * in the import preview table.
 *
 * Usage:
 *   <StatusBadge status="Safe" />    → green pill
 *   <StatusBadge status="Exclu" />   → red pill
 *
 * The colors come from STUDENT_STATUS_STYLES in constants.js
 * so if you ever change the colors, you only change them in one place.
 */

import { STUDENT_STATUS, STUDENT_STATUS_STYLES } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Icons — small SVGs shown inside the badge
// Keep them inline so the component stays a single file with no extra imports
// ─────────────────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 5L4 7L8 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3L7 7M7 3L3 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {object}  props
 * @param {string}  props.status  — "Safe" | "Exclu" (use STUDENT_STATUS constants)
 * @param {string}  [props.className] — optional extra CSS class
 */
export default function StatusBadge({ status, className = "" }) {
  // Look up the colors for this status.
  // If an unknown status is passed, fall back to a neutral grey.
  const styles = STUDENT_STATUS_STYLES[status] ?? {
    background: "#f1f5f9",
    color: "#475569",
  };

  const isSafe = status === STUDENT_STATUS.SAFE;
  const isExclu = status === STUDENT_STATUS.EXCLU;

  return (
    <span
      className={`status-badge ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "18px",
        whiteSpace: "nowrap",
        background: styles.background,
        color: styles.color,
      }}
      // Screen readers will announce "Safe" or "Exclu" naturally from the text,
      // but we add a role so assistive tech treats it as a status indicator
      role="status"
      aria-label={`Student status: ${status ?? "Unknown"}`}
    >
      {/* Icon — checkmark for Safe, X for Exclu, nothing for unknown */}
      {isSafe && <IconCheck />}
      {isExclu && <IconX />}

      {/* Label */}
      {status ?? "—"}
    </span>
  );
}