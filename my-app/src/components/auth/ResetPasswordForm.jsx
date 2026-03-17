// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/ResetPasswordForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordConfirm } from "@/services/authService";
import Image from "next/image";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  if (!token) {
    return (
      <div className="reset-password-form">
        <h2>Invalid Link</h2>
        <p>This password reset link is invalid or has expired.</p>
        <a href="/forgot-password">Request a new link</a>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordConfirm(token, password, confirm);
      router.push("/login?reset=success");
    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Something went wrong. Please try again.");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("This link has expired or is invalid. Please request a new one.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form px-20">
       <a href="/login">
              <Image 
                className="pb-32"
                src="/arrow-narrow-left.svg"
                alt="Back"
                width={32}
                height={40}
              />
      </a>
      <div>

            <h2 className="text-[#143888] font-semibold text-4xl mb-4">
              Reset Password
            </h2>
            <p className="text-[#00000035] text-xl">
              Please enter your email. We will send you a code to reset your password.
            </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Min. 8 characters"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm">Confirm Password</label>
          <input
            type="password"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading}
            placeholder="Repeat your password"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <a href="/login">Back to Login</a>
    </div>
  );
}