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

/**
 * DataTable — shared table container used by Admin/Session tables.
 *
 * Props:
 *  - icon          JSX   custom icon for toolbar (defaults to IconGroup)
 *  - title         string  e.g. "Total Students"
 *  - count         number
 *  - searchQuery   string
 *  - onSearch      fn(value)
 *  - placeholder   string  search input placeholder
 *  - columns       string[]  column header labels
 *  - children      ReactNode  the rendered rows
 *  - emptyMessage  string
 *  - extraTools    ReactNode  extra buttons appended after Sort (optional)
 *  - tableClass    string  BEM modifier class on the root div
 *  - headerClass   string  BEM class for the header row div
 *  - rowsClass     string  BEM class wrapping children (optional)
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
}) {
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
                <span className="admin-data-table__title">{title}</span>
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

      {/* ── Rows ── */}
      {children}

      {/* ── Empty state ── */}
      {!children ||
        (Array.isArray(children) && children.length === 0 && (
          <div className="h-16 flex items-center justify-center text-[13px] text-[#6b7280]">
            {emptyMessage}
          </div>
        ))}
    </div>
  );
}
