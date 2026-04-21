// ============================================
// AMS — ESI Sidi Bel Abbès
// hooks/useAuth.js
// Rehydrates store on page refresh + auto token refresh
// ============================================

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMe } from "@/services/authService";
import { TOKEN } from "@/lib/constants";

export function useAuth() {
  const { setUser, setAuth, clearAuth, isAuthenticated, setAuthLoading } =
    useAuthStore();

  useEffect(() => {
    // ── Rehydrate store on page refresh ──────
    // If already authenticated (e.g. just logged in), skip the getMe() call.
    // Only fetch when the store is empty but a cookie might still exist (hard refresh).
    if (isAuthenticated) {
      setAuthLoading(false);
      return;
    }

    const rehydrate = async () => {
      setAuthLoading(true);
      try {
        const user = await getMe();
        // setAuth will set isAuthenticated: true and isAuthLoading: false
        setAuth(user);
      } catch (err) {
        // Cookie expired or invalid → clear store
        clearAuth();
      }
    };
    rehydrate();
  }, [setAuth, clearAuth, setAuthLoading, isAuthenticated]);

  useEffect(() => {
    // ── Auto refresh token every 14 minutes ──
    // Only when user is authenticated
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await import("@/services/authService").then(({ refreshToken }) =>
          refreshToken(),
        );
      } catch (err) {
        // Refresh failed → force logout
        clearAuth();
        window.location.href = "/login";
      }
    }, TOKEN.REFRESH_INTERVAL); // 14 minutes

    return () => clearInterval(interval); // cleanup on unmount
  }, [isAuthenticated, clearAuth]);
}
