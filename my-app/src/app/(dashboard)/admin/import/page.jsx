"use client";

import { useState, useRef, useCallback } from "react";
import ImportButton from "@/components/dashboard/ImportButton";
import ImportErrorReportModal from "@/components/dashboard/ImportErrorReportModal";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import CriticalErrorNotification from "@/components/import/CriticalErrorNotification";
import DataTable from "@/components/shared/DataTable";
import { Avatar, IconDots } from "@/components/shared/TableShared";
import * as importService from "@/services/importService";

// ── CSV parser ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim().toLowerCase());

  const rows = lines.slice(1).map((line) => {
    const cells = line.split(sep);
    return Object.fromEntries(
      headers.map((h, i) => [h, cells[i]?.trim() ?? ""]),
    );
  });

  return { headers, rows };
}

// ── Avatar color pool ────────────────────────────────────────────────────────
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

// ── Per-import-type config ───────────────────────────────────────────────────
const PREVIEW_CONFIG = {
  0: {
    label: "students",
    columns: [
      "Student",
      "Matricule",
      "Field",
      "Level",
      "Group",
      "Email",
      "Action",
    ],
    renderRow: (row, i) => (
      <div key={i} className="import-preview-table__row">
        <span className="admin-data-table__cell admin-data-table__cell--name">
          <div className="admin-data-table__name-wrap">
            <Avatar
              name={`${row.prenom ?? ""} ${row.nom ?? ""}`}
              color={avatarColor(i)}
            />
            <span className="admin-data-table__name">
              {row.prenom ?? "—"} {row.nom ?? "—"}
            </span>
          </div>
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.matricule ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.filiere ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.niveau ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.groupe ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.email ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__cell--action">
          <button
            type="button"
            className="admin-data-table__action-btn"
            aria-label="Row actions"
          >
            <IconDots />
          </button>
        </span>
      </div>
    ),
  },
  1: {
    label: "teachers",
    columns: ["Teacher", "ID", "Email", "Grade", "Department", "Action"],
    renderRow: (row, i) => (
      <div key={i} className="import-preview-table__row">
        <span className="admin-data-table__cell admin-data-table__cell--name">
          <div className="admin-data-table__name-wrap">
            <Avatar
              name={`${row.prenom ?? ""} ${row.nom ?? ""}`}
              color={avatarColor(i)}
            />
            <span className="admin-data-table__name">
              {row.prenom ?? "—"} {row.nom ?? "—"}
            </span>
          </div>
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.id_enseignant ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.email ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.grade ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__text-cell">
          {row.departement ?? "—"}
        </span>
        <span className="admin-data-table__cell admin-data-table__cell--action">
          <button
            type="button"
            className="admin-data-table__action-btn"
            aria-label="Row actions"
          >
            <IconDots />
          </button>
        </span>
      </div>
    ),
  },
  2: {
    label: "timetable",
    columns: [
      "Year",
      "Section / Speciality",
      "Semester",
      "Day",
      "Time",
      "Type",
      "Subject",
      "Teacher",
      "Room",
      "Group",
      "Action",
    ],
    renderRow: (row, i) => {
      const sectionOrSpeciality =
        row.speciality && row.speciality.trim()
          ? row.speciality.trim()
          : row.section && row.section.trim()
            ? `Section ${row.section.trim()}`
            : "—";

      const time =
        row.time_start && row.time_end
          ? `${row.time_start} – ${row.time_end}`
          : row.time_start || "—";

      const TYPE_COLORS = {
        Cours: { bg: "#dbeafe", color: "#1d4ed8" },
        TD: { bg: "#dcfce7", color: "#15803d" },
        TP: { bg: "#fef9c3", color: "#a16207" },
        "TD/TP": { bg: "#ede9fe", color: "#6d28d9" },
        "Cours/TP": { bg: "#e0f2fe", color: "#0369a1" },
        "Cours/TD/TP": { bg: "#fce7f3", color: "#be185d" },
      };
      const typeStyle = TYPE_COLORS[row.type] ?? {
        bg: "#f1f5f9",
        color: "#475569",
      };

      return (
        <div key={i} className="import-preview-table__row">
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.year ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {sectionOrSpeciality}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.semester ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.day ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {time}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 600,
                background: typeStyle.bg,
                color: typeStyle.color,
              }}
            >
              {row.type ?? "—"}
            </span>
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.subject ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.teacher ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.room ?? "—"}
          </span>
          <span className="admin-data-table__cell admin-data-table__text-cell">
            {row.group && row.group.trim() ? (
              row.group.trim()
            ) : (
              <span
                style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 12 }}
              >
                All
              </span>
            )}
          </span>
          <span className="admin-data-table__cell admin-data-table__cell--action">
            <button
              type="button"
              className="admin-data-table__action-btn"
              aria-label="Row actions"
            >
              <IconDots />
            </button>
          </span>
        </div>
      );
    },
  },
};

// ── Preview table ────────────────────────────────────────────────────────────
const PAGE_SIZE = 7;

function PreviewTable({ rows, importType }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const config = PREVIEW_CONFIG[importType];
  if (!config || !rows.length) return null;

  const filtered = search
    ? rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : rows;

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ marginTop: 24 }}>
      <DataTable
        title={`Preview — ${config.label}`}
        count={filtered.length}
        searchQuery={search}
        onSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder={`Search ${config.label}…`}
        columns={config.columns}
        tableClass={`import-preview-table import-preview-table--${config.label}`}
        headerClass="import-preview-table__header-row"
        footerClass="import-preview-table__footer"
        emptyMessage={`No ${config.label} match your search.`}
        rowLabel={config.label}
        page={page}
        pageSize={PAGE_SIZE}
        totalCount={filtered.length}
        onPageChange={setPage}
      >
        {pageRows.map((row, i) =>
          config.renderRow(row, (page - 1) * PAGE_SIZE + i),
        )}
      </DataTable>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ImportPage() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [criticalError, setCriticalError] = useState(false);
  const fileInputRef = useRef(null);

  const options = [
    {
      id: 0,
      title: "List of students",
      description:
        "Import from Progres — CSV file with columns: matricule, nom, prenom, filiere, niveau, groupe, email",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.8405 3.39929C13.1978 3.39929 14.2893 4.49774 14.2893 5.84806C14.2893 7.17039 13.2398 8.24784 11.9315 8.29682C11.8755 8.28982 11.8125 8.28982 11.7496 8.29682M13.1908 14.5936C13.6946 14.4887 14.1704 14.2858 14.5622 13.9849C15.6536 13.1664 15.6536 11.816 14.5622 10.9975C14.1773 10.7036 13.7086 10.5077 13.2118 10.3958M6.76809 8.20587C6.69813 8.19887 6.61417 8.19887 6.53721 8.20587C4.87205 8.14989 3.54972 6.78558 3.54972 5.10643C3.54972 3.3923 4.93502 2 6.65615 2C8.37028 2 9.76258 3.3923 9.76258 5.10643C9.75558 6.78558 8.43325 8.14989 6.76809 8.20587ZM3.26986 10.7876C1.57671 11.921 1.57671 13.7681 3.26986 14.8945C5.19389 16.1818 8.34929 16.1818 10.2733 14.8945C11.9665 13.7611 11.9665 11.914 10.2733 10.7876C8.35629 9.50721 5.20088 9.50721 3.26986 10.7876Z"
            stroke="CurrentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 1,
      title: "List of teachers",
      description:
        "Import from Progres — UTF-8 CSV (comma-delimited) with columns: id_enseignant, nom, prenom, email, grade, departement",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.79456 8.25L4.97839 12.4724C4.98207 12.557 4.99121 12.6416 5.01571 12.7226C5.09144 12.973 5.23101 13.2004 5.44396 13.3533C7.11005 14.5489 11.4666 14.5489 13.1326 13.3533C13.3456 13.2004 13.4852 12.973 13.5609 12.7226C13.5854 12.6416 13.5945 12.557 13.5982 12.4724L13.782 8.25M15.6541 7.125V12.375M15.6541 12.375C15.0601 13.4597 14.7975 14.0409 14.5307 15C14.4728 15.3413 14.5188 15.5132 14.754 15.6659C14.8495 15.728 14.9643 15.75 15.0782 15.75H16.2185C16.3397 15.75 16.4621 15.7247 16.5619 15.6559C16.7805 15.5051 16.8368 15.3397 16.7775 15C16.5437 14.1094 16.2458 13.5006 15.6541 12.375ZM1.79907 6C1.79907 7.00633 7.87026 9.75 9.28864 9.75C10.707 9.75 16.7782 7.00633 16.7782 6C16.7782 4.99366 10.707 2.25 9.28864 2.25C7.87026 2.25 1.79907 4.99366 1.79907 6Z"
            stroke="CurrentColor"
            // stroke-opacity="0.6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Session planning",
      description:
        "Import timetable — CSV with columns: year, section, speciality, semester, day, time_start, time_end, type, subject, teacher, room, group",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7 2.25V4.95M6.30005 2.25V4.95"
            stroke="black"
            // stroke-opacity="0.6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.67505 3.6001H8.32505C5.77946 3.6001 4.50667 3.6001 3.71586 4.39091C2.92505 5.18172 2.92505 6.45451 2.92505 9.0001V10.3501C2.92505 12.8957 2.92505 14.1685 3.71586 14.9593C4.50667 15.7501 5.77946 15.7501 8.32505 15.7501H9.67505C12.2206 15.7501 13.4934 15.7501 14.2842 14.9593C15.075 14.1685 15.075 12.8957 15.075 10.3501V9.0001C15.075 6.45451 15.075 5.18172 14.2842 4.39091C13.4934 3.6001 12.2206 3.6001 9.67505 3.6001Z"
            stroke="CurrentColor"
            // stroke-opacity="0.6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.92505 7.6499H15.075"
            stroke="CurrentColor"
            // stroke-opacity="0.6"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ];

  // ── helpers ────────────────────────────────────────────────────────────────

  const resetAll = () => {
    setFile(null);
    setPreviewRows([]);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);
    setCriticalError(false);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);
    setCriticalError(false);

    if (PREVIEW_CONFIG[selectedOption]) {
      try {
        const text = await selectedFile.text();
        const { rows } = parseCSV(text);
        setPreviewRows(rows);
      } catch {
        setPreviewRows([]);
      }
    } else {
      setPreviewRows([]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const normalizeImportResult = (payload, fallbackFileName) => {
    if (!payload || typeof payload !== "object") {
      return {
        message: "",
        imported: 0,
        errors: 0,
        error_report: [],
        history_id: null,
        file_name: fallbackFileName || "uploaded_file.csv",
        date: new Date().toLocaleDateString("en-GB"),
      };
    }

    const errorReport = Array.isArray(payload.error_report)
      ? payload.error_report
      : Array.isArray(payload.errors_report)
        ? payload.errors_report
        : Array.isArray(payload.report)
          ? payload.report
          : Array.isArray(payload.errors)
            ? payload.errors
            : [];

    const resolveNumeric = (...values) => {
      for (const value of values) {
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim() !== "") {
          const parsed = Number(value);
          if (Number.isFinite(parsed)) return parsed;
        }
      }
      return null;
    };

    const numericErrors = resolveNumeric(
      payload.error_count,
      payload.failed,
      Array.isArray(payload.errors) ? payload.errors.length : null,
      errorReport.length,
    );

    const created = resolveNumeric(payload.created, payload.inserted, 0) ?? 0;
    const updated = resolveNumeric(payload.updated, 0) ?? 0;
    const imported =
      resolveNumeric(
        payload.imported,
        payload.imported_count,
        payload.success,
        payload.processed,
      ) ?? created + updated;
    const errors = numericErrors ?? 0;

    return {
      ...payload,
      message: payload.message || payload.detail || "",
      imported,
      errors,
      created,
      updated,
      error_report: errorReport,
      history_id: payload.history_id || payload.historyId || null,
      file_name:
        payload.file_name ||
        payload.filename ||
        payload.file ||
        fallbackFileName ||
        "uploaded_file.csv",
      date: payload.date || new Date().toLocaleDateString("en-GB"),
    };
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);
    setCriticalError(false);

    try {
      const { data: result, status: httpStatus } =
        selectedOption === 0
          ? await importService.importStudents(file)
          : selectedOption === 1
            ? await importService.importTeachers(file)
            : await importService.importTimetable(file);

      const normalizedResult = normalizeImportResult(result, file.name);
      setImportResult(normalizedResult);

      if (httpStatus !== 200 && httpStatus !== 201) {
        setSuccess(false);
        setCriticalError(false);
        setError(
          normalizedResult.message ||
            (normalizedResult.errors > 0
              ? `Found ${normalizedResult.errors} errors. Please review the error report before retrying.`
              : "Import failed. Please check the file format."),
        );
        if (
          normalizedResult.error_report.length > 0 ||
          normalizedResult.errors > 0
        ) {
          setShowErrorModal(true);
        }
        setFile(null);
        setPreviewRows([]);
        return;
      }

      if (normalizedResult.errors > 0) {
        setSuccess(false);
        setCriticalError(false);
        setError(
          normalizedResult.message ||
            (normalizedResult.imported > 0
              ? `Imported ${normalizedResult.imported} rows with ${normalizedResult.errors} errors. Please review the error report.`
              : `Found ${normalizedResult.errors} errors. Please review the error report before retrying.`),
        );
        setShowErrorModal(true);
      } else {
        setSuccess(true);
        setCriticalError(false);
        setError(null);
      }

      setFile(null);
      setPreviewRows([]);
    } catch (err) {
      console.error("Import failed:", err);
      const status = err?.response?.status;
      const normalizedResult = normalizeImportResult(
        err.response?.data,
        file?.name,
      );
      const detail = err.response?.data?.detail;
      const hasErrorReport =
        normalizedResult.errors > 0 || normalizedResult.error_report.length > 0;
      const isSystemFailure = (!status || status >= 500) && !hasErrorReport;

      if (isSystemFailure) {
        setCriticalError(true);
        setImportResult(null);
        setShowErrorModal(false);
        setError(null);
        return;
      }

      if (
        normalizedResult.errors > 0 ||
        normalizedResult.error_report.length > 0
      ) {
        setCriticalError(false);
        setImportResult(normalizedResult);
        setError(
          normalizedResult.message ||
            (normalizedResult.imported > 0
              ? `Imported ${normalizedResult.imported} rows with ${normalizedResult.errors || normalizedResult.error_report.length} errors. Please review the error report.`
              : `Found ${normalizedResult.errors || normalizedResult.error_report.length} errors. Please review the error report.`),
        );
        setShowErrorModal(true);
      } else {
        setCriticalError(false);
        setError(
          normalizedResult.message ||
            (typeof detail === "string"
              ? detail
              : "Failed to import data. Please check the file format."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="main-page">
      {/* ── Header ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Import / Export</h2>
          <p className="main-subtitle">
            Import the data from Progres (CSV) and export the absence reports.
          </p>
        </div>

        <ExportAbsencesButton />
      </div>

      <div className="import-container">
        {/* ── Type selector ── */}
        <div className="import-options-grid">
          {options.map((opt) => (
            <ImportButton
              key={opt.id}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              isSelected={selectedOption === opt.id}
              onClick={() => {
                setSelectedOption(opt.id);
                resetAll();
              }}
            />
          ))}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          style={{ display: "none" }}
        />

        {/* ── Upload / ready / success area ── */}
        {!file && !success ? (
          <div className="import-upload-area">
            <h3 className="import-upload-title">Upload a CSV file</h3>
            <p className="import-upload-subtitle">
              {selectedOption === 2
                ? "Select a UTF-8 .csv file — columns: year, section, speciality, semester, day, time_start, time_end, type, subject, teacher, room, group"
                : "Select a UTF-8 .csv file separated by commas (,)"}
            </p>
            <button className="import-upload-btn" onClick={handleUploadClick}>
              Upload
            </button>
          </div>
        ) : success ? (
          <div className="import-success-area">
            <h3 className="import-success-title">Imported successfully</h3>
            <p className="import-success-subtitle" style={{ color: "#10b981" }}>
              The data has been processed and saved.
            </p>
            <button
              className="import-upload-btn"
              onClick={() => setSuccess(false)}
            >
              Import another file
            </button>
            <div style={{ marginTop: 16, color: "#10b981", fontSize: 14 }}>
              Successfully imported <strong>{importResult?.imported}</strong>{" "}
              rows.
            </div>
          </div>
        ) : (
          <div className="import-success-area">
            <h3 className="import-success-title">Ready to import</h3>
            <p className="import-success-file">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              {file.name}
            </p>
            <button className="import-upload-btn" onClick={handleUploadClick}>
              Change file
            </button>
          </div>
        )}
      </div>

      {/* ── CSV preview table ── */}
      {file && previewRows.length > 0 && (
        <PreviewTable rows={previewRows} importType={selectedOption} />
      )}

      {/* ── Errors & modals ── */}
      {criticalError && <CriticalErrorNotification />}

      {error && !criticalError && (
        <div className="error-message" style={{ margin: "16px 0 0 0" }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>{error}</p>
          {importResult?.error_report?.length > 0 && (
            <button
              className="import-upload-btn"
              style={{ marginTop: 2 }}
              onClick={() => setShowErrorModal(true)}
            >
              View error report
            </button>
          )}
        </div>
      )}

      <ImportErrorReportModal
        isOpen={showErrorModal}
        importResult={importResult}
        onClose={() => setShowErrorModal(false)}
      />

      {/* ── Footer actions ── */}
      <div className="import-footer">
        {file && (
          <>
            {selectedOption === 0 && (
              <p className="import-footer-text">
                When you submit, an automatic email is going to be sent to the
                student with their email and the password (their matricule) !
              </p>
            )}
            <div className="import-footer-actions">
              <button
                className="btn-cancel"
                onClick={resetAll}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={!file || loading}
              >
                {loading ? "Processing..." : "Submit & save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
