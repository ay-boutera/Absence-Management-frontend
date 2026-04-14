"use client";

// ============================================
// AMS — ESI Sidi Bel Abbès
// AdminGroupsTable.jsx
// ============================================

import { useMemo, useState } from "react";
import DataTable from "@/components/shared/DataTable";
import { YearBadge, IconDots } from "@/components/shared/TableShared";
import useDashboardTable from "@/hooks/useDashboardTable";

const YEAR_THEME = {
  CP1: {
    accent: "#3b82f6",
    badgeBg: "#eaf2ff",
    badgeBorder: "#bfdbfe",
    badgeText: "#1d4ed8",
    chipBg: "#f0f7ff",
    chipBorder: "#dbeafe",
    chipText: "#1e40af",
  },
  CP2: {
    accent: "#10b981",
    badgeBg: "#e9fbf3",
    badgeBorder: "#bbf7d0",
    badgeText: "#047857",
    chipBg: "#effdf6",
    chipBorder: "#d1fae5",
    chipText: "#065f46",
  },
  CS1: {
    accent: "#8b5cf6",
    badgeBg: "#f2ecff",
    badgeBorder: "#ddd6fe",
    badgeText: "#6d28d9",
    chipBg: "#f7f2ff",
    chipBorder: "#ede9fe",
    chipText: "#5b21b6",
  },
  CS2: {
    accent: "#ec4899",
    badgeBg: "#fff0f8",
    badgeBorder: "#fbcfe8",
    badgeText: "#be185d",
    chipBg: "#fff5fa",
    chipBorder: "#fce7f3",
    chipText: "#9d174d",
  },
  CS3: {
    accent: "#ef4444",
    badgeBg: "#fff1f1",
    badgeBorder: "#fecaca",
    badgeText: "#b91c1c",
    chipBg: "#fff5f5",
    chipBorder: "#fee2e2",
    chipText: "#991b1b",
  },
  DEFAULT: {
    accent: "#64748b",
    badgeBg: "#f1f5f9",
    badgeBorder: "#e2e8f0",
    badgeText: "#334155",
    chipBg: "#f8fafc",
    chipBorder: "#e5e7eb",
    chipText: "#4b5563",
  },
};

function getYearTheme(year) {
  return YEAR_THEME[String(year).toUpperCase()] ?? YEAR_THEME.DEFAULT;
}

function ListViewIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.8125 3.5H11.8125"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.8125 7H11.8125"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.8125 10.5H11.8125"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.40625 4.15625C2.76869 4.15625 3.0625 3.86244 3.0625 3.5C3.0625 3.13756 2.76869 2.84375 2.40625 2.84375C2.04381 2.84375 1.75 3.13756 1.75 3.5C1.75 3.86244 2.04381 4.15625 2.40625 4.15625Z"
        fill="currentColor"
      />
      <path
        d="M2.40625 7.65625C2.76869 7.65625 3.0625 7.36244 3.0625 7C3.0625 6.63756 2.76869 6.34375 2.40625 6.34375C2.04381 6.34375 1.75 6.63756 1.75 7C1.75 7.36244 2.04381 7.65625 2.40625 7.65625Z"
        fill="currentColor"
      />
      <path
        d="M2.40625 11.1562C2.76869 11.1562 3.0625 10.8624 3.0625 10.5C3.0625 10.1376 2.76869 9.84375 2.40625 9.84375C2.04381 9.84375 1.75 10.1376 1.75 10.5C1.75 10.8624 2.04381 11.1562 2.40625 11.1562Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CardViewIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0.599976 5.84998H11.1M5.84997 0.599976V11.1M3.39998 0.599976H8.29998C9.28007 0.599976 9.77011 0.599976 10.1445 0.790714C10.4737 0.958493 10.7415 1.22621 10.9092 1.55549C11.1 1.92984 11.1 2.41988 11.1 3.39998V8.29998C11.1 9.28007 11.1 9.77011 10.9092 10.1445C10.7415 10.4737 10.4737 10.7415 10.1445 10.9092C9.77011 11.1 9.28007 11.1 8.29998 11.1H3.39998C2.41988 11.1 1.92984 11.1 1.55549 10.9092C1.22621 10.7415 0.958493 10.4737 0.790714 10.1445C0.599976 9.77011 0.599976 9.28007 0.599976 8.29998V3.39998C0.599976 2.41988 0.599976 1.92984 0.790714 1.55549C0.958493 1.22621 1.22621 0.958493 1.55549 0.790714C1.92984 0.599976 2.41988 0.599976 3.39998 0.599976Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COLUMNS = [
  "Year",
  "Section",
  "Groups",
  "Speciality",
  "Number of students",
  "abcence rate",
  "Action",
];
const PAGE_SIZE = 7;
function GroupRow({ group }) {
  const theme = getYearTheme(group.year);

  return (
    <div className="admin-groups-table__row">
      <div className="admin-data-table__cell admin-data-table__text-cell">
        <YearBadge
          value={group.year || "—"}
          style={{
            background: theme.badgeBg,
            borderColor: theme.badgeBorder,
            color: theme.badgeText,
          }}
        />
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {group.section || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {group.number || "—"}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {group.speciality || "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__text-cell">
        {group.studentCount ?? "—"}
      </div>
      <div className="admin-data-table__cell admin-data-table__text-cell">
        {group.absenceRate ? `${group.absenceRate}%` : "—"}
      </div>

      <div className="admin-data-table__cell admin-data-table__cell--action">
        <button
          type="button"
          className="admin-data-table__action-btn"
          aria-label={`Actions for ${group.section} ${group.year}`}
        >
          <IconDots />
        </button>
      </div>
    </div>
  );
}

function GroupCard({ group }) {
  const tags = Array.isArray(group.tags) ? group.tags : [];
  const theme = getYearTheme(group.year);

  return (
    <article className="admin-groups-card">
      <div className="admin-groups-card__header">
        <YearBadge
          value={`${group.year || "—"}`}
          style={{
            background: theme.badgeBg,
            borderColor: theme.badgeBorder,
            color: theme.badgeText,
          }}
        />

        <button
          type="button"
          className="admin-data-table__action-btn"
          aria-label={`Actions for ${group.year}`}
        >
          <IconDots />
        </button>
      </div>

      <div className="admin-groups-card__stats">
        <p>
          {" "}
          <span className="text-md font-semibold ">
            {group.studentCount ?? "—"}{" "}
          </span>{" "}
          students
        </p>
        <p>
          <span className="text-md font-semibold ">
            {group.sectionCount ?? 1}{" "}
          </span>
          section{" "}
        </p>
        <p>
          <span className="text-md font-semibold">
            {group.groupCount ?? "—"}{" "}
          </span>
          group
        </p>
      </div>

      <div className="admin-groups-card__chips">
        {tags.map((tag, idx) => (
          <span
            key={`${group.id}-tag-${idx}`}
            className="admin-groups-card__chip"
            style={{
              background: theme.chipBg,
              borderColor: theme.chipBorder,
              color: theme.chipText,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="admin-groups-card__footer">
        <button type="button" className="admin-groups-card__details-btn">
          See details ↗
        </button>
      </div>
    </article>
  );
}

function normalizeGroup(raw, index) {
  const numberValue = String(raw?.number ?? "");
  const extractedGroupCount = Number.parseInt(
    numberValue.replace(/\D/g, ""),
    10,
  );

  return {
    id: raw?.id || index,
    year: raw?.year || "—",
    section: raw?.section || "—",
    number: raw?.number || "—",
    speciality: raw?.speciality || "—",
    studentCount: raw?.student_count ?? null,
    absenceRate: raw?.absence_rate ?? null,
    sectionCount: raw?.section_count ?? 1,
    groupCount: Number.isNaN(extractedGroupCount)
      ? (raw?.group_count ?? "—")
      : extractedGroupCount,
    tags: Array.isArray(raw?.group_tags)
      ? raw.group_tags
      : [raw?.number, raw?.speciality].filter(Boolean),
  };
}

function mergeGroupsByYear(groups) {
  const byYear = new Map();

  groups.forEach((group) => {
    const yearKey = String(group.year || "—");

    if (!byYear.has(yearKey)) {
      byYear.set(yearKey, {
        id: `year-${yearKey}`,
        year: yearKey,
        studentCount: 0,
        sections: new Set(),
        tags: new Set(),
      });
    }

    const acc = byYear.get(yearKey);

    if (typeof group.studentCount === "number") {
      acc.studentCount += group.studentCount;
    }

    if (group.section && group.section !== "—") {
      acc.sections.add(group.section);
    }

    const groupTag =
      group.section && group.section !== "—"
        ? `${group.section}-${group.number}`
        : String(group.number || "");

    if (groupTag && groupTag !== "—") {
      acc.tags.add(groupTag);
    }
  });

  return Array.from(byYear.values()).map((merged) => ({
    id: merged.id,
    year: merged.year,
    studentCount: merged.studentCount || "—",
    sectionCount: merged.sections.size || "—",
    groupCount: merged.tags.size || "—",
    tags: Array.from(merged.tags),
  }));
}

export default function AdminGroupsTable({ groups = [] }) {
  const [viewMode, setViewMode] = useState("list");

  const {
    page,
    setPage,
    normalizedItems: normalizedGroups,
    pagedItems: pagedGroups,
    totalCount,
  } = useDashboardTable({
    items: groups,
    normalizeItem: normalizeGroup,
    pageSize: PAGE_SIZE,
    enableSearch: false,
  });

  const mergedYearGroups = useMemo(
    () => mergeGroupsByYear(normalizedGroups),
    [normalizedGroups],
  );

  const isCardView = viewMode === "card";
  const viewToggle = (
    <div
      className="admin-groups-table__view-toggle"
      role="tablist"
      aria-label="Groups view mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={!isCardView}
        className={`admin-groups-table__view-btn ${!isCardView ? "is-active" : ""}`}
        onClick={() => {
          setViewMode("list");
          setPage(1);
        }}
      >
        <ListViewIcon />
        List View
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={isCardView}
        className={`admin-groups-table__view-btn ${isCardView ? "is-active" : ""}`}
        onClick={() => {
          setViewMode("card");
          setPage(1);
        }}
      >
        <CardViewIcon />
        Card View
      </button>
    </div>
  );

  return (
    <DataTable
      title="Total Groups"
      count={normalizedGroups.length}
      showHead={true}
      showColumnHeaders={!isCardView}
      showSearch={false}
      showDefaultTools={false}
      columns={COLUMNS}
      tableClass="admin-groups-table"
      headerClass="admin-groups-table__header-row"
      footerClass="admin-groups-table__footer"
      rowLabel="groups"
      pagination={!isCardView ? {
        currentPage: page,
        totalItems: totalCount,
        pageSize: PAGE_SIZE,
        onPageChange: setPage,
        entityName: "groups",
      } : undefined}
      emptyMessage="No groups found."
      extraTools={viewToggle}
    >
      {isCardView ? (
        <div className="admin-groups-card-grid">
          {mergedYearGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        pagedGroups.map((group) => <GroupRow key={group.id} group={group} />)
      )}
    </DataTable>
  );
}
