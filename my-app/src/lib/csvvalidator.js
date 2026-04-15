/**
 * lib/csvValidator.js
 *
 * Validates a CSV file's column headers against the expected schema
 * BEFORE sending anything to the backend.
 *
 * Why do this on the frontend?
 *   → Faster feedback for the admin (no waiting for a server round-trip)
 *   → Prevents sending obviously broken files to the backend
 *   → Matches US-16: "System validates CSV column format before import"
 *
 * How it works:
 *   1. Read the first line of the file (the header row)
 *   2. Split it by the separator (, or ;)
 *   3. Compare the found columns against the required columns in the schema
 *   4. Return a result object: { valid: true/false, missing: [], extra: [] }
 */

import { CSV_SCHEMAS, IMPORT_TYPE_TO_SCHEMA } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Main export — call this before showing the preview or submitting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * validateCSV
 *
 * @param {File}   file        — the File object from the file input
 * @param {number} importType  — 0 (students) | 1 (teachers) | 2 (timetable)
 * @returns {Promise<ValidationResult>}
 *
 * ValidationResult shape:
 * {
 *   valid:    boolean,      — true if all required columns are present
 *   missing:  string[],    — required columns that are NOT in the file
 *   extra:    string[],    — columns in the file that are not in the schema (just informational)
 *   found:    string[],    — all columns the validator actually found in the file
 *   schema:   string[],    — the required columns we checked against
 *   message:  string,      — human-readable summary (empty if valid)
 * }
 */
export async function validateCSV(file, importType) {
  // ── 1. Get the schema for this import type ─────────────────────────────────
  const schemaKey = IMPORT_TYPE_TO_SCHEMA[importType];
  const schema = CSV_SCHEMAS[schemaKey];

  // Safety check — if no schema found, skip validation and allow the upload
  if (!schema) {
    return makeResult({ valid: true, missing: [], extra: [], found: [], schema: [] });
  }

  // ── 2. Read only the first line of the file (the header row) ──────────────
  // We don't need to read the whole file — just the headers
  let firstLine;
  try {
    firstLine = await readFirstLine(file);
  } catch {
    return makeResult({
      valid: false,
      missing: schema.required,
      extra: [],
      found: [],
      schema: schema.required,
      message: "Could not read the file. Make sure it is a valid UTF-8 CSV.",
    });
  }

  if (!firstLine || firstLine.trim() === "") {
    return makeResult({
      valid: false,
      missing: schema.required,
      extra: [],
      found: [],
      schema: schema.required,
      message: "The file appears to be empty.",
    });
  }

  // ── 3. Detect separator and split headers ─────────────────────────────────
  // We support both comma (,) and semicolon (;) separated files
  const separator = firstLine.includes(";") ? ";" : ",";
  const foundHeaders = firstLine
    .split(separator)
    .map((h) => h.trim().toLowerCase().replace(/^"|"$/g, "")); // remove quotes if any

  // ── 4. Check for missing required columns ─────────────────────────────────
  const requiredLower = schema.required.map((c) => c.toLowerCase());
  const missing = requiredLower.filter((col) => !foundHeaders.includes(col));

  // ── 5. Check for timetable special rule ───────────────────────────────────
  // For timetable, the file must have EITHER "section" OR "speciality"
  // (not necessarily both — it depends on the year/program type)
  let specialRuleError = null;
  if (schemaKey === "timetable") {
    const hasSectionOrSpeciality =
      foundHeaders.includes("section") || foundHeaders.includes("speciality");
    if (!hasSectionOrSpeciality) {
      specialRuleError =
        'At least one of "section" or "speciality" must be present.';
    }
  }

  // ── 6. Find extra columns (not in schema — informational only) ────────────
  const allKnownColumns = [
    ...requiredLower,
    ...schema.optional.map((c) => c.toLowerCase()),
  ];
  const extra = foundHeaders.filter((col) => !allKnownColumns.includes(col));

  // ── 7. Build the result ───────────────────────────────────────────────────
  const isValid = missing.length === 0 && !specialRuleError;

  let message = "";
  if (!isValid) {
    const parts = [];
    if (missing.length > 0) {
      parts.push(`Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);
    }
    if (specialRuleError) {
      parts.push(specialRuleError);
    }
    parts.push(`Expected columns: ${schema.required.join(", ")}.`);
    message = parts.join(" ");
  }

  return makeResult({
    valid: isValid,
    missing,
    extra,
    found: foundHeaders,
    schema: schema.required,
    message,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — reads only the first line of a File object
// We use a slice so we don't load the entire file into memory
// ─────────────────────────────────────────────────────────────────────────────
function readFirstLine(file) {
  return new Promise((resolve, reject) => {
    // Read only the first 2KB — more than enough for any header row
    const slice = file.slice(0, 2048);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      // Take only the first line
      const firstLine = text.split(/\r?\n/)[0];
      resolve(firstLine);
    };

    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsText(slice, "utf-8");
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper — builds a consistent result object
// ─────────────────────────────────────────────────────────────────────────────
function makeResult({ valid, missing = [], extra = [], found = [], schema = [], message = "" }) {
  return { valid, missing, extra, found, schema, message };
}

// ─────────────────────────────────────────────────────────────────────────────
// Named export — for use in tests or if you already have the headers as an array
// ─────────────────────────────────────────────────────────────────────────────

/**
 * validateHeaders
 *
 * Lighter version — use this if you already parsed the CSV and have the headers.
 *
 * @param {string[]} headers    — array of column names (already lowercased + trimmed)
 * @param {number}   importType — 0 | 1 | 2
 * @returns {ValidationResult}
 */
export function validateHeaders(headers, importType) {
  const schemaKey = IMPORT_TYPE_TO_SCHEMA[importType];
  const schema = CSV_SCHEMAS[schemaKey];

  if (!schema) return makeResult({ valid: true, missing: [], extra: [], found: headers, schema: [] });

  const requiredLower = schema.required.map((c) => c.toLowerCase());
  const missing = requiredLower.filter((col) => !headers.includes(col));

  let specialRuleError = null;
  if (schemaKey === "timetable") {
    const hasSectionOrSpeciality =
      headers.includes("section") || headers.includes("speciality");
    if (!hasSectionOrSpeciality) {
      specialRuleError = 'At least one of "section" or "speciality" must be present.';
    }
  }

  const allKnownColumns = [
    ...requiredLower,
    ...schema.optional.map((c) => c.toLowerCase()),
  ];
  const extra = headers.filter((col) => !allKnownColumns.includes(col));

  const isValid = missing.length === 0 && !specialRuleError;

  let message = "";
  if (!isValid) {
    const parts = [];
    if (missing.length > 0) {
      parts.push(`Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`);
    }
    if (specialRuleError) parts.push(specialRuleError);
    parts.push(`Expected columns: ${schema.required.join(", ")}.`);
    message = parts.join(" ");
  }

  return makeResult({ valid: isValid, missing, extra, found: headers, schema: schema.required, message });
}