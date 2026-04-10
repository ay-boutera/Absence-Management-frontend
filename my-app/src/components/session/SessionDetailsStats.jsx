function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="#4a5567" strokeWidth="1.2" />
      <path
        d="M8 5v3l2 1.5"
        stroke="#4a5567"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconRoom() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="11"
        height="11"
        rx="1.5"
        stroke="#4a5567"
        strokeWidth="1.2"
      />
      <path
        d="M6 2.5v11M10 2.5v11M2.5 6h3.5M2.5 10h3.5M10 6h3.5M10 10h3.5"
        stroke="#4a5567"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGroup() {
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

function IconPresent() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#069855" strokeWidth="1.2" />
      <path
        d="M5 8.2l2 2 4-4"
        stroke="#069855"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconAbsent() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="#d62525" strokeWidth="1.2" />
      <path
        d="M5.5 5.5l5 5M10.5 5.5l-5 5"
        stroke="#d62525"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SessionDetailsStats({
  session,
  presentCount,
  absentCount,
  absenceRate,
}) {
  const firstGroupNumber = Number(session.groupNumber);
  const secondGroupNumber = Number.isNaN(firstGroupNumber)
    ? session.groupNumber
    : firstGroupNumber + 1;

  return (
    <div className="flex items-start gap-6">
      <div className="bg-white border border-[#e3e8ef] rounded-lg overflow-hidden w-1/4 shrink-0">
        <div className="flex items-center justify-between px-3.5 py-4 border-b border-[#e3e8ef] bg-white">
          <p className="text-[16px] font-medium text-black tracking-[-0.08px]">
            Absence Rate
          </p>
          <p className="text-[14px] text-[#4a5567] tracking-[-0.07px]">
            {absenceRate}%
          </p>
        </div>

        <div className="flex items-center justify-between p-3.5">
          <div className="flex gap-1.25 items-center">
            <IconPresent />
            <span className="text-[14px] text-[#069855] tracking-[-0.07px]">
              {presentCount}
            </span>
            <span className="text-[14px] text-[#069855] tracking-[-0.07px]">
              Present
            </span>
          </div>

          <div className="flex gap-1.25 items-center">
            <IconAbsent />
            <span className="text-[14px] text-[#d62525] tracking-[-0.07px]">
              {absentCount}
            </span>
            <span className="text-[14px] text-[#d62525] tracking-[-0.07px]">
              Absent
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e3e8ef] rounded-lg overflow-hidden w-2/4">
        <div className="flex items-center justify-between p-3.5 border-b border-[#e3e8ef] bg-white">
          <p className="text-[16px] font-medium text-black tracking-[-0.08px]">
            Session type :{" "}
            <span className="text-[14px] text-[#4a5567] tracking-[-0.07px]">
              {session.type}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between p-3.5">
          <div className="flex gap-1.25 items-center">
            <IconGroup />
            <span className="text-[14px] text-[#4a5567] tracking-[-0.07px]">
              group n˚:
            </span>
            <span className="text-[14px] text-[#030712] tracking-[-0.07px]">
              {session.groupNumber} <span className="text-[#4a5567]">&</span>{" "}
              {secondGroupNumber}
            </span>
          </div>

          <div className="flex gap-1.25 items-center">
            <IconClock />
            <span className="text-[14px] text-[#4a5567] tracking-[-0.07px]">
              {session.time}
            </span>
          </div>

          <div className="flex gap-1.25 items-center">
            <IconRoom />
            <span className="text-[14px] text-[#4a5567] tracking-[-0.07px]">
              {session.room}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
