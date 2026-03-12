// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/forgetPasswordForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { forgetPassword } from "@/services/authService";

export function ForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgetPassword(email);
      // Backend always returns 200 — never reveals if email exists
      setSuccess(true);
    } catch (err) {
      // Only real network/server errors reach here
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ─────────────────────────
  if (success) {
    return (
      <div>
        <h2>Email Sent ✅</h2>
        <p>
          If an account exists with this email, you will receive a password
          reset link valid for <strong>30 minutes</strong>.
        </p>
        <p>Please also check your spam folder.</p>
        <a href="/login">Back to Login</a>
      </div>
    );
  }

  // ── Form State ────────────────────────────
  return (
    <div>
      <h2>Forgot Password</h2>
      <p>Enter your institutional email to receive a password reset link.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="you@esi-sba.dz"
        />
        {error && <div>{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <a href="/login">Back to Login</a>
    </div>
  );
}
