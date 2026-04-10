// ============================================
// AMS — ESI Sidi Bel Abbès
// services/authService.js — Auth API Calls
// ============================================

import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

// ── Login ─────────────────────────────────────
// Backend sets httpOnly cookie automatically on success
export const login = async (email, password) => {
  const response = await api.post(
    API_ENDPOINTS.LOGIN,
    {
      identifier: email,
      password: password,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
};

// ── Logout ────────────────────────────────────
// Backend clears the httpOnly cookie
export const logout = async () => {
  await api.post(API_ENDPOINTS.LOGOUT);
};

// ── Get Current User ──────────────────────────
// Used on page refresh to rehydrate the store
// Works because the cookie is sent automatically
export const getMe = async () => {
  const response = await api.get(API_ENDPOINTS.ME);
  return response.data; // { id, first_name, last_name, email, role }
};

// ── Refresh Token ─────────────────────────────
// Called automatically by api.js interceptor — no need to call manually
export const refreshToken = async () => {
  await api.post(API_ENDPOINTS.REFRESH_TOKEN);
};

// ── forget Password ───────────────────────────
// Sends reset link to email (valid 30min)
export const forgetPassword = async (email) => {
  const response = await api.post(API_ENDPOINTS.RESET_PASSWORD, { email });
  return response.data;
};

// ── Reset Password Confirm ────────────────────
// Called when user clicks the link in their email
export const resetPasswordConfirm = async (
  token,
  new_password,
  confirm_password,
) => {
  const response = await api.post(API_ENDPOINTS.RESET_PASSWORD_CONFIRM, {
    token,
    new_password: new_password,
    confirm_password: confirm_password,
  });
  return response.data;
};

// ── Change Password ───────────────────────────
// For logged-in users who want to change their password
export const changePassword = async (
  current_password,
  new_password,
  confirm_password,
) => {
  const response = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
    current_password: current_password,
    new_password: new_password,
    confirm_password: confirm_password,
  });
  return response.data;
};
