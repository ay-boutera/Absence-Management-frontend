"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import api from "@/services/api";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.75 15.7501L12.495 12.4951" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.25 8.25C2.25 11.5615 4.93851 14.25 8.25 14.25C11.5615 14.25 14.25 11.5615 14.25 8.25C14.25 4.93851 11.5615 2.25 8.25 2.25C4.93851 2.25 2.25 4.93851 2.25 8.25V8.25" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M4 6l4 4 4-4"
      stroke="#000"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LEVELS = ["1CP", "2CP", "1CS", "2CS", "3CS"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const TIME_SLOTS = [ "08:00 - 09:30","09:30 - 11:00","11:00 - 12:30","14:00 - 15:30","15:30 - 17:00"];
const SLOT_MAP = {"08:00": 0,"09:30": 1,"11:00": 2,"14:00": 3,"15:30": 4,};

const GROUP_COLOR = {
  G1: "yellow",
  G2: "teal2",
  G3: "purple",
  G4: "pink",
  G5: "blue",
  G6: "lightYellow",
  G7: "orange",
  G8: "red",
};

const MODULE_COLOR = {"ARCHI-EVO":  "teal",
  "IA-INTRO":   "purple",
  "DEV-WEB":    "blue",
  "SECU":       "orange",
  "BD-ANALYSE": "lightYellow",
  "CLOUD":      "teal2",
  "UX-UI":      "pink",
  "ALGO":       "yellow",
  "MATH":       "red",
};

function extractLevel(id_seance) {
  return id_seance.split("-")[0];
}

function extractGroup(id_seance) {
  const parts = id_seance.split("-");
  if (parts[1] && /^G\d+$/.test(parts[1])) return parts[1];
  return null;
}

function dateToDayIndex(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.getDay(); // 0=Sun,1=Mon,…,4=Thu
}

function mapSession(raw, teacherMap) {
  const level  = extractLevel(raw.id_seance);
  const group  = extractGroup(raw.id_seance);
  const isCollectif = raw.id_seance.includes("-COLL-");

  let type, groupLabel, colorKey;

  if (raw.type_seance === "cours") {
    type       = "Cours";
    groupLabel = level;
    colorKey   = MODULE_COLOR[raw.code_module] || "teal";
  } else if (isCollectif) {
    type       = "TD collectif";
    groupLabel = `${level}–G5`;
    colorKey   = "yellow";
  } else {
    type       = raw.type_seance.toUpperCase(); // "TD" or "TP"
    groupLabel = group || level;
    colorKey   = GROUP_COLOR[group] || "teal";
  }

  const teacher = teacherMap[raw.id_enseignant] || "";

  return {
    level,
    day:      dateToDayIndex(raw.date),   // 0–4 (Sun–Thu)
    slot:     SLOT_MAP[raw.heure_debut],  // 0–4
    type,
    group:    groupLabel,
    subject:  raw.nom_module,
    teacher,
    room:     raw.salle,
    colorKey,
  };
}

export default function TimetablePage() {
  const [activeLevel,   setActiveLevel]   = useState("1CP");
  const [search,        setSearch]        = useState("");
  const [groupFilter,   setGroupFilter]   = useState("All groups");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");

  const [sessions,  setSessions]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  // ── Fetch all sessions + teachers once ──────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [planRes, teachRes] = await Promise.all([
          api.get("/v1/planning?page_size=100"),
          api.get("/v1/accounts/teachers"),
        ]);

        // Build UUID → "Prénom NOM" map
        const teacherMap = {};
        (teachRes.data || []).forEach((t) => {
          teacherMap[t.id] = `${t.first_name} ${t.last_name}`;
        });

        const items = planRes.data?.items ?? planRes.data ?? [];
        setSessions(items.map((s) => mapSession(s, teacherMap)));
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load timetable.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ── Derived filter values ────────────────────────────────────────────────────
  const levelSessions = useMemo(
    () => sessions.filter((s) => s.level === activeLevel),
    [sessions, activeLevel]
  );

  const allGroups = useMemo(() => {
    const set = new Set(levelSessions.map((s) => s.group).filter((g) => /^G\d+$/.test(g)));
    return ["All groups", ...Array.from(set).sort()];
  }, [levelSessions]);

  const allSubjects = useMemo(() => {
    const set = new Set(levelSessions.map((s) => s.subject));
    return ["All subjects", ...Array.from(set).sort()];
  }, [levelSessions]);

  const filtered = useMemo(() => {
    return levelSessions.filter((s) => {
      if (groupFilter !== "All groups" && s.group !== groupFilter) return false;
      if (subjectFilter !== "All subjects" && s.subject !== subjectFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.subject?.toLowerCase().includes(q) &&
          !s.teacher?.toLowerCase().includes(q) &&
          !s.room?.toLowerCase().includes(q) &&
          !s.group?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [levelSessions, groupFilter, subjectFilter, search]);

  /** Return sessions for a specific cell (dayIdx × slotIdx). */
  const getSessions = (dayIdx, slotIdx) =>
    filtered.filter((s) => s.day === dayIdx && s.slot === slotIdx);

  return (
    <div className="main-page">

      {/* ── Page header ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Timetable</h2>
          <p className="main-subtitle">Weekly schedule for the semester</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-[14px]">

        {/* Row 1: Level tabs + semester buttons */}
        <div className="flex items-end justify-between gap-4">
          {/* Level pills */}
          <div className="flex items-center gap-[10px]">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => { setActiveLevel(level); setGroupFilter("All groups"); setSubjectFilter("All subjects"); setSearch(""); }}
                className={`px-3 py-1.5 text-[14px] rounded-lg border transition-colors leading-[14px] ${
                  activeLevel === level
                    ? "bg-[#EBEFFE] border-[#143888] text-[#143888]"
                    : "bg-white border-[#E3E8EF] text-[#999999]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Semester tabs */}
          <div className="flex items-center gap-[10px]">
            <button className="px-3 py-[6px] text-[14px] rounded-lg border bg-[#F8FAFF] border-[#143888] text-[#143888]">
              Semester 1
            </button>
            <button className="px-3 py-[6px] text-[14px] rounded-lg border bg-[#F8FAFF] border-[#E3E8EF] text-[rgba(0,0,0,0.26)]">
              Semester 2
            </button>
          </div>
        </div>

        {/* Row 2: Search + Group + Subject filters */}
        <div className="flex items-center gap-[10px]">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-[8px] bg-[#F8FAFF] border border-[#E6EBF0] rounded-lg">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[14px] bg-transparent outline-none text-[#6B7280] w-[220px]"
            />
          </div>

          {/* Group dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-[8px] bg-[#F8FAFF] border border-[#E2E8F0] rounded-lg text-[14px] text-black">
              {groupFilter}
              <ChevronDownIcon />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10 min-w-full hidden group-focus-within:block">
              {allGroups.map((g) => (
                <button
                  key={g}
                  onClick={() => setGroupFilter(g)}
                  className={`block w-full text-left px-3 py-2 text-[14px] hover:bg-[#F8FAFF] ${groupFilter === g ? "text-[#143888]" : "text-black"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Subject dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-[8px] bg-[#F8FAFF] border border-[#E2E8F0] rounded-lg text-[14px] text-black">
              {subjectFilter}
              <ChevronDownIcon />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-10 min-w-full hidden group-focus-within:block">
              {allSubjects.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubjectFilter(s)}
                  className={`block w-full text-left px-3 py-2 text-[14px] hover:bg-[#F8FAFF] ${subjectFilter === s ? "text-[#143888]" : "text-black"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Loading / Error states ── */}
      {loading && (
        <div className="text-center py-12 text-[14px] text-[#6B7280]">Loading timetable…</div>
      )}
      {error && (
        <div className="text-center py-12 text-[14px] text-red-500">{error}</div>
      )}

      {/* ── Timetable grid ── */}
      {!loading && !error && (
        <div className="border border-[#E3E8EF] rounded-lg overflow-x-auto bg-white w-full">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px repeat(5, minmax(200px, 1fr))",
              width: "max-content",
              minWidth: "100%",
            }}
          >
            {/* ── Header row ── */}
            <div className="p-3 bg-[#F8FAFF] border-b border-r border-[#E3E8EF] text-[14px] text-black">
              Time
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="p-3 bg-[#F8FAFF] border-b border-l border-[#E3E8EF] text-[14px] text-black text-center"
              >
                {day}
              </div>
            ))}

            {/* ── Data rows ── */}
            {TIME_SLOTS.map((slot, slotIdx) => (
              <Fragment key={slotIdx}>
                {/* Time label */}
                <div className="px-3 pt-4 pb-3 border-b border-r border-dashed border-[#E3E8EF] text-[14px] text-[#4A5567]">
                  {slot}
                </div>

                {/* Day cells */}
                {DAYS.map((_, dayIdx) => {
                  const cellSessions = getSessions(dayIdx, slotIdx);
                  return (
                    <div
                      key={dayIdx}
                      className="p-2 border-b border-l border-dashed border-[#E3E8EF] flex flex-col gap-2"
                    >
                      {cellSessions.map((session, i) => (
                        <TimetableBlock key={i} session={session} />
                      ))}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ── Legend ── */}
      {!loading && !error && (
        <div className="flex items-center gap-7 pb-2">
          <div className="flex items-center gap-[6px]">
            <span className="w-3 h-3 rounded-full inline-block bg-[#337E89]" />
            <span className="text-[14px] text-[#337E89]">Cours</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="w-3 h-3 rounded-full inline-block bg-[#F6C420]" />
            <span className="text-[14px] text-[#F6C420]">TD</span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="w-3 h-3 rounded-full inline-block bg-[#8A38F5]" />
            <span className="text-[14px] text-[#8A38F5]">TP</span>
          </div>
        </div>
      )}

    </div>
  );
}
