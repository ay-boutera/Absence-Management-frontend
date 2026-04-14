export default function ImportErrorReportModal({
  isOpen,
  importResult,
  onClose,
}) {
  if (!isOpen || !importResult?.error_report?.length) {
    return null;
  }

  return (
    <div className="import-error-modal-backdrop" onClick={onClose}>
      <div className="import-error-modal" onClick={(e) => e.stopPropagation()}>
        <div className="import-error-modal-header">
          <h3 className="import-error-modal-title">Errors occurred!</h3>
          <button
            className="import-error-modal-close"
            onClick={onClose}
            aria-label="Close import error report"
          >
            ×
          </button>
        </div>

        <div className="import-error-section">
          <div className="import-error-section-head">
            <p>Import Errors Report</p>
          </div>
          <div className="import-error-meta-grid">
            {importResult.message && (
              <p
                style={{
                  gridColumn: "1 / -1",
                  color: "#dc2626",
                  fontWeight: 500,
                }}
              >
                {importResult.message}
              </p>
            )}
            <p>
              File: <strong>{importResult.file_name}</strong>
            </p>
            <p>
              Errors found: <strong>{importResult.errors}</strong>
            </p>
            <p>
              Date: <strong>{importResult.date}</strong>
            </p>
          </div>
        </div>

        <div className="import-error-section">
          <div className="import-error-section-head">
            <p>Errors Details</p>
          </div>

          <div className="import-error-table-wrap">
            <table className="import-error-table">
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Field</th>
                  <th>Error Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {importResult.error_report.map((errItem, idx) => {
                  const rowData = errItem?.row_data;
                  const fallbackField =
                    rowData && typeof rowData === "object"
                      ? Object.keys(rowData)[0] || "—"
                      : "—";

                  return (
                    <tr key={`${errItem?.line || idx}-${idx}`}>
                      <td>{errItem?.line || errItem?.row || idx + 1}</td>
                      <td>
                        {errItem?.field || errItem?.column || fallbackField}
                      </td>
                      <td>
                        {errItem?.error_type ||
                          errItem?.type ||
                          "Validation error"}
                      </td>
                      <td>
                        {errItem?.reason ||
                          errItem?.description ||
                          errItem?.message ||
                          "Unknown import validation error."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
