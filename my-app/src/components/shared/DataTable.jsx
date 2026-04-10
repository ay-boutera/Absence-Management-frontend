// Simple placeholder DataTable component

"use client";
import {
  IconGroup,
  IconSearch,
  FilterIcon,
  SortIcon,
} from "@/components/shared/TableShared";

export function DataTable({ columns = [], data = [] }) {
  // Normalize columns to objects: { Header, accessor }
  const normalizedColumns = columns.map((col) =>
    typeof col === "string" ? { Header: col, accessor: col } : col,
  );


export default function DataTable({
  icon,
  title,
  count,
  showHead = true,
  showColumnHeaders = true,
  searchQuery,
  onSearch,
  showSearch = true,
  showDefaultTools = true,
  placeholder = "Search...",
  columns = [],
  children,
  emptyMessage = "No results found.",
  extraTools,
  tableClass = "",
  headerClass = "admin-data-table__header-row",
  pagination,
}) {
  const showPagination = !!pagination;
  const { currentPage = 1, totalItems = 0, pageSize = 7, onPageChange, entityName = "items" } =
    pagination ?? {};

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  function buildPageNumbers() {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    // Always show 1, last, current ±1, with ellipsis
    const show = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(
      (p) => p >= 1 && p <= totalPages,
    ));
    const sorted = Array.from(show).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
      result.push(sorted[i]);
    }
    return result;
  }

  return (
    <div className={`admin-data-table ${tableClass}`}>
      {showHead && (
        <>
          {/* ── Toolbar ── */}
          <div className="admin-data-table__toolbar">
            <div className="admin-data-table__title-wrap">
              <div className="admin-data-table__title-icon">
                {icon ?? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.9775 2.66671C12.2708 2.66671 13.3108 3.71337 13.3108 5.00004C13.3108 6.26004 12.3108 7.28671 11.0642 7.33337C11.0108 7.32671 10.9508 7.32671 10.8908 7.33337M12.2642 13.3334C12.7442 13.2334 13.1975 13.04 13.5708 12.7534C14.6108 11.9734 14.6108 10.6867 13.5708 9.90671C13.2042 9.62671 12.7575 9.44004 12.2842 9.33337M6.14416 7.24671C6.0775 7.24004 5.9975 7.24004 5.92416 7.24671C4.3375 7.19337 3.0775 5.89337 3.0775 4.29337C3.0775 2.66004 4.3975 1.33337 6.0375 1.33337C7.67083 1.33337 8.9975 2.66004 8.9975 4.29337C8.99083 5.89337 7.73083 7.19337 6.14416 7.24671ZM2.81083 9.70671C1.1975 10.7867 1.1975 12.5467 2.81083 13.62C4.64416 14.8467 7.65083 14.8467 9.48416 13.62C11.0975 12.54 11.0975 10.78 9.48416 9.70671C7.6575 8.48671 4.65083 8.48671 2.81083 9.70671Z" stroke="black" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

}
              </div>
              <div className="admin-data-table__title-content">
                <span className="admin-data-table__title">{title} :</span>
                <span className="admin-data-table__count">{count}</span>
              </div>
            </div>

            <div className="admin-data-table__tools">
              {showSearch && (
                <div className="admin-data-table__search">
                  <IconSearch />
                  <input
                    type="text"
                    value={searchQuery ?? ""}
                    onChange={(e) => onSearch?.(e.target.value)}
                    placeholder={placeholder}
                    className="admin-data-table__search-input"
                  />
                </div>
              )}

              {showDefaultTools && (
                <>
                  <button
                    type="button"
                    className="admin-data-table__control-btn"
                  >
                    <FilterIcon />
                    Filter
                  </button>

                  <button
                    type="button"
                    className="admin-data-table__control-btn"
                  >
                    <SortIcon />
                    Sort
                  </button>
                </>
              )}

              {extraTools}
            </div>
          </div>

          {/* ── Column headers ── */}
          {showColumnHeaders && (
            <div className={headerClass}>
              {columns.map((col, i) => (
                <span
                  key={i}
                  className={`admin-data-table__header-cell${
                    i === columns.length - 1
                      ? " admin-data-table__header-cell--action"
                      : ""
                  }`}
                >
                  {row[col.accessor]}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Rows ── */}
      {children}

      {/* ── Empty state ── */}
      {!children ||
        (Array.isArray(children) && children.length === 0 && (
          <div className="h-16 flex items-center justify-center text-[13px] text-[#6b7280]">
            {emptyMessage}
          </div>
        ))}

      {/* ── Pagination footer ── */}
      {showPagination && (
        <div className="admin-data-table__pagination-footer">
          <span className="admin-data-table__pagination-info">
            Showing&nbsp;
            <strong>{from} to {to}</strong>
            &nbsp;of {totalItems} {entityName}
          </span>

          <div className="admin-data-table__pagination-center">
            {buildPageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={`ellipsis-${i}`} className="admin-data-table__page-btn">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange?.(page)}
                  className={`admin-data-table__page-btn${
                    page === currentPage ? " admin-data-table__page-btn--active" : ""
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>

          <div className="admin-data-table__pagination-nav">
            <button
              type="button"
              className="admin-data-table__nav-btn"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              &lsaquo; Back
            </button>
            <button
              type="button"
              className="admin-data-table__nav-btn"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next &rsaquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}}
