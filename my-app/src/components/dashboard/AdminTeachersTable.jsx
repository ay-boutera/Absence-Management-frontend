"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// AdminTeachersTable.jsx
// ============================================

import { useMemo, useState } from "react";

const PAGE_SIZE = 7;
import DataTable from "@/components/shared/DataTable";
import {
  Avatar,
  IconDots,
} from "@/components/shared/TableShared";

const COLUMNS = ["Name", "Role", "Subjects", "Groups", "Action"];

function TeacherRow({ teacher }) {
  return (
    <div className="admin-teachers-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <Avatar name={teacher.name} fallback="Teacher" />
          <div className="admin-data-table__name-info">
            <p className="admin-data-table__name">{teacher.name}</p>
            <p className="admin-data-table__email">{teacher.email || "—"}</p>
          </div>
        </div>
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {teacher.role || "teacher"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {teacher.subject || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {teacher.groups || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        <button
          type="button"
          className="admin-data-table__action-btn"
          aria-label={`Actions for ${teacher.name}`}
        >
          <IconDots />
        </button>
      </div>
    </div>
  );
}

function normalizeTeacher(raw, index) {
  const firstName = raw?.first_name || "";
  const lastName = raw?.last_name || "";
  const fullName =
    raw?.name || `${firstName} ${lastName}`.trim() || `Teacher ${index + 1}`;

  const subject = Array.isArray(raw?.subjects)
    ? raw.subjects.filter(Boolean).join(", ")
    : (raw?.subject ?? raw?.subjects ?? "");

  const groups = Array.isArray(raw?.groups)
    ? raw.groups.filter(Boolean).join(", ")
    : (raw?.groups ?? raw?.group ?? "");

  return {
    id: raw?.id || raw?.email || index,
    name: fullName,
    email: raw?.email || "",
    role: raw?.role || "teacher",
    subject,
    groups,
  };
}

export default function AdminTeachersTable({ teachers = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const normalizedTeachers = useMemo(
    () => teachers.map((t, i) => normalizeTeacher(t, i)),
    [teachers],
  );

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return normalizedTeachers;
    return normalizedTeachers.filter((t) =>
      [t.name, t.email, t.role, t.subject, t.groups]
        .some((v) => String(v).toLowerCase().includes(query)),
    );
  }, [normalizedTeachers, searchQuery]);

  const handleSearch = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const pagedTeachers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTeachers.slice(start, start + PAGE_SIZE);
  }, [filteredTeachers, currentPage]);

  return (
    <DataTable
      title="Total Teachers"
      count={normalizedTeachers.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search by id or name"
      columns={COLUMNS}
      tableClass="admin-teachers-table"
      headerClass="admin-teachers-table__header-row"
      emptyMessage="No teachers found."
      pagination={{
        currentPage,
        totalItems: filteredTeachers.length,
        pageSize: PAGE_SIZE,
        onPageChange: setCurrentPage,
        entityName: "teachers",
      }}
    >
      {pagedTeachers.map((teacher) => (
        <TeacherRow key={teacher.id} teacher={teacher} />
      ))}
    </DataTable>
  );
}