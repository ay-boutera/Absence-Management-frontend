import { NextResponse } from "next/server";

// ── Route definitions ──
const ADMIN_PREFIX = "/admin";
const TEACHER_PREFIX = "/teacher";
const AUTH_ROUTES = ["/login", "/forget-password"];

const DASHBOARD_BY_ROLE = {
  admin: "/admin",
  teacher: "/teacher",
};

function normalizeRole(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : null;
}

function extractRole(payload) {
  if (!payload || typeof payload !== "object") return null;

  const candidates = [
    payload.role,
    payload.user?.role,
    payload.data?.role,
    payload.user_role,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeRole(candidate);
    if (normalized === "admin" || normalized === "teacher") {
      return normalized;
    }
  }

  return null;
}

// ── JWT parser ──
function parseJwt(token) {
  try {
    const base64UrlPayload = token.split(".")[1];
    if (!base64UrlPayload) return null;

    const base64Payload = base64UrlPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(base64UrlPayload.length / 4) * 4, "=");

    const decoded = atob(base64Payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isRouteOrSubRoute(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function isAuthRoute(pathname) {
  return AUTH_ROUTES.includes(pathname);
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const rawToken = request.cookies.get("access_token")?.value;
  const token = rawToken?.startsWith("Bearer ") ? rawToken.slice(7) : rawToken;

  const payload = token ? parseJwt(token) : null;
  const role = extractRole(payload);

  const isAdminRoute = isRouteOrSubRoute(pathname, ADMIN_PREFIX);
  const isTeacherRoute = isRouteOrSubRoute(pathname, TEACHER_PREFIX);
  const isProtectedRoute = isAdminRoute || isTeacherRoute;
  const authRoute = isAuthRoute(pathname);

  // Non-authenticated users cannot access protected routes.
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated users should not access login/forget-password screens.
  if (token && authRoute) {
    const dashboard = DASHBOARD_BY_ROLE[role];
    if (dashboard) {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }

    // If token exists but role is invalid/missing, treat as unauthenticated.
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token exists but role is invalid/missing on protected routes.
  if (token && isProtectedRoute && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based protection.
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isTeacherRoute && role !== "teacher") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

// ── Apply middleware to nested routes ──
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/teacher",
    "/teacher/:path*",
    "/login",
    "/forget-password",
  ],
};
