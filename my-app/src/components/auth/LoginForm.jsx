// ============================================
// AMS — ESI Sidi Bel Abbès
// components/auth/LoginForm.jsx
// ============================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { ROLE_ROUTES } from "@/lib/constants";
import { GoogleOAuthButton } from "@/components/auth/GoogleOAuthButton";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // ── Local State ──────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Submit ───────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuth(data); // fill the store
      console.log(data);
      router.push(ROLE_ROUTES[data.role]); // redirect by role
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else if (status === 403) {
        setError("Votre compte est désactivé. Contactez l'administrateur.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────
  return (
    <div className="login-form px-16">
      {/* title header */}
      <div>
        <h2 className="text-[#143888] font-semibold text-4xl mb-4">
          Log in to your account
        </h2>
        <p className="text-[#00000035] text-xl">
          enter your credentials to access your account now{" "}
        </p>
      </div>
      {/* form */}
      <div>
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              className="mb-6"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Your email"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="•••••••••••••"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center mt-4">
            <label className="flex gap-4 items-center" htmlFor="remember-me">
              <input
                className="w-4 h-4"
                type="checkbox"
                id="remember-me"
                name="remember-me"
                disabled={loading}
              />
              <span className="text-[#888] text-xl">Remember me</span>
            </label>
            <a className="text-[#143888] text-xl" href="/forget-password">
              Forgot password ?
            </a>
          </div>

          {/* Error */}
          {error && <div className="text-red-600 mt-2">{error}</div>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 h-16 bg-[#143888] hover:bg-[#072256] text-white font-semibold text-xl rounded-xl transition"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>

      <div className="flex items-center text-[#00000035]">
        <hr className="flex-1 border-gray-300" />
        <span className="mx-2 text-xl ">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

        <GoogleOAuthButton />
    
      <div className="auth-helper mt-20">
        <p>For any assistance, please contact the administration via email : <span className="auth-helper-mail">administration@esi-sba.dz</span>.</p>
      </div>

    </div>
  );
}
