// ============================================
// AMS — ESI Sidi Bel Abbès
// middleware.js — Server-side Route Protection
// Place this in the ROOT of your project (same level as app/)
// ============================================

import { NextResponse } from "next/server";

// ── Protected Routes ──────────────────────────
const ADMIN_ROUTES = ["/admin"];
const TEACHER_ROUTES = ["/teacher"];
const AUTH_ROUTES = ["/login", "/forget-password"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read the access token cookie set by the backend
  const token = request.cookies.get("access_token")?.value;

  // ── If logged in → block access to auth pages ──
  // Prevent logged-in users from seeing /login again
  if (token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // ── If NOT logged in → block protected routes ──
  const isProtected =
    ADMIN_ROUTES.some((route) => pathname.startsWith(route)) ||
    TEACHER_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ── Apply middleware to these routes only ──────
export const config = {
  matcher: ["/admin", "/teacher", "/login", "/forget-password"],
};
