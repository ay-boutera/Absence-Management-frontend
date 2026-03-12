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
    <div className="login-form">
      <h2>Connexion</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="vous@esi-sba.dz"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="••••••••"
          />
        </div>

        {/* Error Message — US-09 */}
        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <a href="/forget-password">Mot de passe oublié ?</a>
    </div>
  );
}
