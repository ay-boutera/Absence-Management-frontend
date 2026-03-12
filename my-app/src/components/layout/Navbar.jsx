// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/Navbar.jsx
// ============================================

"use client";

import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/constants";

export function Navbar() {
  const { user, role } = useAuthStore();

  return (
    <header className="navbar">
      {/* Page Title — left side */}
      <div className="navbar-title">
        Absence Management System
      </div>

      {/* User Info — right side */}
      <div className="navbar-user">
        {/* Full Name */}
        <span className="navbar-name">
          {user?.full_name ?? ""}
        </span>

        {/* Role Badge */}
        <span className={`navbar-role-badge ${role === ROLES.ADMIN ? "badge-admin" : "badge-teacher"}`}>
          {role === ROLES.ADMIN ? "Admin" : "Teacher"}
        </span>
      </div>
    </header>
  );
}