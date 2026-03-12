// ============================================
// AMS — ESI Sidi Bel Abbès
// Admin Dashboard Page
// ============================================

"use client";

import { useAuthStore } from "@/store/authStore";

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Tableau de Bord Administrateur</h1>
        <p>Bienvenue, {user?.first_name || "Admin"}!</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">156</span>
            <span className="stat-label">Utilisateurs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teachers-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">42</span>
            <span className="stat-label">Enseignants</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon absences-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">28</span>
            <span className="stat-label">Absences ce mois</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">5</span>
            <span className="stat-label">Demandes en attente</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Activité Récente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">Il y a 2 heures</span>
            <span className="activity-text">
              Nouvel utilisateur enregistré: Mohammed Ali
            </span>
          </div>
          <div className="activity-item">
            <span className="activity-time">Il y a 5 heures</span>
            <span className="activity-text">
              Absence justifiée par: Sara Ahmed
            </span>
          </div>
          <div className="activity-item">
            <span className="activity-time">Hier</span>
            <span className="activity-text">
              Mise à jour du planning: Groupe CS-2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
