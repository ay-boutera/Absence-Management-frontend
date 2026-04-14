"use client";

import { useCallback, useEffect, useState } from "react";
import DataTable from "@/components/shared/DataTable";
import { getImportExportHistory } from "@/services/importService";

const PAGE_SIZE = 7;
const COLUMNS = [
  "Date",
  "File name",
  "Data type",
  "Rows",
  "Success",
  "Errors",
  "Status",
];

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeHistoryItem(item, index) {
  const errorCount = Number(item?.error_count ?? 0);
  const successCount = Number(item?.success_count ?? 0);

  return {
    id: item?.id || `${item?.file_name || "file"}-${index}`,
    createdAt: formatDateTime(item?.created_at),
    fileName: item?.file_name || "—",
    dataType: item?.data_type || "—",
    rowCount: Number(item?.row_count ?? 0),
    successCount,
    errorCount,
    statusLabel: errorCount > 0 ? "With errors" : "Success",
    statusClass:
      errorCount > 0
        ? "admin-import-history-table__status admin-import-history-table__status--error"
        : "admin-import-history-table__status admin-import-history-table__status--success",
  };
}

function ImportHistoryRow({ row }) {
  return (
    <div className="admin-import-history-table__row">
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {row.createdAt}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {row.fileName}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {row.dataType}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {row.rowCount}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {row.successCount}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {row.errorCount}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        <span className={row.statusClass}>{row.statusLabel}</span>
      </div>
    </div>
  );
}

export default function ImportHistoryPage() {
  const [page, setPage] = useState(1);
  const [historyRows, setHistoryRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getImportExportHistory({
        page,
        pageSize: PAGE_SIZE,
      });
      const items = Array.isArray(result?.items) ? result.items : [];

      setHistoryRows(items.map(normalizeHistoryItem));
      setTotal(Number(result?.total ?? items.length));
    } catch (err) {
      console.error("Failed to fetch import history", err);
      setHistoryRows([]);
      setTotal(0);
      setError("Failed to load import history.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <div className="main-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Import history</h2>
          <p className="main-subtitle">
            View previous imports and their processing status.
          </p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="border border-[#e3e8ef] rounded-xl px-4 py-6 text-[14px] text-[#4a5567] bg-white">
          Loading import history...
        </div>
      ) : (
        <DataTable
          title="Import history"
          count={total}
          showSearch={false}
          showDefaultTools={false}
          columns={COLUMNS}
          tableClass="admin-import-history-table"
          headerClass="admin-import-history-table__header-row"
          footerClass="admin-import-history-table__footer"
          emptyMessage="No import/export history found."
          rowLabel="records"
          page={page}
          pageSize={PAGE_SIZE}
          totalCount={total}
          onPageChange={setPage}
        >
          {historyRows.map((row) => (
            <ImportHistoryRow key={row.id} row={row} />
          ))}
        </DataTable>
      )}
    </div>
  );
}
