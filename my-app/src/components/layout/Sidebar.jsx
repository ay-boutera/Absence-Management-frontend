// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/Sidebar.jsx
// ============================================

"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/services/authService";
import { ROLES } from "@/lib/constants";
import Image from "next/image";

// ── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="2"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="11"
        y="2"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2"
        y="11"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="11"
        y="11"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  students: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="7.5" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 16c0-3.314 2.462-5 5.5-5s5.5 1.686 5.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17 16c0-2.21-1.343-3.8-3-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  teachers: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5h14M3 10h14M3 15h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  lessons: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 4h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 8h6M7 11h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  groups: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle
        cx="10"
        cy="5.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1.5 16c0-2.21 1.119-3.5 2.5-3.5.62 0 1.19.23 1.66.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18.5 16c0-2.21-1.119-3.5-2.5-3.5-.62 0-1.19.23-1.66.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 16c0-2.76 1.79-4.5 4-4.5s4 1.74 4 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 8c1.657 0 3 1.343 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 17c0-1.657-.895-3-2-3.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  audit: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="4"
        y="2"
        width="12"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 7h6M7 10h6M7 13h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  import: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3v10m0 0-3-3m3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  export: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 13V3m0 0-3 3m3-3 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  attendance: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="3"
        y="4"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 2v4M13 2v4M3 9h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 13l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  justifications: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 7h6M7 10.5h6M7 14h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  examAbsences: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 9l4 4m0-4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  rattrapages: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3.5 10a6.5 6.5 0 1 1 1.9 4.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.5 14.5V10H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  statistics: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 15l4-5 4 3 5-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 17h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  notifications: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5A5.5 5.5 0 0 0 4.5 8v3.5L3 13h14l-1.5-1.5V8A5.5 5.5 0 0 0 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 13v.5a2 2 0 0 0 4 0V13"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2.5v1.25M10 16.25v1.25M17.5 10h-1.25M3.75 10H2.5M15.3 4.7l-.884.884M5.584 14.416l-.884.884M15.3 15.3l-.884-.884M5.584 5.584l-.884-.884"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  help: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.5-1.5 2-2.5 2.5V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14" r="0.75" fill="currentColor" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 10H8m9 0-2.5-2.5M17 10l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevron: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ── Nav data ─────────────────────────────────────────────────────────────────
const ADMIN_SECTIONS = [
  {
    title: "Main",
    links: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Students",   href: "/admin/students/",  icon: "students" },
      { label: "Teachers",   href: "/admin//teachers",  icon: "teachers" },
      { label: "Groups", href: "/admin/groups", icon: "groups" },
    ],
  },
  {
    title: "Attendance",
    links: [
      { label: "Attendance", href: "/admin/absences", icon: "attendance" },
      {label: "Justifications",href: "/admin/justifications",icon: "justifications",},
      {label: "Exam Absences",href: "/admin/absences/exam",icon: "examAbsences",},
      { label: "Rattrapages", href: "/admin/rattrapages", icon: "rattrapages" },
    ],
  },
  {
    title: "System",
    links: [
      {label: "Notifications",href: "/admin/notifications",icon: "notifications",},
      { label: "Settings", href: "/admin/settings", icon: "settings" },
      { label: "Audit Log", href: "/admin/audit", icon: "audit" },
      { label: "Import", href: "/admin/import", icon: "import" },
      { label: "Export", href: "/admin/export", icon: "export" },
    ],
  },
];

const ADMIN_BOTTOM_LINKS = [
  { label: "Help", href: "/admin/help", icon: "help" },
];

const TEACHER_SECTIONS = [
  {
    title: "Main",
    links: [
      { label: "Dashboard", href: "/teacher", icon: "dashboard" },
      { label: "My Lessons", href: "/teacher/sessions", icon: "lessons" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role, clearAuth } = useAuthStore();

  const sections = role === ROLES.ADMIN ? ADMIN_SECTIONS : TEACHER_SECTIONS;
  const bottomLinks = role === ROLES.ADMIN ? ADMIN_BOTTOM_LINKS : [];

  const isActive = (href) => {
    const [targetPath, targetQuery] = href.split("?");

    if (!targetQuery) {
      return targetPath === "/admin" || targetPath === "/teacher"
        ? pathname === targetPath
        : pathname.startsWith(targetPath);
    }

    if (pathname !== targetPath) return false;

    const targetParams = new URLSearchParams(targetQuery);
    for (const [key, value] of targetParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }

    return true;
  };

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
      {/* Logo */}
      <div className="sidebar-logo flex items-center justify-center">
        <Image
          width={220}
          height={80}
          src="/sideBarLogo.svg"
          alt="Sidebar Logo"
        />
      </div>

      {/* Nav sections */}
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <p className="sidebar-section-title">{section.title}</p>
            {section.links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={`${section.title}-${link.href}-${link.label}`}
                  href={link.href}
                  className={`sidebar-link${active ? " active" : ""}`}
                >
                  <span className="sidebar-link-icon">{icons[link.icon]}</span>
                  <span className="sidebar-link-label">{link.label}</span>
                  <span className="sidebar-link-chevron">{icons.chevron}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom links (Help, etc.) */}
      {bottomLinks.length > 0 && (
        <div className="sidebar-bottom-links">
          {bottomLinks.map((link) => (
            <Link
              key={`bottom-${link.href}-${link.label}`}
              href={link.href}
              className={`sidebar-link${isActive(link.href) ? " active" : ""}`}
            >
              <span className="sidebar-link-icon">{icons[link.icon]}</span>
              <span className="sidebar-link-label">{link.label}</span>
              <span className="sidebar-link-chevron">{icons.chevron}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout} className="sidebar-logout">
        <span className="sidebar-link-icon">{icons.logout}</span>
        <span className="sidebar-link-label">Logout</span>
      </button>
    </aside>
  );
}
