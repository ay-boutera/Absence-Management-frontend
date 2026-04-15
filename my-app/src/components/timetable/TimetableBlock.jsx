"use client";

const COLOR_MAP = {
  teal:        { bg: "rgba(51, 126, 137, 0.09)", label: "#337E89" },
  teal2:       { bg: "#EDF3F4",                  label: "#337E89" },
  yellow:      { bg: "rgba(246, 196, 32, 0.09)", label: "#F6C420" },
  purple:      { bg: "#F2EDFE",                  label: "#6B39F8" },
  pink:        { bg: "#FEEDF5",                  label: "#F83995" },
  blue:        { bg: "#F8FAFF",                  label: "#143888" },
  lightYellow: { bg: "#FEFAEB",                  label: "#B8860B" },
  orange:      { bg: "#FCF3EB",                  label: "#C46A00" },
  red:         { bg: "#FEEDED",                  label: "#D62525" },
};

export default function TimetableBlock({ session }) {
  const { type, group, subject, teacher, room, colorKey } = session;
  const colors = COLOR_MAP[colorKey] || COLOR_MAP.teal;

  if (type === "Cours") {
    return (
      <div style={{ backgroundColor: colors.bg }} className="rounded p-2 flex flex-col gap-1.5 w-full">
        <div className="flex items-center justify-between gap-1">
          <span style={{ color: colors.label }} className="text-[11px] font-semibold leading-none">
            {type}
          </span>
          <span
            className="text-[10px] leading-4.5 px-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.5)" }}
          >
            {group}
          </span>
        </div>
        <span className="text-[11px] text-black leading-tight line-clamp-2">{subject}</span>
        <span className="text-[11px] text-black leading-none">{teacher}</span>
        <span className="text-[10px] leading-none" style={{ color: "rgba(0,0,0,0.4)" }}>
          {room}
        </span>
      </div>
    );
  }

  if (type === "TD collectif") {
    return (
      <div style={{ backgroundColor: colors.bg }} className="rounded p-2 flex flex-col gap-1.5 w-full">
        <div className="flex items-center gap-1.5">
          <span style={{ color: colors.label }} className="text-[11px] font-semibold leading-none">
            {type}
          </span>
          <span
            className="text-[10px] leading-4.5 px-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.5)" }}
          >
            {group}
          </span>
        </div>
        <span className="text-[11px] text-black leading-none">{subject}</span>
        <span className="text-[10px] leading-none" style={{ color: "rgba(0,0,0,0.4)" }}>
          {room}
        </span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg }} className="rounded p-2 flex flex-col gap-1.5 w-full">
      <span className="text-[11px] text-black leading-tight line-clamp-1">
        {group}: {subject}
      </span>
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] text-black leading-none truncate">{teacher}</span>
        <span className="text-[10px] leading-none shrink-0" style={{ color: "rgba(0,0,0,0.3)" }}>
          {room}
        </span>
      </div>
    </div>
  );
}
