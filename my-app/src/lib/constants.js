// ============================================
// AMS — ESI Sidi Bel Abbès
// constants.js — Global Constants
// Web Version : Admin & Teacher only
// ============================================

// ----------------------------
// APP CONFIG
// ----------------------------
export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
};
// ----------------------------
// USER ROLES — must match backend exactly
// ----------------------------
export const ROLES = {
  ADMIN:   "admin",
  TEACHER: "teacher",
};

// ----------------------------
// ACCOUNT STATUSES
// ----------------------------
export const STATUSES = {
  ACTIVE:   "active",
  DISABLED: "disabled",
};

// ----------------------------
// JWT TOKEN CONFIG
// ----------------------------
export const TOKEN = {
  ACCESS_EXPIRY:    15 * 60 * 1000,            // 15 minutes in ms
  REFRESH_EXPIRY:    7 * 24 * 60 * 60 * 1000, // 7 days in ms
  REFRESH_INTERVAL: 14 * 60 * 1000,            // refresh every 14 min
  INACTIVITY_LIMIT: 30 * 60 * 1000,            // auto logout after 30 min
};

// ----------------------------
// ROLE-BASED REDIRECT ROUTES
// ----------------------------
export const ROLE_ROUTES = {
  [ROLES.ADMIN]:   "/admin",
  [ROLES.TEACHER]: "/teacher",
};

// ----------------------------
// API ENDPOINTS — matches backend Swagger exactly
// token is handled by httpOnly cookie — never in localStorage
// ----------------------------
export const API_ENDPOINTS = {
  LOGIN:                  "/v1/auth/login",
  LOGOUT:                 "/v1/auth/logout",
  REFRESH_TOKEN:          "/v1/auth/refresh",
  RESET_PASSWORD:         "/v1/auth/reset-password",
  RESET_PASSWORD_CONFIRM: "/v1/auth/reset-password/confirm",
  CHANGE_PASSWORD:        "/v1/auth/change-password",
  ME:                     "/v1/auth/me",
  GOOGLE_AUTH:            "/v1/auth/google",
  USERS:                  "/v1/users/",
  STUDENTS:                  "/v1/students/",
  TEACHERS:                  "/v1/teachers/",
  USER_ME:                "/v1/users/me",
};