// ============================================
// AMS — ESI Sidi Bel Abbès
// hooks/useRoleGuard.js
// Use inside pages to check role programmatically
// ============================================

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/constants";

export function useRoleGuard(allowedRoles) {
  const router                    = useRouter();
  const { role, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(role)) {
      if (role === ROLES.ADMIN) {
        router.push("/admin");
      } else if (role === ROLES.TEACHER) {
        router.push("/teacher");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, role, allowedRoles, router]);

  return { role, isAuthenticated };
}