// ============================================
// AMS — ESI Sidi Bel Abbès
// services/exportService.js — Export API Calls
// ============================================

import api from "./api";
import { API_ENDPOINTS } from "@/lib/constants";

/**
 * Build clean query params — omits null/empty/undefined values so the
 * backend doesn't receive empty strings as filter values.
 */
function buildParams(filters = {}, extra = {}) {
  const params = {};
  const all = { ...filters, ...extra };
  for (const [key, value] of Object.entries(all)) {
    if (value !== null && value !== undefined && value !== "") {
      params[key] = value;
    }
  }
  return params;
}

/**
 * Preview absences as JSON for the table.
 * Uses the same endpoint but axios returns JSON rows for display.
 *
 * @param {object} filters  { filiere, code_module, date_from, date_to, matricule_etudiant }
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ items: object[], total: number }>}
 */
export const previewAbsences = async (filters, page = 1, pageSize = 10) => {
  const response = await api.get(API_ENDPOINTS.EXPORT_ABSENCES, {
    params: buildParams(filters, { page, page_size: pageSize }),
    headers: { Accept: "application/json" },
  });
  return response.data; // { items: [...], total: N }
};

/**
 * Download absences as a CSV file.
 * Fetches the full result (page_size=1000) and triggers a browser download.
 *
 * @param {object} filters  { filiere, code_module, date_from, date_to, matricule_etudiant }
 * @param {string} filename  suggested filename (default: absences.csv)
 */
export const downloadAbsencesCSV = async (
  filters,
  filename = "absences.csv",
) => {
  const response = await api.get(API_ENDPOINTS.EXPORT_ABSENCES, {
    params: buildParams(filters, { page: 1, page_size: 1000 }),
    headers: { Accept: "text/csv" },
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Cleanup
  link.remove();
  URL.revokeObjectURL(url);
};