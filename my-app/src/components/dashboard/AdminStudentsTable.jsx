"use client";
// ============================================
// AMS — ESI Sidi Bel Abbès
// AdminStudentsTable.jsx
// ============================================
import { useMemo, useState } from "react";
import DataTable from "@/components/shared/DataTable";
import {
  Avatar,
  StatusBadge,
  YearBadge,
  IconDots,
} from "@/components/shared/TableShared";

const COLUMNS = ["Name", "Student ID", "Year", "Group", "Absence", "Status", "Action"];

function StudentRow({ student }) {
  return (
    <div className="admin-students-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <Avatar name={student.name} fallback="Student" />
          <div className="admin-data-table__name-info">
            <p className="admin-data-table__name">{student.name}</p>
            <p className="admin-data-table__email">{student.email || "—"}</p>
          </div>
        </div>
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.studentId || "—"}
      </div>
      <div className="admin-data-table__cell">
        <YearBadge value={student.year} />
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.group || "—"}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {student.absence}
      </div>
      <div className="admin-data-table__cell">
        <StatusBadge status={student.status} />
      </div>
      <div className="admin-data-table__cell admin-data-table__cell--action">
        <button
          type="button"
          className="admin-data-table__action-btn"
          aria-label={`Actions for ${student.name}`}
        >
          <IconDots />
        </button>
      </div>
    </div>
  );
}

/**
 * AccountResponse shape from GET /api/v1/accounts/students:
 * {
 *   id,           ← UUID
 *   email,        ← top-level ✓
 *   first_name,   ← top-level ✓
 *   last_name,    ← top-level ✓
 *   is_active,    ← top-level ✓
 *   student_profile: {   ← null until backend adds selectinload
 *     student_id,        ← matricule
 *     level,             ← e.g. "CP1"
 *     group,             ← e.g. "G1"
 *     program,           ← filiere
 *   }
 * }
 */
function normalizeStudent(raw, index) {
  const profile     = raw?.student_profile ?? {};
  const firstName   = raw?.first_name ?? "";
  const lastName    = raw?.last_name  ?? "";
  const fullName    = `${firstName} ${lastName}`.trim() || `Student ${index + 1}`;

  return {
    id:        raw?.id ?? index,
    name:      fullName,
    email:     raw?.email ?? "",
    // matricule: prefer nested profile, fall back to first 8 chars of UUID
    studentId: profile?.student_id ?? (raw?.id ? String(raw.id).slice(0, 8) : "—"),
    year:      profile?.level   ?? profile?.program ?? "—",
    group:     profile?.group   ?? "—",
    absence:   raw?.absence ?? raw?.absences ?? raw?.absence_count ?? 0,
    status:    raw?.status  ?? (raw?.is_active ? "active" : "disabled"),
  };
}

export default function AdminStudentsTable({ students = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedStudents = useMemo(
    () => students.map((s, i) => normalizeStudent(s, i)),
    [students],
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return normalizedStudents;
    return normalizedStudents.filter((s) =>
      [s.name, s.email, String(s.studentId), String(s.group), String(s.year)]
        .some((v) => v.toLowerCase().includes(query)),
    );
  }, [normalizedStudents, searchQuery]);

  return (
    <DataTable
      title="Total Students"
      count={normalizedStudents.length}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      placeholder="Search name, id, year, group..."
      columns={COLUMNS}
      tableClass="admin-students-table"
      headerClass="admin-students-table__header-row"
      emptyMessage="No students found."
    >
      {filteredStudents.map((student) => (
        <StudentRow key={student.id} student={student} />
      ))}
    </DataTable>
  );
}