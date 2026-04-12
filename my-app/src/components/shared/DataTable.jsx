// ============================================
// AMS — ESI Sidi Bel Abbès
// DataTable.jsx — Shared table shell
// ============================================

"use client";
import {
  IconSearch,
  FilterIcon,
  SortIcon,
} from "@/components/shared/TableShared";

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
  const {
    currentPage = 1,
    totalItems = 0,
    pageSize = 7,
    onPageChange,
    entityName = "items",
  } = pagination ?? {};

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  function buildPageNumbers() {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const show = new Set(
      [1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(
        (p) => p >= 1 && p <= totalPages,
      ),
    );
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
                {icon ?? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9775 2.66671C12.2708 2.66671 13.3108 3.71337 13.3108 5.00004C13.3108 6.26004 12.3108 7.28671 11.0642 7.33337C11.0108 7.32671 10.9508 7.32671 10.8908 7.33337M12.2642 13.3334C12.7442 13.2334 13.1975 13.04 13.5708 12.7534C14.6108 11.9734 14.6108 10.6867 13.5708 9.90671C13.2042 9.62671 12.7575 9.44004 12.2842 9.33337M6.14416 7.24671C6.0775 7.24004 5.9975 7.24004 5.92416 7.24671C4.3375 7.19337 3.0775 5.89337 3.0775 4.29337C3.0775 2.66004 4.3975 1.33337 6.0375 1.33337C7.67083 1.33337 8.9975 2.66004 8.9975 4.29337C8.99083 5.89337 7.73083 7.19337 6.14416 7.24671ZM2.81083 9.70671C1.1975 10.7867 1.1975 12.5467 2.81083 13.62C4.64416 14.8467 7.65083 14.8467 9.48416 13.62C11.0975 12.54 11.0975 10.78 9.48416 9.70671C7.6575 8.48671 4.65083 8.48671 2.81083 9.70671Z"
                      stroke="black"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
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
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.16666 2.68333C1.16666 2.35664 1.16666 2.19329 1.23024 2.06851C1.28616 1.95874 1.3754 1.86951 1.48516 1.81358C1.60994 1.75 1.77329 1.75 2.09999 1.75H11.9C12.2267 1.75 12.39 1.75 12.5148 1.81358C12.6246 1.86951 12.7138 1.95874 12.7697 2.06851C12.8333 2.19329 12.8333 2.35664 12.8333 2.68333V3.07381C12.8333 3.23061 12.8333 3.30901 12.8142 3.38191C12.7972 3.44651 12.7692 3.50772 12.7315 3.56286C12.689 3.62508 12.6298 3.67643 12.5113 3.77912L8.78039 7.01254C8.6619 7.11524 8.60265 7.16658 8.56011 7.22881C8.52241 7.28395 8.49446 7.34515 8.47748 7.40975C8.45832 7.48266 8.45832 7.56106 8.45832 7.71785V10.7674C8.45832 10.8815 8.45832 10.9385 8.43992 10.9878C8.42367 11.0314 8.39723 11.0704 8.36281 11.1017C8.32385 11.1371 8.27089 11.1583 8.16497 11.2007L6.18164 11.994C5.96724 12.0798 5.86004 12.1226 5.77398 12.1048C5.69873 12.0891 5.63269 12.0444 5.59022 11.9804C5.54166 11.9071 5.54166 11.7916 5.54166 11.5607V7.71785C5.54166 7.56106 5.54166 7.48266 5.5225 7.40975C5.50552 7.34515 5.47757 7.28395 5.43987 7.22881C5.39733 7.16658 5.33808 7.11524 5.21959 7.01254L1.48872 3.77912C1.37023 3.67643 1.31099 3.62508 1.26844 3.56286C1.23074 3.50772 1.2028 3.44651 1.18582 3.38191C1.16666 3.30901 1.16666 3.23061 1.16666 3.07381V2.68333Z"
                        stroke="#030712"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Filter
                  </button>
                  <button
                    type="button"
                    className="admin-data-table__control-btn"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.5 9H13.5"
                        stroke="#030712"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.6875 5.625H16.3125"
                        stroke="#030712"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.3125 12.375H10.6875"
                        stroke="#030712"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
                  className={` font-normal text-[12px] leading-[12.5%] text-[#4a5567] admin-data-table__header-cell${
                    i === columns.length - 1
                      ? " admin-data-table__header-cell--action"
                      : ""
                  }`}
                >
                  {typeof col === "string" ? col : col.label}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Rows ── */}
      {children}

      {/* ── Empty state ── */}
      {(!children || (Array.isArray(children) && children.length === 0)) && (
        <div className="h-16 flex items-center justify-center text-[13px] text-[#6b7280]">
          {emptyMessage}
        </div>
      )}

      {/* ── Pagination footer ── */}
      {showPagination && (
        <div className="admin-data-table__pagination-footer">
          <span className="admin-data-table__pagination-info">
            Showing&nbsp;
            <strong>
              {from} to {to}
            </strong>
            &nbsp;of {totalItems} {entityName}
          </span>

          <div className="admin-data-table__pagination-center">
            {buildPageNumbers().map((page, i) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="admin-data-table__page-btn"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => onPageChange?.(page)}
                  className={`admin-data-table__page-btn${
                    page === currentPage
                      ? " admin-data-table__page-btn--active"
                      : ""
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
}
