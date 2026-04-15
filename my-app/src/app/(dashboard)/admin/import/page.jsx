/**
 * app/(dashboard)/admin/import/page.jsx
 *
 * All upload / preview / submit logic has been moved to hooks/useImport.js
 * This page now only handles:
 *   - The import type selector (selectedOption state)
 *   - Layout and rendering
 */

"use client";

import { useState } from "react";
import ImportButton from "@/components/dashboard/ImportButton";
import ImportErrorReportModal from "@/components/dashboard/ImportErrorReportModal";
import ImportPreviewTable from "@/components/dashboard/ImportPreviewTable";
import ExportAbsencesButton from "@/components/dashboard/ExportAbsencesButton";
import CriticalErrorNotification from "@/components/import/CriticalErrorNotification";
import { useImport } from "@/hooks/useImport";

// ─────────────────────────────────────────────────────────────────────────────
// Import type options
// ─────────────────────────────────────────────────────────────────────────────

const OPTIONS = [
  {
    id: 0,
    title: "List of students",
    description:
      "Import from Progres — CSV file with columns: matricule, nom, prenom, filiere, niveau, groupe, email",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.8405 3.39929C13.1978 3.39929 14.2893 4.49774 14.2893 5.84806C14.2893 7.17039 13.2398 8.24784 11.9315 8.29682C11.8755 8.28982 11.8125 8.28982 11.7496 8.29682M13.1908 14.5936C13.6946 14.4887 14.1704 14.2858 14.5622 13.9849C15.6536 13.1664 15.6536 11.816 14.5622 10.9975C14.1773 10.7036 13.7086 10.5077 13.2118 10.3958M6.76809 8.20587C6.69813 8.19887 6.61417 8.19887 6.53721 8.20587C4.87205 8.14989 3.54972 6.78558 3.54972 5.10643C3.54972 3.3923 4.93502 2 6.65615 2C8.37028 2 9.76258 3.3923 9.76258 5.10643C9.75558 6.78558 8.43325 8.14989 6.76809 8.20587ZM3.26986 10.7876C1.57671 11.921 1.57671 13.7681 3.26986 14.8945C5.19389 16.1818 8.34929 16.1818 10.2733 14.8945C11.9665 13.7611 11.9665 11.914 10.2733 10.7876C8.35629 9.50721 5.20088 9.50721 3.26986 10.7876Z"
          stroke="CurrentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
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
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.79456 8.25L4.97839 12.4724C4.98207 12.557 4.99121 12.6416 5.01571 12.7226C5.09144 12.973 5.23101 13.2004 5.44396 13.3533C7.11005 14.5489 11.4666 14.5489 13.1326 13.3533C13.3456 13.2004 13.4852 12.973 13.5609 12.7226C13.5854 12.6416 13.5945 12.557 13.5982 12.4724L13.782 8.25M15.6541 7.125V12.375M15.6541 12.375C15.0601 13.4597 14.7975 14.0409 14.5307 15C14.4728 15.3413 14.5188 15.5132 14.754 15.6659C14.8495 15.728 14.9643 15.75 15.0782 15.75H16.2185C16.3397 15.75 16.4621 15.7247 16.5619 15.6559C16.7805 15.5051 16.8368 15.3397 16.7775 15C16.5437 14.1094 16.2458 13.5006 15.6541 12.375ZM1.79907 6C1.79907 7.00633 7.87026 9.75 9.28864 9.75C10.707 9.75 16.7782 7.00633 16.7782 6C16.7782 4.99366 10.707 2.25 9.28864 2.25C7.87026 2.25 1.79907 4.99366 1.79907 6Z"
          stroke="CurrentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
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
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.7 2.25V4.95M6.30005 2.25V4.95"
          stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M9.67505 3.6001H8.32505C5.77946 3.6001 4.50667 3.6001 3.71586 4.39091C2.92505 5.18172 2.92505 6.45451 2.92505 9.0001V10.3501C2.92505 12.8957 2.92505 14.1685 3.71586 14.9593C4.50667 15.7501 5.77946 15.7501 8.32505 15.7501H9.67505C12.2206 15.7501 13.4934 15.7501 14.2842 14.9593C15.075 14.1685 15.075 12.8957 15.075 10.3501V9.0001C15.075 6.45451 15.075 5.18172 14.2842 4.39091C13.4934 3.6001 12.2206 3.6001 9.67505 3.6001Z"
          stroke="CurrentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M2.92505 7.6499H15.075"
          stroke="CurrentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ImportPage() {
  const [selectedOption, setSelectedOption] = useState(0);

  const {
    file,
    previewRows,
    loading,
    error,
    success,
    importResult,
    showErrorModal,
    criticalError,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
    handleSubmit,
    resetAll,
    setSuccess,
    setShowErrorModal,
  } = useImport(selectedOption);

  const handleTypeChange = (id) => {
    setSelectedOption(id);
    resetAll(); // clear file + preview when switching type
  };

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
          {OPTIONS.map((opt) => (
            <ImportButton
              key={opt.id}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              isSelected={selectedOption === opt.id}
              onClick={() => handleTypeChange(opt.id)}
            />
          ))}
        </div>

        {/* ── Hidden file input ── */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          style={{ display: "none" }}
        />

        {/* ── Upload zone / ready state / success state ── */}
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
            <button className="import-upload-btn" onClick={() => setSuccess(false)}>
              Import another file
            </button>
            <div style={{ marginTop: 16, color: "#10b981", fontSize: 14 }}>
              Successfully imported <strong>{importResult?.imported}</strong> rows.
            </div>
          </div>
        ) : (
          <div className="import-success-area">
            <h3 className="import-success-title">Ready to import</h3>
            <p className="import-success-file">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <ImportPreviewTable rows={previewRows} importType={selectedOption} />
      )}

      {/* ── Critical error banner (US-17) ── */}
      {criticalError && <CriticalErrorNotification />}

      {/* ── Inline error message ── */}
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

      {/* ── Error report modal (US-12) ── */}
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
                student with their email and the password (their matricule)!
              </p>
            )}
            <div className="import-footer-actions">
              <button className="btn-cancel" onClick={resetAll} disabled={loading}>
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