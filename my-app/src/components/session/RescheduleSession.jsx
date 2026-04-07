import { useState } from "react";

// Simple chevron icon
function ChevronDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 5L7 9L11 5"
        stroke="#898989"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Simple calendar icon
function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="2.5"
        width="11"
        height="10"
        rx="1.5"
        stroke="#898989"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 1.5V3.5M9.5 1.5V3.5M1.5 5.5H12.5"
        stroke="#898989"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RescheduleSession({ isOpen, session, onClose }) {
  const [date, setDate] = useState("21 - 03 - 2026");
  const [timeSlot, setTimeSlot] = useState("8:00 - 9:30");
  const [salle, setSalle] = useState("");
  const [extraGroup, setExtraGroup] = useState("");
  const [teacher, setTeacher] = useState("me");

  if (!isOpen) return null;

  const inputBase =
    "w-full bg-[#fbfcfc] border border-black/[0.06] rounded-[8px] px-3 py-[6px] text-sm text-[#898989] tracking-[0.15px] leading-6 outline-none focus:border-[#143888]/40 focus:ring-0 transition-colors";

  const selectBase =
    "w-full bg-[#fbfcfc] border border-black/[0.06] rounded-[8px] px-3 py-[6px] text-sm text-[#898989] tracking-[0.15px] leading-6 outline-none appearance-none focus:border-[#143888]/40 transition-colors cursor-pointer";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[5px]"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-black/6 rounded-[18px] shadow-[0px_0px_7px_0px_rgba(0,0,0,0.07)] w-fit p-6 flex flex-col gap-7"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-modal-title"
      >
        {/* Header */}
        <div className="flex flex-col gap-1.25">
          <h2
            id="reschedule-modal-title"
            className="text-[#143888] text-xl font-semibold leading-normal"
          >
            Reschedule Session
          </h2>
          <p className="text-sm text-black/60 leading-normal">
            Reschedule the session to another day
          </p>
        </div>

        {/* Row 1: Date · Time Slot · Salle */}
        <div className="flex gap-7.5 items-start">
          {/* Date */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <label className="text-sm font-medium text-black/80 tracking-[0.4px] leading-5">
              Date
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputBase} pr-8`}
                placeholder="DD - MM - YYYY"
              />
              <span className="absolute right-3 pointer-events-none">
                <CalendarIcon />
              </span>
            </div>
          </div>

          {/* Time Slot */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <label className="text-sm font-medium text-black/80 tracking-[0.4px] leading-5">
              Time Slot
            </label>
            <div className="relative flex items-center">
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className={`${selectBase} pr-8`}
              >
                <option value="8:00 - 9:30">8:00 - 9:30</option>
                <option value="9:30 - 11:00">9:30 - 11:00</option>
                <option value="11:00 - 12:30">11:00 - 12:30</option>
                <option value="13:00 - 14:30">13:00 - 14:30</option>
              </select>
              <span className="absolute right-3 pointer-events-none">
                <ChevronDown />
              </span>
            </div>
          </div>

          {/* Salle */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <label className="text-sm font-medium text-black/80 tracking-[0.4px] leading-5">
              Salle
            </label>
            <div className="relative flex items-center">
              <select
                value={salle}
                onChange={(e) => setSalle(e.target.value)}
                className={`${selectBase} pr-8`}
              >
                <option value="" disabled>
                  Select Salle
                </option>
                <option value="A1">Salle A1</option>
                <option value="A2">Salle A2</option>
                <option value="B1">Salle B1</option>
                <option value="B2">Salle B2</option>
              </select>
              <span className="absolute right-3 pointer-events-none">
                <ChevronDown />
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Group(s) · Teacher */}
        <div className="flex gap-7.5 items-start">
          {/* Group(s) */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <label className="text-sm font-medium text-black/80 tracking-[0.4px] leading-5">
              Group(s)
            </label>
            <div className="flex gap-4 items-center">
              {/* Fixed group badge */}
              <div className="bg-[#fbfcfc] border border-black/6 rounded-lg px-3 py-1.5 text-sm text-black tracking-[0.15px] leading-6 shrink-0 w-1/3">
                {session?.group && session?.groupNumber
                  ? `${session.group} ${session.groupNumber}`
                  : "G3"}
              </div>
              {/* Optional extra group selector */}
              <div className="relative flex items-center flex-1 min-w-0">
                <select
                  value={extraGroup}
                  onChange={(e) => setExtraGroup(e.target.value)}
                  className={`${selectBase} pr-8 overflow-hidden text-ellipsis`}
                >
                  <option value="">Add another session (optional)</option>
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                  <option value="G4">G4</option>
                </select>
                <span className="absolute right-3 pointer-events-none">
                  <ChevronDown />
                </span>
              </div>
            </div>
          </div>

          {/* Teacher */}
          <div className="flex flex-col gap-2 w-1/3 shrink-0">
            <label className="text-sm font-medium text-black/80 tracking-[0.4px] leading-5">
              Teacher
            </label>
            <div className="relative flex items-center">
              <select
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className={`${selectBase} pr-8`}
              >
                <option value="me">me</option>
                <option value="other">Other</option>
              </select>
              <span className="absolute right-3 pointer-events-none">
                <ChevronDown />
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-5 items-center">
          <button
            type="button"
            onClick={onClose}
            className="w-30 px-8 py-1.25 border-[1.3px] border-black/16 rounded-lg text-base font-medium text-[#898989] tracking-[0.15px] leading-6 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-30 px-8 py-1.25 bg-[#143888] rounded-lg text-base font-medium text-white tracking-[0.15px] leading-6 hover:bg-[#0f2d6e] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
