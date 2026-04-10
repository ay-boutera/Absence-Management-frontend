"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// SessionStudentsTable.jsx
// ============================================

import { useMemo, useState } from "react";
import { Avatar, IconDots, IconSearch, IconGroup } from "@/components/shared/TableShared";

const PARTICIPATION_OPTIONS = ["A", "B", "C", "D", "F"];

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CheckboxCell({ checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      aria-label={checked ? "Mark as absent" : "Mark as present"}
      className={`size-5 rounded flex items-center justify-center border ${
        checked ? "bg-[#143888] border-[#143888]" : "bg-white border-[#e3e8ef]"
      }`}
    >
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path
            d="M1 4l3 3 6-6"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function StudentRow({ student, onTogglePresent, onGradeChange }) {
  return (
    <div className="flex h-16 items-center border-b border-[#e3e8ef] last:border-b-0">
      <div className="flex h-full items-center px-4 w-65 shrink-0">
        <div className="flex gap-2 items-center">
          <Avatar name={student.name} fallback="Student" color={student.avatarColor} size={11} />
          <div className="flex flex-col">
            <span className="text-[16px] text-[#030712] leading-5 tracking-[-0.24px]">
              {student.name}
            </span>
            <span className="text-[12px] text-[#4a5567] leading-normal tracking-[0.66px]">
              {student.email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 h-full items-center pl-4 pr-6 min-w-0">
        <span className="text-[12px] text-[#434345] tracking-[-0.24px]">
          {student.studentId}
        </span>
      </div>

      <div className="flex flex-1 h-full items-center pl-4 pr-6 min-w-0">
        <CheckboxCell
          checked={student.present}
          onToggle={() => onTogglePresent(student.id)}
        />
      </div>

      <div className="flex flex-1 h-full items-center pl-4 pr-6 min-w-0">
        <select
          value={student.grade}
          onChange={(e) => onGradeChange(student.id, e.target.value)}
          className="h-7 border border-[#e5e9f0] rounded px-2 text-[12px] text-black tracking-[-0.24px] bg-white"
        >
          {PARTICIPATION_OPTIONS.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
      </div>

      <div className="flex h-full items-center pl-4 pr-6 w-17 shrink-0 justify-end">
        <button className="border border-[#e3e8ef] rounded size-6 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <IconDots />
        </button>
      </div>
    </div>
  );
}

export default function SessionStudentsTable({ session, students, onStudentsChange }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleTogglePresent = (studentId) => {
    const updated = students.map((s) =>
      s.id === studentId ? { ...s, present: !s.present } : s,
    );
    onStudentsChange?.(updated);
  };

  const handleGradeChange = (studentId, newGrade) => {
    const updated = students.map((s) =>
      s.id === studentId ? { ...s, grade: newGrade } : s,
    );
    onStudentsChange?.(updated);
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((s) =>
      [s.name, s.email, String(s.studentId ?? "")]
        .some((v) => v.toLowerCase().includes(query)),
    );
  }, [students, searchQuery]);

  return (
    <div className="border border-[#e3e8ef] rounded-lg overflow-hidden mr-3">
      {/* ── Toolbar ── */}
      <div className="bg-[#f8faff] border-b border-[#e3e8ef] flex items-center justify-between px-4 py-3">
        <div className="flex gap-2 items-center">
          <div className="bg-white border border-[#e3e8ef] rounded-md size-7.5 flex items-center justify-center">
            <IconGroup />
          </div>
          <span className="text-[16px] font-medium text-black">
            Group {session.groupNumber}
          </span>
        </div>

        <div className="flex gap-3 items-center">
          <div className="bg-white border border-[#e3e8ef] rounded-md flex gap-3 items-center px-4 py-2 w-70.5">
            <IconSearch />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, id..."
              className="w-full bg-transparent text-[14px] text-[#111827] placeholder:text-[#6b7280] outline-none"
            />
          </div>

          <button className="bg-white border border-[#e3e8ef] rounded-lg h-9 flex gap-1.5 items-center px-3 text-[14px] text-black hover:bg-gray-50 transition-colors">
            Add a group <IconPlus />
          </button>

          <button className="bg-white border border-[#e3e8ef] rounded-lg h-9 flex gap-1.5 items-center px-3 text-[14px] text-black hover:bg-gray-50 transition-colors">
            Add a student <IconPlus />
          </button>
        </div>
      </div>

      {/* ── Column headers ── */}
      <div className="bg-[#f8faff] border-b border-[#e6ebf0] flex h-9 items-center">
        {["Name", "Student ID", "Present", "Participation", "Action"].map((col, i) => (
          <div
            key={col}
            className={`flex h-full items-center px-4 ${
              i === 0 ? "w-65 shrink-0" : i === 4 ? "w-17 shrink-0 justify-end pr-6" : "flex-1 min-w-0"
            }`}
          >
            <span className="text-[14px] text-[#4a5567] font-semibold leading-normal">
              {col}
            </span>
          </div>
        ))}
      </div>

      {/* ── Rows ── */}
      {filteredStudents.map((student) => (
        <StudentRow
          key={student.id}
          student={student}
          onTogglePresent={handleTogglePresent}
          onGradeChange={handleGradeChange}
        />
      ))}

      {!filteredStudents.length && (
        <div className="h-16 flex items-center justify-center text-[13px] text-[#6b7280]">
          No students found.
        </div>
      )}
    </div>
  );
}