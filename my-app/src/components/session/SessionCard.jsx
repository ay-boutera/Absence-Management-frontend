"use client";

import { useState, useRef, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4a5567"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const RoomIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4a5567"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#4a5567"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DotsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#374151">
    <circle cx="12" cy="5" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="12" cy="19" r="2" />
  </svg>
);

const XIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#374151"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

// ─── CardDropdown ─────────────────────────────────────────────────────────────

function CardDropdown({ onClose, onReschedule, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="sc-overlay">
      <button className="sc-overlay__close" onClick={onClose}>
        <XIcon />
      </button>
      <div ref={ref} className="sc-overlay__menu">
        <button
          className="sc-overlay__item sc-overlay__item--blue"
          onClick={() => {
            onReschedule?.();
            onClose();
          }}
        >
          Reschedule session
        </button>
        <hr className="sc-overlay__divider" />
        <button
          className="sc-overlay__item sc-overlay__item--red"
          onClick={() => {
            onCancel?.();
            onClose();
          }}
        >
          Cancel session
        </button>
      </div>
    </div>
  );
}

// ─── SessionCard ──────────────────────────────────────────────────────────────

export default function SessionCard({
  id,
  title = "Data Structures",
  type = "TD",
  time = "08:00 — 09:30",
  room = "Salle A2 — Sup",
  group = "CP1 — group",
  groupNumber = "3",
  onStartSession,
  onReschedule,
  onCancel,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`session-card ${menuOpen ? "session-card--blur" : ""}`}>
      {/* Header */}
      <div className="session-card__header">
        <div className="session-card__header-info">
          <h3 className="session-card__title">{title}</h3>
          <span className="session-card__type">
            {type} • ID {id}
          </span>
        </div>
        <button
          className="session-card__dots-btn"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <XIcon /> : <DotsIcon />}
        </button>
      </div>

      {/* Meta */}
      <div className="session-card__meta">
        <span className="session-card__meta-row">
          <ClockIcon />
          {time}
        </span>
        <span className="session-card__meta-row">
          <RoomIcon />
          {room}
        </span>
        <span className="session-card__meta-row">
          <UsersIcon />
          <span className="session-card__meta-group">
            {group && groupNumber ? `${group} ${groupNumber}` : "G3"}
          </span>
        </span>
      </div>

      {/* Footer */}
      <div className="session-card__footer">
        <button className="session-card__start-btn" onClick={onStartSession}>
          Start session <ArrowUpRightIcon />
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <CardDropdown
          onClose={() => setMenuOpen(false)}
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}
