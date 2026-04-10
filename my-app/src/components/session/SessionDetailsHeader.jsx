"use client";

import { useState } from "react";

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5 8l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconQr() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="2"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="9"
        y="2"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="2"
        y="9"
        width="5"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M9 9h2M13 9v2M11 11h2v2M9 13h2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconFace() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 5V3.5A1.5 1.5 0 013.5 2H5M11 2h1.5A1.5 1.5 0 0114 3.5V5M14 11v1.5A1.5 1.5 0 0112.5 14H11M5 14H3.5A1.5 1.5 0 012 12.5V11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="6" cy="7" r="1" fill="currentColor" />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
      <path
        d="M5.5 10.5c.6.8 1.3 1 2.5 1s1.9-.2 2.5-1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const MODES = [
  { key: "manual", label: "Manual", Icon: IconCheck },
  { key: "qr", label: "QR Code", Icon: IconQr },
  { key: "facial", label: "Facial", Icon: IconFace },
];

export default function SessionDetailsHeader({ session }) {
  const [activeMode, setActiveMode] = useState("manual");
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleModeClick = (modeKey) => {
    setActiveMode(modeKey);
    if (modeKey === "qr") {
      setIsQrOpen(true);
    }
  };

  return (
    <div className="main-header">
      <div className="main-header-text">
        <h2 className="main-title">
          {session.title} {session.group} {session.groupNumber}
        </h2>
        <p className="main-subtitle">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex gap-3 items-center">
        {MODES.map(({ key, label, Icon }) => {
          const isActive = activeMode === key;

          return (
            <button
              key={key}
              onClick={() => handleModeClick(key)}
              className={`flex gap-1.5 h-9 items-center justify-center px-3 text-[14px] tracking-[0.14px] rounded-lg ${
                isActive
                  ? "bg-[#f8faff] border border-[#143888] text-[#143888]"
                  : "bg-white border border-[#e3e8ef] text-black/20"
              }`}
            >
              <Icon />
              {label}
            </button>
          );
        })}
      </div>

      {isQrOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md"
          onClick={() => setIsQrOpen(false)}
        >
          <div
            className="relative w-full max-w-1/4 rounded-xl border border-[#e3e8ef] bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsQrOpen(false)}
              className="absolute right-4 top-4 text-[#6b7280] hover:text-[#143888]"
              aria-label="Close QR modal"
            >
              <IconClose />
            </button>

            <h3 className="text-2xl font-semibold text-[#101828] leading-tight">
              QR Code Attendance
            </h3>
            <p className="mt-1 text-md leading-relaxed text-[#6b7280]">
              Students scan this QR code with their mobile app to mark
              attendance
            </p>

            <div className="mt-5 flex justify-center">
              <div className="rounded-xl border border-dashed border-[#b7c3ea] p-4 text-[#6f84be]">
                <svg width="200" height="200" viewBox="0 0 120 120" fill="none">
                  <rect
                    x="8"
                    y="8"
                    width="30"
                    height="30"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="7"
                  />
                  <rect
                    x="82"
                    y="8"
                    width="30"
                    height="30"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="7"
                  />
                  <rect
                    x="82"
                    y="82"
                    width="30"
                    height="30"
                    rx="6"
                    stroke="currentColor"
                    strokeWidth="7"
                  />
                  <path
                    d="M8 56h9M29 56h9M56 8v30M56 50v9M8 82h30M8 104h30M50 60h9M69 60h9M50 78h9M69 78h9M56 96v16"
                    stroke="currentColor"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-4 text-center text-md text-[#6b7280]">
              Code expires in 5 minutes
            </p>

            <div className="mt-3 flex justify-center">
              <button
                type="button"
                className="h-10 rounded-lg border border-[#d7deea] bg-white px-4 text-[18px] text-[#475467] hover:bg-[#f8faff]"
              >
                Refresh code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
