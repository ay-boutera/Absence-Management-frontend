/**
 * hooks/useImport.js
 *
 * Encapsulates ALL state and logic for the import flow.
 * Extracted from app/(dashboard)/admin/import/page.jsx
 *
 * What this hook manages:
 *   - File selection + CSV parsing + header validation (US-16)
 *   - Preview rows state
 *   - Submit & save (calls importService)
 *   - Error report state (US-12)
 *   - Critical error state (US-17)
 *   - Success state
 *   - Reset
 *
 * Usage in page.jsx:
 *   const {
 *     file, previewRows, loading, error, success,
 *     importResult, showErrorModal, criticalError,
 *     handleFileChange, handleSubmit, resetAll,
 *     setShowErrorModal,
 *   } = useImport(selectedOption);
 */

"use client";

import { useState, useRef, useCallback } from "react";
import * as importService from "@/services/importService";
import { validateHeaders } from "@/lib/csvvalidator";

// ─────────────────────────────────────────────────────────────────────────────
// CSV parser
// Splits raw CSV text into { headers, rows }
// Supports both comma (,) and semicolon (;) separators
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// normalizeImportResult
// Smooths over all the different shapes the backend might return
// so the rest of the hook always works with the same object shape
// ─────────────────────────────────────────────────────────────────────────────

function normalizeImportResult(payload, fallbackFileName) {
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

  const created  = resolveNumeric(payload.created, payload.inserted, 0) ?? 0;
  const updated  = resolveNumeric(payload.updated, 0) ?? 0;
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
}

// ─────────────────────────────────────────────────────────────────────────────
// useImport
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {0|1|2} selectedOption — import type coming from the page
 *                                 0 = students, 1 = teachers, 2 = timetable
 */
export function useImport(selectedOption) {
  const [file, setFile]                   = useState(null);
  const [previewRows, setPreviewRows]     = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [success, setSuccess]             = useState(false);
  const [importResult, setImportResult]   = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [criticalError, setCriticalError] = useState(false);

  // Ref for the hidden <input type="file"> — kept here so the page
  // doesn't have to manage it separately
  const fileInputRef = useRef(null);

  // ── Reset everything back to the initial empty state ──────────────────────
  const resetAll = useCallback(() => {
    setFile(null);
    setPreviewRows([]);
    setError(null);
    setSuccess(false);
    setShowErrorModal(false);
    setCriticalError(false);
    setImportResult(null);
  }, []);

  // ── Programmatically open the file picker ─────────────────────────────────
  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ── File selected — parse + validate headers, then set preview rows ───────
  const handleFileChange = useCallback(
    async (e) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      // Reset error/success states but keep the type selector as-is
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setShowErrorModal(false);
      setCriticalError(false);
      setPreviewRows([]);

      try {
        const text = await selectedFile.text();
        const { headers, rows } = parseCSV(text); // ← fix: destructure BOTH

        // Validate headers before showing preview (US-16)
        const validation = validateHeaders(headers, selectedOption);
        if (!validation.valid) {
          setError(validation.message);
          return; // stop here — don't show broken data in the preview
        }

        setPreviewRows(rows);
      } catch {
        setPreviewRows([]);
      }
    },
    [selectedOption],
  );

  // ── Submit & save — send file to backend ──────────────────────────────────
  const handleSubmit = useCallback(async () => {
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

      const normalized = normalizeImportResult(result, file.name);
      setImportResult(normalized);

      // ── Non-2xx response ─────────────────────────────────────────────────
      if (httpStatus !== 200 && httpStatus !== 201) {
        setError(
          normalized.message ||
            (normalized.errors > 0
              ? `Found ${normalized.errors} errors. Please review the error report before retrying.`
              : "Import failed. Please check the file format."),
        );
        if (normalized.error_report.length > 0 || normalized.errors > 0) {
          setShowErrorModal(true);
        }
        setFile(null);
        setPreviewRows([]);
        return;
      }

      // ── 2xx but with row-level errors ────────────────────────────────────
      if (normalized.errors > 0) {
        setError(
          normalized.message ||
            (normalized.imported > 0
              ? `Imported ${normalized.imported} rows with ${normalized.errors} errors. Please review the error report.`
              : `Found ${normalized.errors} errors. Please review the error report before retrying.`),
        );
        setShowErrorModal(true);
      } else {
        // ── Full success ───────────────────────────────────────────────────
        setSuccess(true);
        setError(null);
      }

      setFile(null);
      setPreviewRows([]);
    } catch (err) {
      console.error("Import failed:", err);

      const status = err?.response?.status;
      const normalized = normalizeImportResult(err.response?.data, file?.name);
      const hasErrorReport =
        normalized.errors > 0 || normalized.error_report.length > 0;
      const isSystemFailure = (!status || status >= 500) && !hasErrorReport;

      // ── 500+ with no error report → critical error banner (US-17) ────────
      if (isSystemFailure) {
        setCriticalError(true);
        setImportResult(null);
        return;
      }

      // ── Structured error report from backend ─────────────────────────────
      if (hasErrorReport) {
        setImportResult(normalized);
        setError(
          normalized.message ||
            (normalized.imported > 0
              ? `Imported ${normalized.imported} rows with ${
                  normalized.errors || normalized.error_report.length
                } errors. Please review the error report.`
              : `Found ${
                  normalized.errors || normalized.error_report.length
                } errors. Please review the error report.`),
        );
        setShowErrorModal(true);
      } else {
        // ── Generic error (bad format, network, etc.) ─────────────────────
        const detail = err.response?.data?.detail;
        setError(
          normalized.message ||
            (typeof detail === "string"
              ? detail
              : "Failed to import data. Please check the file format."),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [file, selectedOption]);

  // ─────────────────────────────────────────────────────────────────────────
  return {
    // ── State ──────────────────────────────────────────────────────────────
    file,
    previewRows,
    loading,
    error,
    success,
    importResult,
    showErrorModal,
    criticalError,

    // ── Ref (attach to <input type="file" ref={fileInputRef} />) ───────────
    fileInputRef,

    // ── Actions ────────────────────────────────────────────────────────────
    handleFileChange,   // onChange for the hidden file input
    handleUploadClick,  // onClick for the "Upload" / "Change file" button
    handleSubmit,       // onClick for "Submit & save"
    resetAll,           // onClick for "Cancel" and type selector change
    setSuccess,         // lets the page show "Import another file"
    setShowErrorModal,  // lets ImportErrorReportModal close itself
  };
}