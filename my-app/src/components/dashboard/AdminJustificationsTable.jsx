"use client";

import DataTable from "@/components/shared/DataTable";
import useDashboardTable from "@/hooks/useDashboardTable";

const COLUMNS = ["Student", "Date", "Reason", "Document", "Status", "Action"];
const PAGE_SIZE = 7;

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M10.8 2.4L4.6 8.6L1.8 5.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
      <path
        d="M9.4 1.6L1.6 9.4M1.6 1.6L9.4 9.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(value) {
  if (!value || typeof value !== "string") return "—";
  const parts = value.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day} - ${month} - ${year}`;
  }
  return value;
}

function getStatusKey(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("approve")) return "approved";
  if (normalized.includes("reject")) return "rejected";
  return "pending";
}

function JustificationRow({ justification }) {
  const statusKey = getStatusKey(justification.status);

  return (
    <div className="admin-justifications-table__row">
      <div className="admin-data-table__cell admin-data-table__cell--name">
        <div className="admin-data-table__name-wrap">
          <div className="admin-data-table__name-info">
            <p className="admin-data-table__name">
              {justification.studentName}
            </p>
            <p className="admin-data-table__email">
              {justification.studentEmail || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {justification.date}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {justification.reason}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {justification.document ? (
          <a
            href={justification.document}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-justifications-table__doc-link"
          >
            {justification.documentName || "View Document"}
          </a>
        ) : (
          "—"
        )}
      </div>

      <div className="admin-data-table__cell">
        <span
          className={`admin-justifications-table__status admin-justifications-table__status--${statusKey}`}
        >
          {justification.status}
        </span>
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        {statusKey === "pending" ? (
          <div className="admin-justifications-table__actions-inline">
            <button
              type="button"
              className="admin-justifications-table__inline-btn admin-justifications-table__inline-btn--approve"
            >
              <CheckIcon />
              Approve
            </button>
            <button
              type="button"
              className="admin-justifications-table__inline-btn admin-justifications-table__inline-btn--reject"
            >
              <CrossIcon />
              Reject
            </button>
          </div>
        ) : (
          <span className="admin-justifications-table__action-dash">—</span>
        )}
      </div>
    </div>
  );
}

function normalizeJustification(raw, index) {
  const documentValue = raw?.document || raw?.document_url || null;
  const documentName =
    raw?.document_name ||
    (typeof documentValue === "string" ? documentValue.split("/").pop() : null);

  return {
    id: raw?.id || index,
    studentName:
      raw?.student_name || raw?.studentName || `Student ${index + 1}`,
    studentEmail: raw?.student_email || raw?.email || "",
    date: formatDate(raw?.date || ""),
    reason: raw?.reason || "—",
    document: documentValue,
    documentName,
    status: raw?.status || "Pending",
  };
}

export default function AdminJustificationsTable({ justifications = [] }) {
  const {
    searchQuery,
    handleSearch,
    page,
    setPage,
    normalizedItems: normalizedJustifications,
    pagedItems: pagedJustifications,
    totalCount,
  } = useDashboardTable({
    items: justifications,
    normalizeItem: normalizeJustification,
    searchFields: ["studentName", "studentEmail", "date", "reason", "status"],
    pageSize: PAGE_SIZE,
  });

  return (
    <DataTable
      title="Total Justifications"
      count={normalizedJustifications.length}
      searchQuery={searchQuery}
      onSearch={handleSearch}
      placeholder="Search student, email, date, reason, status..."
      columns={COLUMNS}
      tableClass="admin-justifications-table"
      headerClass="admin-justifications-table__header-row"
      footerClass="admin-justifications-table__footer"
      rowLabel="Requests"
      page={page}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      onPageChange={setPage}
      emptyMessage="No justifications found."
    >
      {pagedJustifications.map((justification) => (
        <JustificationRow
          key={justification.id}
          justification={justification}
        />
      ))}
    </DataTable>
  );
}
