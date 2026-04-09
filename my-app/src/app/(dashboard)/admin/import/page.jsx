"use client";

import { useState, useRef } from "react";
import ImportButton from "@/components/dashboard/ImportButton";
import ImportErrorReportModal from "@/components/dashboard/ImportErrorReportModal";
import * as importService from "@/services/importService";

export default function ImportPage() {
  const [selectedOption, setSelectedOption] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const fileInputRef = useRef(null);

  const options = [
    {
      id: 0,
      title: "List of students",
      description:
        "Import from Progres — CSV file with columns: matricule, nom, prenom, filiere, niveau, groupe, email",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 1,
      title: "List of teachers",
      description:
        "Import from Progres — CSV file with columns: matricule, nom, prenom, email",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Session planning",
      description:
        "Import from Progres — CSV file with columns: date, star_time, fin_time, module, teacher, room, group",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setShowErrorModal(false);
    }
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
          : [];

    const errors = Number(
      payload.errors ??
        payload.error_count ??
        payload.failed ??
        errorReport.length ??
        0,
    );

    const imported = Number(
      payload.imported ?? payload.imported_count ?? payload.success ?? 0,
    );

    return {
      ...payload,
      message: payload.message || payload.detail || "",
      imported,
      errors,
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

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);

    try {
      const result =
        selectedOption === 0
          ? await importService.importStudents(file)
          : selectedOption === 1
            ? await importService.importTeachers(file)
            : await importService.importSessions(file);

      const normalizedResult = normalizeImportResult(result, file.name);
      setImportResult(normalizedResult);

      if (normalizedResult.errors > 0) {
        setSuccess(false);
        setError(
          normalizedResult.message ||
            (normalizedResult.imported > 0
              ? `Imported ${normalizedResult.imported} rows with ${normalizedResult.errors} errors. Please review the error report.`
              : `Found ${normalizedResult.errors} errors. Please review the error report before retrying.`),
        );
        setShowErrorModal(true);
      } else {
        setSuccess(true);
        setError(null);
      }
      setFile(null);
    } catch (err) {
      console.error("Import failed:", err);
      const normalizedResult = normalizeImportResult(
        err.response?.data,
        file?.name,
      );
      const detail = err.response?.data?.detail;

      if (
        normalizedResult.errors > 0 ||
        normalizedResult.error_report.length > 0
      ) {
        setImportResult(normalizedResult);
        setError(
          normalizedResult.message ||
            (normalizedResult.imported > 0
              ? `Imported ${normalizedResult.imported} rows with ${normalizedResult.errors || normalizedResult.error_report.length} errors. Please review the error report.`
              : `Found ${normalizedResult.errors || normalizedResult.error_report.length} errors. Please review the error report.`),
        );
        setShowErrorModal(true);
      } else {
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

  return (
    <div className="main-page">
      {/* ── Header row ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Import / Export</h2>
          <p className="main-subtitle">
            Import the data from Progres (CSV) and export the absence reports.
          </p>
        </div>

        <button className="main-export-btn">
          Export data
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="7 10 12 15 17 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="12"
              y1="15"
              x2="12"
              y2="3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="import-container">
        <div className="import-options-grid">
          {options.map((opt) => (
            <ImportButton
              key={opt.id}
              icon={opt.icon}
              title={opt.title}
              description={opt.description}
              isSelected={selectedOption === opt.id}
              onClick={() => setSelectedOption(opt.id)}
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

        {/* Upload State Toggle */}
        {!file && !success ? (
          <div className="import-upload-area">
            <h3 className="import-upload-title">Upload a CSV file</h3>
            <p className="import-upload-subtitle">
              Select a .csv file separated by semicolons (;)
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
            <div
              style={{ marginTop: "16px", color: "#10b981", fontSize: "14px" }}
            >
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              {file.name}
            </p>
            <button className="import-upload-btn" onClick={handleUploadClick}>
              Change file
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" style={{ margin: "16px 0 0 0" }}>
          <p style={{ fontWeight: "600", marginBottom: "8px" }}>{error}</p>
          {importResult?.error_report?.length > 0 && (
            <button
              className="import-upload-btn"
              style={{ marginTop: "2px" }}
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

      <div className="import-footer">
        {file && (
          <>
            <p className="import-footer-text">
              When you submit, an automatic email is going to be sent to the
              student with their email and the password (their matricule) !
            </p>
            <div className="import-footer-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setFile(null);
                  setError(null);
                  setSuccess(false);
                  setShowErrorModal(false);
                }}
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
