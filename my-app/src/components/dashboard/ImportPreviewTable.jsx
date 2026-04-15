/**
 * components/dashboard/ImportPreviewTable.jsx
 *
 * Displays a paginated, searchable preview of CSV rows
 * before the admin clicks "Submit & save".
 *
 * Props:
 *   rows        {object[]}  — parsed CSV rows (array of plain objects)
 *   importType  {0|1|2}     — 0 = students, 1 = teachers, 2 = timetable
 *   pageSize    {number}    — optional, defaults to 7
 *
 * Usage (in admin/import/page.jsx):
 *   import ImportPreviewTable from "@/components/dashboard/ImportPreviewTable";
 *
 *   {file && previewRows.length > 0 && (
 *     <ImportPreviewTable rows={previewRows} importType={selectedOption} />
 *   )}
 */

"use client";

import { useState } from "react";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";
import { Avatar, IconDots } from "@/components/shared/TableShared";
import { STUDENT_STATUS } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#dbeafe",
  "#fce7f3",
  "#dcfce7",
  "#fef9c3",
  "#ede9fe",
  "#fee2e2",
  "#d1fae5",
  "#e0f2fe",
];
const avatarColor = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length];

/**
 * Determine the student status badge value.
 *
 * The CSV does not have a "status" column — status is derived at runtime.
 * Right now every freshly-imported student defaults to "Safe".
 * If your backend later returns a status field, swap the logic here.
 */
const resolveStudentStatus = (row) =>
  row.status === STUDENT_STATUS.EXCLU ? STUDENT_STATUS.EXCLU : STUDENT_STATUS.SAFE;

// ─────────────────────────────────────────────────────────────────────────────
// Session type color map (used in timetable rows)
// ─────────────────────────────────────────────────────────────────────────────

const TYPE_COLORS = {
  Cours:        { bg: "#dbeafe", color: "#1d4ed8" },
  TD:           { bg: "#dcfce7", color: "#15803d" },
  TP:           { bg: "#fef9c3", color: "#a16207" },
  "TD/TP":      { bg: "#ede9fe", color: "#6d28d9" },
  "Cours/TP":   { bg: "#e0f2fe", color: "#0369a1" },
  "Cours/TD/TP":{ bg: "#fce7f3", color: "#be185d" },
};
const typeStyle = (type) => TYPE_COLORS[type] ?? { bg: "#f1f5f9", color: "#475569" };

// ─────────────────────────────────────────────────────────────────────────────
// Per-import-type config
// Each entry declares:
//   label      — displayed in the DataTable title and search placeholder
//   columns    — header labels shown in the table
//   renderRow  — function(row, absoluteIndex) → JSX for a single data row
// ─────────────────────────────────────────────────────────────────────────────

const PREVIEW_CONFIG = {
  // ── 0: Students ──────────────────────────────────────────────────────────
  0: {
    label: "students",
    columns: ["Student", "Matricule", "Field", "Level", "Group", "Email", "Status", "Action"],
    renderRow: (row, i) => (
  <div key={i} className="admin-students-table__row">
    {/* Name + avatar */}
    <div className="admin-data-table__cell admin-data-table__cell--name">
      <div className="admin-data-table__name-wrap">
        <Avatar
          name={`${row.prenom ?? ""} ${row.nom ?? ""}`}
          color={avatarColor(i)}
        />
        <div className="admin-data-table__name-info">
          <p className="admin-data-table__name">
            {row.prenom ?? "—"} {row.nom ?? "—"}
          </p>
          <p className="admin-data-table__email">
            {row.email ?? "—"}
          </p>
        </div>
      </div>
    </div>

    <div className="admin-data-table__cell admin-data-table__text-cell">
      {row.matricule ?? "—"}
    </div>

    <div className="admin-data-table__cell admin-data-table__text-cell">
      {row.filiere ?? "—"}
    </div>

    <div className="admin-data-table__cell admin-data-table__text-cell">
      {row.niveau ?? "—"}
    </div>

    <div className="admin-data-table__cell admin-data-table__text-cell">
      {row.groupe ?? "—"}
    </div>

    <div className="admin-data-table__cell admin-data-table__text-cell">
      {row.email ?? "—"}
    </div>

    <div className="admin-data-table__cell">
      <StatusBadge status={resolveStudentStatus(row)} />
    </div>

    
  </div>
)

  },

  // ── 1: Teachers ───────────────────────────────────────────────────────────
  1: {
    label: "teachers",
    columns: ["Teacher", "ID", "Email", "Grade", "Department", "Action"],
    renderRow: (row, i) => (
      <div key={i} className="import-preview-table__row">
        <div className="admin-data-table__cell admin-data-table__cell--name">
          <div className="admin-data-table__name-wrap">
            <Avatar
              name={`${row.prenom ?? ""} ${row.nom ?? ""}`}
              color={avatarColor(i)}
            />
            <div className="admin-data-table__name">
              {row.prenom ?? "—"} {row.nom ?? "—"}
            </div>
          </div>
        </div>

        <div className="admin-data-table__cell admin-data-table__text-cell">
          {row.id_enseignant ?? "—"}
        </div>
        <div className="admin-data-table__cell admin-data-table__text-cell">
          {row.email ?? "—"}
        </div>
        <div className="admin-data-table__cell admin-data-table__text-cell">
          {row.grade ?? "—"}
        </div>
        <div className="admin-data-table__cell admin-data-table__text-cell">
          {row.departement ?? "—"}
        </div>

        <div className="admin-data-table__cell admin-data-table__cell--action">
          <button
            type="button"
            className="admin-data-table__action-btn"
            aria-label="Row actions"
          >
            <IconDots />
          </button>
        </div>
      </div>
    ),
  },

  // ── 2: Timetable ──────────────────────────────────────────────────────────
  2: {
    label: "timetable",
    columns: [
      "Year", "Section / Speciality", "Semester",
      "Day", "Time", "Type", "Subject", "Teacher", "Room", "Group", "Action",
    ],
    renderRow: (row, i) => {
      // Section or speciality — prefer speciality, fall back to "Section X"
      const sectionOrSpeciality =
        row.speciality?.trim()
          ? row.speciality.trim()
          : row.section?.trim()
          ? `Section ${row.section.trim()}`
          : "—";

      // Time range
      const time =
        row.time_start && row.time_end
          ? `${row.time_start} – ${row.time_end}`
          : row.time_start || "—";

      const style = typeStyle(row.type);

      return (
        <div key={i} className="import-preview-table__row">
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {row.year ?? "—"}
          </div>
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {sectionOrSpeciality}
          </div>
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {row.semester ?? "—"}
          </div>
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {row.day ?? "—"}
          </div>
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {time}
          </div>

          {/* Session type pill */}
          <div className="admin-data-table__cell admin-data-table__text-cell">
            <div
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                background: style.bg,
                color: style.color,
              }}
            >
              {row.type ?? "—"}
            </div>
          </div>

          <div className="admin-data-table__cell admin-data-table__text-cell">
            {row.subject ?? "—"}
          </div>
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {row.teacher ?? "—"}
          </div>
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {row.room ?? "—"}
          </div>

          {/* Group — show "All" in muted italic when empty */}
          <div className="admin-data-table__cell admin-data-table__text-cell">
            {row.group?.trim() ? (
              row.group.trim()
            ) : (
              <div style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 12 }}>
                All
              </div>
            )}
          </div>

          <div className="admin-data-table__cell admin-data-table__cell--action">
            <button
              type="button"
              className="admin-data-table__action-btn"
              aria-label="Row actions"
            >
              <IconDots />
            </button>
          </div>
        </div>
      );
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ImportPreviewTable
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 7;

/**
 * @param {object}    props
 * @param {object[]}  props.rows        — array of plain objects from parseCSV()
 * @param {0|1|2}     props.importType  — matches selectedOption in the import page
 * @param {number}    [props.pageSize]  — rows per page (default: 7)
 */
export default function ImportPreviewTable({
  rows,
  importType,
  pageSize = DEFAULT_PAGE_SIZE,
}) {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");

  const config = PREVIEW_CONFIG[importType];

  // Guard: unknown type or empty data → render nothing
  if (!config || !rows?.length) return null;

  // ── Filter ───────────────────────────────────────────────────────────────
  const filtered = search
    ? rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : rows;

  // ── Paginate ─────────────────────────────────────────────────────────────
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Search handler (also resets to page 1) ───────────────────────────────
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div style={{ marginTop: 24 }}>
      <DataTable
        title={`Preview — ${config.label}`}
        count={filtered.length}
        searchQuery={search}
        onSearch={handleSearch}
        placeholder={`Search ${config.label}…`}
        columns={config.columns}
        tableClass={`import-preview-table import-preview-table--${config.label}`}
        headerClass="import-preview-table__header-row"
        footerClass="import-preview-table__footer"
        emptyMessage={`No ${config.label} match your search.`}
        rowLabel={config.label}
        page={page}
        pageSize={pageSize}
        totalCount={filtered.length}
        onPageChange={setPage}
      >
        {pageRows.map((row, i) =>
          config.renderRow(row, (page - 1) * pageSize + i),
        )}
      </DataTable>
    </div>
  );
}