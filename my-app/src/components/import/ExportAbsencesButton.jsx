"use client";

import { useState } from "react";
import { downloadAbsencesCSV } from "@/services/exportService";

const EMPTY_FILTERS = {
  filiere: "",
  code_module: "",
  date_from: "",
  date_to: "",
  matricule_etudiant: "",
};

export default function ExportAbsencesButton() {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
    setError("");
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    try {
      const parts = ["absences"];
      if (filters.filiere) parts.push(filters.filiere);
      if (filters.code_module) parts.push(filters.code_module);
      if (filters.date_from) parts.push(`from-${filters.date_from}`);
      if (filters.date_to) parts.push(`to-${filters.date_to}`);
      await downloadAbsencesCSV(filters, `${parts.join("_")}.csv`);
      closeModal();
    } catch (err) {
      console.error("[ExportAbsencesButton] download failed:", err);
      setError("Failed to download CSV. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <>
      <button
        className="main-export-btn"
        type="button"
        onClick={() => setShowModal(true)}
      >
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

      {showModal && (
        <div className="export-modal-backdrop" onClick={handleBackdropClick}>
          <div
            className="export-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
          >
            <div className="export-modal-header">
              <div>
                <h3 className="export-modal-title" id="export-modal-title">
                  Export absences
                </h3>
                <p className="export-modal-subtitle">
                  Apply filters then download as CSV. All filters are optional.
                </p>
              </div>
              <button
                className="export-modal-close"
                onClick={closeModal}
                aria-label="Close export modal"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <line
                    x1="18"
                    y1="6"
                    x2="6"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="6"
                    y1="6"
                    x2="18"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="export-modal-body">
              <div className="export-modal-grid">
                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-filiere">
                    Filière
                  </label>
                  <input
                    id="em-filiere"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. INF, SIQ…"
                    value={filters.filiere}
                    onChange={(e) => setFilter("filiere", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-module">
                    Module code
                  </label>
                  <input
                    id="em-module"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. ALGO01"
                    value={filters.code_module}
                    onChange={(e) => setFilter("code_module", e.target.value)}
                  />
                </div>

                <div className="export-modal-field export-modal-field--full">
                  <label className="export-modal-label" htmlFor="em-matricule">
                    Matricule étudiant
                  </label>
                  <input
                    id="em-matricule"
                    type="text"
                    className="export-modal-input"
                    placeholder="e.g. 231234"
                    value={filters.matricule_etudiant}
                    onChange={(e) =>
                      setFilter("matricule_etudiant", e.target.value)
                    }
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-date-from">
                    From date
                  </label>
                  <input
                    id="em-date-from"
                    type="date"
                    className="export-modal-input"
                    value={filters.date_from}
                    onChange={(e) => setFilter("date_from", e.target.value)}
                  />
                </div>

                <div className="export-modal-field">
                  <label className="export-modal-label" htmlFor="em-date-to">
                    To date
                  </label>
                  <input
                    id="em-date-to"
                    type="date"
                    className="export-modal-input"
                    value={filters.date_to}
                    min={filters.date_from || undefined}
                    onChange={(e) => setFilter("date_to", e.target.value)}
                  />
                </div>
              </div>

              <div className="export-modal-info">
                <span className="export-modal-info-label">CSV columns:</span>
                <span className="export-modal-info-value">
                  matricule · nom · prénom · filière · groupe · code_module ·
                  nom_module · type_séance · date · heure_début · heure_fin ·
                  statut_justificatif
                </span>
              </div>

              {error && (
                <div className="error-message" style={{ marginTop: 12 }}>
                  {error}
                </div>
              )}
            </div>

            <div className="export-modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleReset}
                disabled={downloading}
              >
                Reset filters
              </button>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                  disabled={downloading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? (
                    "Downloading…"
                  ) : (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ marginRight: 6 }}
                      >
                        <path
                          d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="7 10 12 15 17 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="12"
                          y1="15"
                          x2="12"
                          y2="3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Download CSV
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
