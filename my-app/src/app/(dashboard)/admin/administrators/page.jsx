"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllAdmins, getAllTeachers, createAdmin } from "@/services/accountsService";

const ROLE_OPTIONS = [
  { value: "chef_department",  label: "Chef department"  },
  { value: "regular",          label: "Admin"            },
  { value: "super",            label: "Super Admin"      },
];

function AdminAvatar({ name, avatarUrl, size = 36 }) {
  const initials = (name || "?")
    .split(" ").map(n => n[0] || "").join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #c3d4f5 0%, #94b4ee 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, overflow: "hidden",
    }}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} style={{ width: size, height: size, objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: size * 0.38, fontWeight: 700, color: "#143888" }}>{initials}</span>
      )}
    </div>
  );
}

// ── Admin card ────────────────────────────────────────────────────────────────
function AdminCard({ admin, onViewProfile }) {
  const fullName = admin.name || `${admin.first_name || ""} ${admin.last_name || ""}`.trim();
  const role = admin.department || admin.specialization || "Admin";
  const since = admin.created_at ? new Date(admin.created_at).getFullYear() : "—";

  return (
    <div style={{
      boxSizing: "border-box",
      display: "flex", flexDirection: "column",
      padding: 16, gap: 19,
      background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)",
      borderRadius: 8, flex: 1, minWidth: 0,
    }}>
      {/* Top: avatar + name */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
        <AdminAvatar name={fullName} avatarUrl={admin.avatar_url} size={36} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 16, fontWeight: 500, color: "#000",
            letterSpacing: "0.02em", whiteSpace: "nowrap",
            overflow: "hidden", textOverflow: "ellipsis",
          }}>{fullName}</span>
          <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(0,0,0,0.5)", letterSpacing: "0.02em" }}>
            {role}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />

      {/* Contact info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", letterSpacing: "0.02em" }}>
          {admin.email || "—"}
        </span>
        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", letterSpacing: "0.02em" }}>
          {admin.phone || "—"}
        </span>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />

      {/* Footer: since + view profile */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", letterSpacing: "0.02em" }}>
          Teacher since {since}
        </span>
        <button
          onClick={() => onViewProfile(admin.id)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: "#030712", letterSpacing: "0.02em",
            padding: 0,
          }}
        >
          View profile
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M4 12L12 4M12 4H7M12 4V9" stroke="#030712" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Add admin modal ───────────────────────────────────────────────────────────
function AddAdminModal({ teachers, onClose, onSave }) {
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function handleSave() {
    if (!selectedTeacherId || !selectedRole) {
      setErr("Please select both a teacher and a role.");
      return;
    }
    const teacher = teachers.find(t => String(t.id) === String(selectedTeacherId));
    if (!teacher) { setErr("Teacher not found."); return; }

    setSaving(true);
    setErr("");
    try {
      await onSave({
        teacher_id: teacher.id,
        email: teacher.email,
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        phone: teacher.phone || "",
        department: selectedRole,
        admin_level: selectedRole === "super" ? "super" : "regular",
        password: Math.random().toString(36).slice(-10) + "Aa1!",
      });
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.detail || "Failed to create admin. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        boxSizing: "border-box",
        display: "flex", flexDirection: "column", alignItems: "flex-end",
        padding: 24, gap: 37,
        width: 472,
        background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0px 0px 7px rgba(0,0,0,0.07)", borderRadius: 14,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%" }}>
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#143888", margin: 0 }}>Add new admin</h2>
            <p style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", margin: 0 }}>
              choose from the teachers list a new admin and select their role
            </p>
          </div>

          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            {/* Teacher select */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.8)", letterSpacing: "0.4px" }}>
                Teacher
              </label>
              <div style={{
                display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                padding: "6px 12px", background: "#FBFCFC",
                border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8,
                position: "relative",
              }}>
                <select
                  value={selectedTeacherId}
                  onChange={e => setSelectedTeacherId(e.target.value)}
                  style={{
                    width: "100%", border: "none", background: "transparent",
                    fontSize: 14, color: selectedTeacherId ? "#000" : "#898989",
                    appearance: "none", cursor: "pointer", outline: "none",
                    height: 24,
                  }}
                >
                  <option value="" disabled>Select a teacher</option>
                  {teachers.map(t => {
                    const name = `${t.first_name || ""} ${t.last_name || ""}`.trim() || t.email;
                    return <option key={t.id} value={t.id}>{name}</option>;
                  })}
                </select>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, pointerEvents: "none" }}>
                  <path d="M4 6l4 4 4-4" stroke="#898989" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Role select */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.8)", letterSpacing: "0.4px" }}>
                Role
              </label>
              <div style={{
                display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                padding: "6px 12px", background: "#FBFCFC",
                border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8,
                position: "relative",
              }}>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  style={{
                    width: "100%", border: "none", background: "transparent",
                    fontSize: 14, color: selectedRole ? "#000" : "#898989",
                    appearance: "none", cursor: "pointer", outline: "none",
                    height: 24,
                  }}
                >
                  <option value="" disabled>Select a role</option>
                  {ROLE_OPTIONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, pointerEvents: "none" }}>
                  <path d="M4 6l4 4 4-4" stroke="#898989" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Error */}
          {err && (
            <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>{err}</p>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              disabled={saving}
              style={{
                padding: "5px 32px", border: "1.3px solid rgba(0,0,0,0.16)",
                borderRadius: 8, background: "none", cursor: "pointer",
                fontSize: 16, fontWeight: 500, color: "#898989",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "5px 32px", border: "none",
                borderRadius: 8, background: "#143888", cursor: "pointer",
                fontSize: 16, fontWeight: 500, color: "#FFFFFF",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdministratorsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  async function fetchAdmins() {
    try {
      setLoading(true);
      const data = await getAllAdmins();
      setAdmins(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Failed to load administrators.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdmins();
    getAllTeachers()
      .then(data => setTeachers(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function handleSaveAdmin(adminData) {
    await createAdmin(adminData);
    await fetchAdmins();
  }

  function handleViewProfile(id) {
    router.push(`/admin/teachers/${id}?from=administrators`);
  }

  // Split admins into rows of 3
  const rows = [];
  for (let i = 0; i < admins.length; i += 3) {
    rows.push(admins.slice(i, i + 3));
  }

  return (
    <div className="main-page">
      {/* ── Header ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#143888", margin: 0 }}>Administrators</h2>
          <p className="main-subtitle">View and manage administrators</p>
        </div>

        <button
          className="main-export-btn"
          onClick={() => setShowModal(true)}
        >
          Add new admin
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3.33337V12.6667M3.33337 8.00004H12.6667"
              stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Error ── */}
      {error && <div className="error-message">{error}</div>}

      {/* ── Loading ── */}
      {loading ? (
        <div style={{ padding: 24, color: "#4a5567", fontSize: 14 }}>Loading administrators…</div>
      ) : admins.length === 0 ? (
        <div style={{
          padding: 48, textAlign: "center", color: "#8C97A7",
          fontSize: 14, background: "#fff",
          border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8,
        }}>
          No administrators found. Click &quot;Add new admin&quot; to add one.
        </div>
      ) : (
        /* ── Admin cards grid ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              {row.map(admin => (
                <AdminCard key={admin.id} admin={admin} onViewProfile={handleViewProfile} />
              ))}
              {/* Fill empty slots to maintain 3-column layout */}
              {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
                <div key={`empty-${i}`} style={{ flex: 1 }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Add admin modal ── */}
      {showModal && (
        <AddAdminModal
          teachers={teachers}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAdmin}
        />
      )}
    </div>
  );
}
