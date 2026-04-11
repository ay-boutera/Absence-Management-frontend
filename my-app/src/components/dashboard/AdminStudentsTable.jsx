"use client";

import DataTable from "@/components/shared/DataTable";
import useDashboardTable from "@/hooks/useDashboardTable";
import {
  Avatar,
  StatusBadge,
  YearBadge,
  IconDots,
} from "@/components/shared/TableShared";

const COLUMNS = ["Name", "Student ID", "Year", "Group", "Absence", "Status", "Action"];
const PAGE_SIZE = 7;

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

function normalizeStudent(raw, index) {
  const firstName = raw?.first_name || "";
  const lastName = raw?.last_name || "";
  const fullName =
    raw?.name || `${firstName} ${lastName}`.trim() || `Student ${index + 1}`;

  const fallbackStudentId = raw?.id ? String(raw.id).slice(0, 8) : "";

  return {
    id: raw?.id || raw?.student_id || raw?.email || index,
    name: fullName,
    email: raw?.email || "",
    studentId: raw?.student_id || raw?.studentId || fallbackStudentId,
    year: raw?.year || raw?.level || "—",
    group: raw?.group || "",
    absence: raw?.absence ?? raw?.absences ?? raw?.absence_count ?? 0,
    status: raw?.status || (raw?.is_active ? "active" : "disabled"),
  };
}

export default function AdminStudentsTable({ students = [] }) {
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    normalizedItems: normalizedStudents,
    pagedItems: pagedStudents,
    totalCount,
  } = useDashboardTable({
    items: students,
    normalizeItem: normalizeStudent,
    searchFields: ["name", "email", "studentId", "group", "year"],
    pageSize: PAGE_SIZE,
  });

  return (
    <DataTable
      title="Total Students"
      count={normalizedStudents.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search name, id, year, group..."
      columns={COLUMNS}
      tableClass="admin-students-table"
      headerClass="admin-students-table__header-row"
      footerClass="admin-students-table__footer"
      emptyMessage="No students found."
      rowLabel="students"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
    >
      {pagedStudents.map((student) => (
        <StudentRow key={student.id} student={student} />
      ))}
    </DataTable>
  );
}
