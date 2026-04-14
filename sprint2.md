# Sprint 2 — Import / Export des Données

> **ESI Sidi Bel Abbès** · AMS Frontend · PFA 2025–2026
> **Duration:** 2 weeks · **8 User Stories** · **39 Story Points**

---

## Sprint Goal

Allow the Administrator to import student lists and session planning from Progres via CSV, preview the data before saving, and export absence reports with advanced filters (CSV + PDF with ESI-SBA header).

---

## User Stories

| ID    | Role            | User Story                                                                  | Priority | Points | Status      |
| ----- | --------------- | --------------------------------------------------------------------------- | -------- | ------ | ----------- |
| US-10 | Admin           | Import a CSV file of student list (from Progres) to populate the database   | High     | 8      | Done        |
| US-11 | Admin           | Import a CSV file of session planning (sessions, rooms, teachers)           | High     | 8      | In Progress |
| US-12 | Admin           | See a detailed error report after each CSV import (line, field, error type) | High     | 5      | Done        |
| US-13 | Admin           | Consult the history of all imports (date, file, status, rows imported)      | Medium   | 3      | Done        |
| US-14 | Admin / Teacher | Export absence data as CSV with filters (filière, module, dates, student)   | High     | 5      | To Do       |
| US-15 | Admin           | Export a formatted PDF absence report with ESI-SBA header                   | Medium   | 5      | To Do       |
| US-16 | Admin           | System validates CSV column format before import to avoid corrupted data    | High     | 3      | In Progress |
| US-17 | Admin           | Receive a notification in case of a critical error during import            | Medium   | 2      | In Progress |

---

## Screens (from Figma)

| Screen                         | Node ID     | Description                                                     |
| ------------------------------ | ----------- | --------------------------------------------------------------- |
| Import / Export — empty state  | `354:14527` | 3 type cards + upload zone (dashed border)                      |
| Import / Export — after upload | `361:7005`  | "Uploaded successfully" + preview table + Submit & save buttons |
| Import / Export — with errors  | `361:8057`  | Error state after validation failure                            |
| Import History                 | `367:8958`  | Table of past imports with date, file, status, rows             |
| Export data panel              | `375:12019` | Filter panel (filière, module, dates) + CSV/PDF buttons         |

---

## Files to Implement

### Pages

| File                                            | User Story                 | Status      |
| ----------------------------------------------- | -------------------------- | ----------- |
| `app/(dashboard)/admin/import/page.jsx`         | US-10, US-11, US-12, US-17 | In Progress |
| `app/(dashboard)/admin/import/history/page.jsx` | US-13                      | Done        |
| `app/(dashboard)/admin/import/export/page.jsx`  | US-14, US-15               | To Do       |

### Components

| File                                              | User Story         | Status |
| ------------------------------------------------- | ------------------ | ------ |
| `components/dashboard/ImportButton.jsx`           | US-10, US-11       | Done   |
| `components/dashboard/ImportErrorReportModal.jsx` | US-12              | Done   |
| `components/import/CriticalErrorNotification.jsx` | US-17              | Done   |
| `components/dashboard/ImportPreviewTable.jsx`     | US-10, US-11       | To Do  |
| `components/dashboard/ImportHistoryTable.jsx`     | US-13              | Done   |
| `components/dashboard/ExportFilterPanel.jsx`      | US-14, US-15       | To Do  |
| `components/dashboard/ExportButton.jsx`           | US-14, US-15       | To Do  |
| `components/shared/StatusBadge.jsx`               | US-10 (Safe/Exclu) | To Do  |

- **`ImportButton.jsx`** — import type card selector (`students` | `teachers` | `sessions`) used in `/admin/import`.
- **CSV upload zone** — currently implemented inline in `app/(dashboard)/admin/import/page.jsx` (same principle as `CsvUploadZone`).
- **`ImportPreviewTable.jsx`** — planned table for pre-save preview with pagination.
- **`ImportErrorReportModal.jsx`** — detailed row/field import error report (US-12).
- **Import history table UI** — currently implemented inline in `app/(dashboard)/admin/import/history/page.jsx`.

### Logic

| File                         | User Story                        | Status                                                    |
| ---------------------------- | --------------------------------- | --------------------------------------------------------- |
| `services/importService.js`  | US-10, US-11, US-12, US-13, US-16 | Done                                                      |
| `services/exportService.js`  | US-14, US-15                      | To Do                                                     |
| `hooks/useImport.js`         | US-10, US-11, US-12, US-16, US-17 | To Do (logic currently inline in `admin/import/page.jsx`) |
| `hooks/useExport.js`         | US-14, US-15                      | To Do                                                     |
| `hooks/useDashboardTable.js` | Shared pagination/filter state    | Done                                                      |
| `lib/csvValidator.js`        | US-16 — column schema validation  | To Do                                                     |
| `lib/constants.js`           | Add: CSV_SCHEMAS, STUDENT_STATUS  | To Do                                                     |

---

## Backend Endpoints

| Endpoint                                | Needed By            | Status |
| --------------------------------------- | -------------------- | ------ |
| `POST /api/v1/import/students`          | CsvUploadZone        | DONE   |
| `POST /api/v1/import/teachers`          | CsvUploadZone        | To Do  |
| `POST /api/v1/import/planning`          | CsvUploadZone        | To Do  |
| `POST /api/v1/import/confirm/:importId` | Submit & save button | To Do  |
| `GET /api/v1/import-export/history`     | Import history page  | Done   |
| `GET /api/v1/export/csv`                | ExportFilterPanel    | To Do  |
| `GET /api/v1/export/pdf`                | ExportFilterPanel    | To Do  |

### CSV Column Schemas

| Import Type      | Expected Columns                                                       |
| ---------------- | ---------------------------------------------------------------------- |
| Students         | `matricule`, `name`, `first_name`, `email`, `year`, `group`            |
| Teachers         | `matricule`, `name`, `first_name`, `email`                             |
| Session Planning | `date`, `start_time`, `end_time`, `module`, `teacher`, `room`, `group` |

> Separator: semicolon `;` · Encoding: UTF-8

---

## Blockers

| Blocker                                | Solution                                              |
| -------------------------------------- | ----------------------------------------------------- |
| `POST /import/*` not yet implemented   | Backend teammate needs to implement before preview UI |
| `GET /export/pdf` requires PDF library | Backend must configure ESI-SBA header template        |

---

## Remaining Tasks

### Import Flow

- [x] Build import type selector — implemented via `components/dashboard/ImportButton.jsx` in `app/(dashboard)/admin/import/page.jsx`
- [x] Build CSV upload zone — implemented inline in `app/(dashboard)/admin/import/page.jsx` (file picker + success/error states)
- [ ] Build `csvValidator.js` — validate columns before sending to backend (US-16)
- [ ] Build `components/dashboard/ImportPreviewTable.jsx` — preview table with Safe/Exclu badges + pagination
- [x] Build `components/dashboard/ImportErrorReportModal.jsx` — detailed errors per line/field (US-12)
- [x] Build `CriticalErrorNotification.jsx` — in-app alert on critical import failure (US-17)
- [x] Build import history table UI — implemented inline in `app/(dashboard)/admin/import/history/page.jsx` (US-13)
- [x] Wire `importService.js` — upload endpoints implemented in `services/importService.js`
- [ ] Wire `useImport.js` — extract upload state/preview/submit/errors from `admin/import/page.jsx`
- [ ] Complete `/admin/import` page — preview table and schema validation still pending
- [x] Complete `/admin/import/history` page — import history table (US-13)

### Export Flow

- [ ] Build `ExportFilterPanel.jsx` — filters: filière, module, date range, student
- [ ] Build `ExportButton.jsx` — CSV and PDF download triggers
- [ ] Wire `exportService.js` — call CSV and PDF endpoints with filters
- [ ] Wire `useExport.js` — manage filter state + download
- [ ] Complete `/admin/import/export` page — "Export data" flow (US-14, US-15)

### Testing

- [x] Test import students CSV — valid file → preview table appears
- [x] Test import students CSV — invalid columns → error report shown (US-16, US-12)
- [ ] Test import planning CSV — valid file → preview
- [x] Test submit & save — students written to DB, credentials
- [ ] Test critical error notification (US-17)
- [ ] Test import history page — shows correct entries (US-13)
- [ ] Test export CSV — filters applied, file downloads (US-14)
- [ ] Test export PDF — ESI-SBA header present (US-15)
- [ ] Test teacher can access export CSV (US-14)
- [ ] Test teacher cannot access export PDF (US-15 — Admin only)

### Sprint Review Prep

- [ ] Code cleanup
- [ ] All PRs reviewed and merged to main
- [ ] Demo ready for Sprint Review
- [ ] Deploy to staging

---

## Definition of Done

- [x] Admin can select import type (students / teachers / planning)
- [ ] Admin can upload a CSV file and see a live preview table before saving
- [ ] System validates CSV columns before import — corrupted files rejected (US-16)
- [x] Admin sees a detailed error report (line, field, type) on import failure (US-12)
- [x] Admin receives in-app notification on critical import error (US-17)
- [ ] On Submit & save, data is written to DB and credentials email sent to each student
- [x] Admin can consult the full import history (US-13)
- [ ] Admin and Teacher can export absences as CSV with filters (US-14)
- [ ] Admin can export a formatted PDF report with ESI-SBA header (US-15)
- [ ] All routes protected — Teacher cannot access Admin-only export
- [ ] All PRs reviewed and merged to main
- [ ] Demo approved in Sprint Review
- [ ] Deployed to staging

> Never push to `main` directly — open a PR and wait for lead developer approval.
