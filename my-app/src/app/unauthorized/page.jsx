"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/services/authService";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  const handleBackToLogin = async () => {
    try {
      await logout();
    } catch {
      // ignore logout API errors and force local cleanup
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <main className="unauthorized-page">
      <div className="unauthorized-card">
        <p className="unauthorized-eyebrow">Access denied</p>
        <h1 className="unauthorized-title">Unauthorized</h1>
        <p className="unauthorized-subtitle">
          You don&apos;t have permission to view this page.
        </p>

        <div className="unauthorized-actions">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="unauthorized-btn unauthorized-btn-secondary"
          >
            Back to Login
          </button>
          <Link href="/" className="unauthorized-btn unauthorized-btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
