// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/forgetPasswordForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { forgetPassword } from "@/services/authService";
import Image from "next/image";

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
    <div className="login-form  px-16">
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
        
      <h2 className="text-[#143888] font-semibold text-5xl mb-4">
        Reset Password
      </h2>
      <p className="text-[#00000035] text-2xl">
        Please enter your email. We will send you a code to reset your password.
      </p>
      </div>
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="Your Email"
        />
        {error && <div>{error}</div>}
        <button
          className="w-full mt-6 h-16 bg-[#143888] hover:bg-[#072256] text-white font-semibold text-xl rounded-xl transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <div className="auth-helper mt-20">
        <p>For any assistance, please contact the administration via email : <span className="auth-helper-mail">administration@esi-sba.dz</span>.</p>
      </div>
    </div>
  );
}
