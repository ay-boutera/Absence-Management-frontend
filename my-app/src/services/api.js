import axios from "axios";
import { CONFIG, API_ENDPOINTS } from "@/lib/constants";

const api = axios.create({
  baseURL: "/api",  // ← was CONFIG.API_URL or the env var
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ── Response Interceptor ──────────────────────────────
// If backend returns 401 → try to refresh the token once
// If refresh fails → redirect to login

let isRefreshing = false;
let failedQueue = [];
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf_token="))
      ?.split("=")[1];

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
  }

  return config;
});
const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(API_ENDPOINTS.REFRESH_TOKEN)
    ) {
      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        
        await api.post(API_ENDPOINTS.REFRESH_TOKEN);
        processQueue(null);
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        processQueue(refreshError);
        // Refresh failed → force logout → redirect to login
        if (typeof window !== "undefined") {
        window.location.href = "/login";
}
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;