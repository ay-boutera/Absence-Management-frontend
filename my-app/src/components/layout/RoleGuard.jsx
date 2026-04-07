// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/RoleGuard.jsx
// Client-side role check — wraps protected content
// ============================================

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/constants";

export function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, isAuthenticated, isAuthLoading } = useAuthStore();

  const normalizedRole = typeof role === "string" ? role.toLowerCase() : null;

  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const isTeacherPath =
    pathname === "/teacher" || pathname.startsWith("/teacher/");
  const hasPathRoleMismatch =
    (isAdminPath && normalizedRole !== ROLES.ADMIN) ||
    (isTeacherPath && normalizedRole !== ROLES.TEACHER);

  useEffect(() => {
    if (isAuthLoading) return;
    console.log(
      "[RoleGuard] isAuthenticated:",
      isAuthenticated,
      "role:",
      normalizedRole,
      "allowedRoles:",
      allowedRoles,
      "pathname:",
      pathname,
    );

    // Not logged in → redirect to login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Logged in but trying to access another role's route
    if (hasPathRoleMismatch) {
      router.replace("/unauthorized");
      return;
    }

    // Logged in but wrong role → redirect to their own dashboard
    if (!allowedRoles.includes(normalizedRole)) {
      if (normalizedRole === ROLES.ADMIN) {
        router.replace("/admin");
      } else if (normalizedRole === ROLES.TEACHER) {
        router.replace("/teacher");
      } else {
        router.replace("/login");
      }
    }
  }, [
    isAuthenticated,
    normalizedRole,
    allowedRoles,
    router,
    isAuthLoading,
    pathname,
    hasPathRoleMismatch,
  ]);

  // While checking auth → show nothing
  if (
    isAuthLoading ||
    !isAuthenticated ||
    hasPathRoleMismatch ||
    !allowedRoles.includes(normalizedRole)
  ) {
    return null;
  }

  return children;
}
