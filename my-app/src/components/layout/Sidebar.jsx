// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/Sidebar.jsx
// ============================================

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/services/authService";
import { ROLES } from "@/lib/constants";

const ADMIN_LINKS = [
  { label: "Dashboard",       href: "/admin" },
  { label: "Users",           href: "/admin/users" },
  { label: "Audit Log",       href: "/admin/audit" },
  { label: "Import",          href: "/admin/import" },
  { label: "Export",          href: "/admin/export" },
  { label: "Absences",        href: "/admin/absences" },
  { label: "Justifications",  href: "/admin/justifications" },
  { label: "Rattrapages",     href: "/admin/rattrapages" },
  { label: "Statistics",      href: "/admin/statistics" },
];

const TEACHER_LINKS = [
  { label: "Dashboard",       href: "/teacher" },
];

export function Sidebar() {
  const pathname            = usePathname();
  const router              = useRouter();
  const { role, clearAuth } = useAuthStore();

  const links = role === ROLES.ADMIN ? ADMIN_LINKS : TEACHER_LINKS;

  const isActive = (href) =>
    href === "/admin" || href === "/teacher"
      ? pathname === href
      : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>AMS</span>
        <span>ESI-SBA</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${isActive(link.href) ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="sidebar-logout">
        Logout
      </button>
    </aside>
  );
}