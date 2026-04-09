"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// DataTable.jsx — Shared table shell
// ============================================

import {
  IconGroup,
  IconSearch,
  FilterIcon,
  SortIcon,
} from "@/components/shared/TableShared";
import { useLayoutEffect, useRef, useState } from "react";

// ── Pagination helpers ──────────────────────────────────────────────────────

function buildPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, "…", total);
  } else if (current >= total - 3) {
    pages.push(1, "…", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, "…", current - 1, current, current + 1, "…", total);
  }
  return pages;
}

function ChevronLeft() {
  return (
    <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden>
      <path
        d="M6 1L1.5 5.5L6 10"
        stroke="#030712"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="7" height="11" viewBox="0 0 7 11" fill="none" aria-hidden>
      <path
        d="M1 1L5.5 5.5L1 10"
        stroke="#030712"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Component ───────────────────────────────────────────────────────────────

/**
 * DataTable — shared table container used by Admin/Session tables.
 *
 * Props:
 *  - icon            JSX       custom icon for toolbar (defaults to IconGroup)
 *  - title           string    e.g. "Total Students"
 *  - count           number    total record count (for toolbar display)
 *  - searchQuery     string
 *  - onSearch        fn(value)
 *  - placeholder     string    search input placeholder
 *  - columns         string[]  column header labels
 *  - children        ReactNode the rendered rows
 *  - emptyMessage    string
 *  - extraTools      ReactNode extra buttons appended after Sort (optional)
 *  - tableClass      string    BEM modifier class on the root div
 *  - headerClass     string    BEM class for the header row div
 *  - footerClass     string    optional class appended to pagination footer
 *  ── Pagination ──
 *  - rowLabel        string    e.g. "students" — shown in "Showing X to Y of Z students"
 *  - page            number    current 1-based page (omit to hide pagination)
 *  - pageSize        number    rows per page (default 7)
 *  - totalCount      number    total records from API
 *  - onPageChange    fn(page)
 */
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
  footerClass = "",
  // pagination
  rowLabel = "results",
  page,
  pageSize = 7,
  totalCount,
  onPageChange,
}) {
  const hasPagination =
    typeof page === "number" &&
    typeof totalCount === "number" &&
    typeof onPageChange === "function";

  const totalPages = hasPagination
    ? Math.max(1, Math.ceil(totalCount / pageSize))
    : 1;
  const from =
    hasPagination && totalCount > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = hasPagination ? Math.min(page * pageSize, totalCount) : 0;
  const pageList = hasPagination ? buildPageList(page, totalPages) : [];
  const bodyRef = useRef(null);
  const [fullPageBodyHeight, setFullPageBodyHeight] = useState(0);
  const [currentRowsHeight, setCurrentRowsHeight] = useState(0);

  const visibleRowCount = Array.isArray(children)
    ? children.length
    : children
      ? 1
      : 0;

  useLayoutEffect(() => {
    if (!hasPagination) return;

    const bodyEl = bodyRef.current;
    if (!bodyEl) return;

    const rowElements = Array.from(bodyEl.children).filter((el) => {
      return (
        !el.classList.contains("admin-data-table__rows-filler") &&
        !el.classList.contains("admin-data-table__empty")
      );
    });

    const measuredRowsHeight = Math.ceil(
      rowElements.reduce(
        (sum, el) => sum + el.getBoundingClientRect().height,
        0,
      ),
    );

    if (measuredRowsHeight !== currentRowsHeight) {
      setCurrentRowsHeight(measuredRowsHeight);
    }

    if (visibleRowCount === pageSize && measuredRowsHeight > 0) {
      setFullPageBodyHeight((prev) => Math.max(prev, measuredRowsHeight));
    }
  }, [hasPagination, page, pageSize, visibleRowCount, currentRowsHeight]);

  const fillerHeight =
    hasPagination && visibleRowCount > 0 && visibleRowCount < pageSize
      ? Math.max(0, fullPageBodyHeight - currentRowsHeight)
      : 0;

  return (
    <div className={`admin-data-table ${tableClass}`}>
      {showHead && (
        <>
          {/* ── Toolbar ── */}
          <div className="admin-data-table__toolbar">
            <div className="admin-data-table__title-wrap">
              <div className="admin-data-table__title-icon">
                {icon ?? <IconGroup />}
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
                  {col}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <div className="admin-data-table__body" ref={bodyRef}>
        {/* ── Rows ── */}
        {children}

        {fillerHeight > 0 && (
          <span
            className="admin-data-table__rows-filler"
            style={{ height: `${fillerHeight}px`, display: "block" }}
            aria-hidden="true"
          />
        )}

        {/* ── Empty state ── */}
        {(!children || (Array.isArray(children) && children.length === 0)) && (
          <div className="admin-data-table__empty">{emptyMessage}</div>
        )}
      </div>

      {/* ── Pagination footer ── */}
      {hasPagination && (
        <div
          className={`admin-data-table__footer${footerClass ? ` ${footerClass}` : ""}`}
        >
          {/* Left: showing info */}
          <p className="admin-data-table__footer-info">
            <span className="admin-data-table__footer-label">Showing </span>
            <span className="admin-data-table__footer-range">
              {from} to {to} of {totalCount}
            </span>
            <span className="admin-data-table__footer-label"> {rowLabel}</span>
          </p>

          {/* Center: page numbers */}
          <div className="admin-data-table__page-numbers">
            {pageList.map((p, i) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="admin-data-table__page-ellipsis"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`admin-data-table__page-btn${
                    p === page ? " admin-data-table__page-btn--active" : ""
                  }`}
                  onClick={() => onPageChange(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </button>
              ),
            )}
          </div>

          {/* Right: Back / Next */}
          <div className="admin-data-table__footer-nav">
            <button
              type="button"
              className="admin-data-table__nav-btn"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft />
              Back
            </button>
            <button
              type="button"
              className="admin-data-table__nav-btn"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
