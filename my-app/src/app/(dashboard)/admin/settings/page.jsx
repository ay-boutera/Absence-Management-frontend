"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { updateAdmin } from "@/services/accountsService";
import { changePassword } from "@/services/authService";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/lib/constants";

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 72 }) {
  const initials = (name || "?")
    .split(" ").map(n => n[0] || "").join("").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #c3d4f5 0%, #94b4ee 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: size * 0.36, fontWeight: 700, color: "#143888" }}>{initials}</span>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: "none",
        background: checked ? "#143888" : "#E0E0E0",
        cursor: "pointer", position: "relative",
        transition: "background 0.2s", flexShrink: 0,
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: checked ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
        display: "block",
      }} />
    </button>
  );
}

// ── Password field ────────────────────────────────────────────────────────────
function PwdField({ label, value, onChange, show, onToggle, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>{label}</label>
      <div style={{
        display: "flex", alignItems: "center",
        border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8,
        background: "#FBFCFC", padding: "8px 12px",
      }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          placeholder="••••••••••"
          style={{
            flex: 1, border: "none", background: "transparent",
            fontSize: 14, outline: "none", color: "#000",
          }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{ border: "none", background: "none", cursor: "pointer", padding: 0, color: "#888", display: "flex" }}
        >
          {show ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────
function InputField({ label, value, onChange, disabled, readOnly }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>{label}</label>
      <input
        value={value || ""}
        onChange={onChange ? e => onChange(e.target.value) : undefined}
        disabled={disabled}
        readOnly={readOnly}
        style={{
          border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8,
          background: (disabled || readOnly) ? "#F5F6F7" : "#FBFCFC",
          padding: "8px 12px", fontSize: 14,
          color: (disabled || readOnly) ? "rgba(0,0,0,0.5)" : "#000",
          outline: "none", width: "100%", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatItem({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", letterSpacing: "0.02em" }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#143888" }}>{value ?? "—"}</span>
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
      <div>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: "#143888", margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", margin: "3px 0 0" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(0,0,0,0.06)",
      borderRadius: 10, padding: 24,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Edit button ───────────────────────────────────────────────────────────────
function EditBtn({ editing, onEdit, onCancel, onSave, saving }) {
  if (!editing) {
    return (
      <button onClick={onEdit} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 16px", border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 8, background: "#fff", cursor: "pointer",
        fontSize: 13, fontWeight: 500, color: "#143888",
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2Z" stroke="#143888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Edit
      </button>
    );
  }
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={onCancel} disabled={saving} style={{
        padding: "6px 16px", border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 8, background: "#fff", cursor: "pointer",
        fontSize: 13, fontWeight: 500, color: "#666",
      }}>Cancel</button>
      <button onClick={onSave} disabled={saving} style={{
        padding: "6px 16px", border: "none",
        borderRadius: 8, background: "#143888", cursor: "pointer",
        fontSize: 13, fontWeight: 500, color: "#fff",
        opacity: saving ? 0.7 : 1,
      }}>{saving ? "Saving…" : "Save"}</button>
    </div>
  );
}

// ── Select field ──────────────────────────────────────────────────────────────
function SelectField({ label, value, onChange, options, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>{label}</label>
      <div style={{
        position: "relative",
        border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8,
        background: disabled ? "#F5F6F7" : "#FBFCFC",
      }}>
        <select
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: "100%", border: "none", background: "transparent",
            padding: "8px 32px 8px 12px", fontSize: 14,
            color: disabled ? "rgba(0,0,0,0.5)" : "#000",
            appearance: "none", cursor: disabled ? "default" : "pointer",
            outline: "none",
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none",
        }}>
          <path d="M4 6l4 4 4-4" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ── Notification row ──────────────────────────────────────────────────────────
function NotifRow({ label, inApp, email, onToggle }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <span style={{ fontSize: 14, color: "#111", flex: 1 }}>{label}</span>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <Toggle checked={inApp} onChange={v => onToggle("inApp", v)} />
        <Toggle checked={email} onChange={v => onToggle("email", v)} />
      </div>
    </div>
  );
}

// ── PROFILE TAB ───────────────────────────────────────────────────────────────
function ProfileTab({ profile }) {
  const { user, setUser } = useAuthStore();
  const fullName = profile
    ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    : `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

  // Profile edit state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileErr, setProfileErr] = useState("");
  const [form, setForm] = useState({
    first_name: profile?.first_name || user?.first_name || "",
    last_name: profile?.last_name || user?.last_name || "",
    phone: profile?.phone || user?.phone || "",
  });
  const [origForm, setOrigForm] = useState(form);

  // Notification state
  const [notifs, setNotifs] = useState({
    justification: { inApp: true, email: false },
    absenceAlerts: { inApp: true, email: true },
    scheduleChanges: { inApp: false, email: false },
    rattrapage: { inApp: true, email: false },
  });

  // Password state
  const [pwdForm, setPwdForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, newPwd: false, confirm: false });
  const [pwdErr, setPwdErr] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  function handleEdit() {
    const f = {
      first_name: profile?.first_name || user?.first_name || "",
      last_name: profile?.last_name || user?.last_name || "",
      phone: profile?.phone || user?.phone || "",
    };
    setForm(f);
    setOrigForm(f);
    setEditing(true);
    setProfileErr("");
  }

  function handleCancel() {
    setForm(origForm);
    setEditing(false);
    setProfileErr("");
  }

  async function handleSave() {
    setSaving(true);
    setProfileErr("");
    try {
      const id = profile?.id || user?.id;
      await updateAdmin(id, {
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
      });
      setUser({ ...user, ...form });
      setOrigForm(form);
      setEditing(false);
    } catch (e) {
      setProfileErr(e?.response?.data?.detail || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleNotif(key, channel, val) {
    setNotifs(prev => ({ ...prev, [key]: { ...prev[key], [channel]: val } }));
  }

  async function handlePwdSubmit(e) {
    e.preventDefault();
    setPwdErr("");
    setPwdSuccess("");
    if (pwdForm.newPwd.length < 8) { setPwdErr("New password must be at least 8 characters."); return; }
    if (pwdForm.newPwd !== pwdForm.confirm) { setPwdErr("Passwords do not match."); return; }
    if (pwdForm.current === pwdForm.newPwd) { setPwdErr("New password must differ from old."); return; }
    setPwdLoading(true);
    try {
      await changePassword(pwdForm.current, pwdForm.newPwd, pwdForm.confirm);
      setPwdSuccess("Password changed successfully.");
      setPwdForm({ current: "", newPwd: "", confirm: "" });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setPwdErr(typeof detail === "string" ? detail : "Failed to change password.");
    } finally {
      setPwdLoading(false);
    }
  }

  const displayName = editing
    ? `${form.first_name} ${form.last_name}`.trim() || "—"
    : fullName || "—";

  const role = profile?.role || user?.role || "—";
  const matricule = profile?.employee_id || profile?.student_id || "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── Profile Information ── */}
      <div>
        <SectionHeader
          title="Profile information"
          subtitle="Update your personal details"
          action={
            <EditBtn
              editing={editing}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              saving={saving}
            />
          }
        />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {/* Left: avatar + editable fields */}
          <Card style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar name={displayName} size={64} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>{displayName}</div>
                <div style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", textTransform: "capitalize" }}>{role}</div>
              </div>
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <InputField
                    label="First name"
                    value={form.first_name}
                    onChange={editing ? v => setForm(f => ({ ...f, first_name: v })) : undefined}
                    disabled={!editing}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InputField
                    label="Last name"
                    value={form.last_name}
                    onChange={editing ? v => setForm(f => ({ ...f, last_name: v })) : undefined}
                    disabled={!editing}
                  />
                </div>
              </div>
              <InputField label="Matricule" value={matricule} readOnly />
              <InputField
                label="Role"
                value={role.charAt(0).toUpperCase() + role.slice(1)}
                readOnly
              />
            </div>

            {profileErr && (
              <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>{profileErr}</p>
            )}
          </Card>

          {/* Right: stats + contact */}
          <Card style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Stats</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <StatItem label="Total Subjects" value={profile?.total_subjects ?? "—"} />
                <StatItem label="Total Groups" value={profile?.total_groups ?? "—"} />
                <StatItem label="Total Hours" value={profile?.total_hours ?? "—"} />
              </div>
            </div>

            <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Contact</p>
              <InputField
                label="Phone"
                value={form.phone}
                onChange={editing ? v => setForm(f => ({ ...f, phone: v })) : undefined}
                disabled={!editing}
              />
              <InputField label="Email" value={profile?.email || user?.email || ""} readOnly />
            </div>
          </Card>
        </div>
      </div>

      {/* ── Account & Notifications ── */}
      <div>
        <SectionHeader
          title="Account & Notifications settings"
          subtitle="Manage your notification preferences and password"
        />
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {/* Notifications card */}
          <Card style={{ flex: "1 1 320px" }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111" }}>Notifications</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Choose what events trigger alerts</p>
            </div>

            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 30, paddingBottom: 8, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.5)", width: 40, textAlign: "center" }}>In-App</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.5)", width: 40, textAlign: "center" }}>Email</span>
            </div>

            <NotifRow
              label="Justification updates"
              inApp={notifs.justification.inApp}
              email={notifs.justification.email}
              onToggle={(ch, v) => handleNotif("justification", ch, v)}
            />
            <NotifRow
              label="Absence alerts"
              inApp={notifs.absenceAlerts.inApp}
              email={notifs.absenceAlerts.email}
              onToggle={(ch, v) => handleNotif("absenceAlerts", ch, v)}
            />
            <NotifRow
              label="Schedule changes"
              inApp={notifs.scheduleChanges.inApp}
              email={notifs.scheduleChanges.email}
              onToggle={(ch, v) => handleNotif("scheduleChanges", ch, v)}
            />
            <NotifRow
              label="Rattrapage notifications"
              inApp={notifs.rattrapage.inApp}
              email={notifs.rattrapage.email}
              onToggle={(ch, v) => handleNotif("rattrapage", ch, v)}
            />
          </Card>

          {/* Change password card */}
          <Card style={{ flex: "1 1 260px" }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111" }}>Change password</p>
              <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Update your account password</p>
            </div>

            <form onSubmit={handlePwdSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <PwdField
                label="Old password"
                value={pwdForm.current}
                onChange={v => { setPwdErr(""); setPwdSuccess(""); setPwdForm(f => ({ ...f, current: v })); }}
                show={showPwd.current}
                onToggle={() => setShowPwd(s => ({ ...s, current: !s.current }))}
                disabled={pwdLoading}
              />
              <PwdField
                label="New password"
                value={pwdForm.newPwd}
                onChange={v => { setPwdErr(""); setPwdSuccess(""); setPwdForm(f => ({ ...f, newPwd: v })); }}
                show={showPwd.newPwd}
                onToggle={() => setShowPwd(s => ({ ...s, newPwd: !s.newPwd }))}
                disabled={pwdLoading}
              />
              <PwdField
                label="Confirm new password"
                value={pwdForm.confirm}
                onChange={v => { setPwdErr(""); setPwdSuccess(""); setPwdForm(f => ({ ...f, confirm: v })); }}
                show={showPwd.confirm}
                onToggle={() => setShowPwd(s => ({ ...s, confirm: !s.confirm }))}
                disabled={pwdLoading}
              />

              {pwdErr && <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>{pwdErr}</p>}
              {pwdSuccess && <p style={{ margin: 0, fontSize: 13, color: "#16a34a" }}>{pwdSuccess}</p>}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => { setPwdForm({ current: "", newPwd: "", confirm: "" }); setPwdErr(""); setPwdSuccess(""); }}
                  disabled={pwdLoading}
                  style={{
                    padding: "7px 20px", border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 8, background: "#fff", cursor: "pointer",
                    fontSize: 13, fontWeight: 500, color: "#666",
                  }}
                >Cancel</button>
                <button
                  type="submit"
                  disabled={pwdLoading || !pwdForm.current || !pwdForm.newPwd || !pwdForm.confirm}
                  style={{
                    padding: "7px 20px", border: "none",
                    borderRadius: 8, background: "#143888", cursor: "pointer",
                    fontSize: 13, fontWeight: 500, color: "#fff",
                    opacity: (pwdLoading || !pwdForm.current || !pwdForm.newPwd || !pwdForm.confirm) ? 0.6 : 1,
                  }}
                >
                  {pwdLoading ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── ADMINISTRATION TAB ────────────────────────────────────────────────────────
const ACADEMIC_YEAR_OPTIONS = [
  { value: "2024-2025", label: "2024 – 2025" },
  { value: "2025-2026", label: "2025 – 2026" },
  { value: "2026-2027", label: "2026 – 2027" },
];

const SEMESTER_OPTIONS = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
];

const ABSENCE_LIMIT_OPTIONS = [5, 6, 7, 8, 10, 12, 15].map(n => ({ value: String(n), label: `${n} absences` }));
const WARNING_OPTIONS = [3, 4, 5, 6, 7, 8].map(n => ({ value: String(n), label: `${n} absences` }));
const DEADLINE_OPTIONS = [1, 2, 3, 5, 7, 10, 14].map(n => ({ value: String(n), label: `${n} day${n > 1 ? "s" : ""}` }));

function AdministrationTab() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [acad, setAcad] = useState({
    year: "2025-2026",
    semester: "1",
    s1Start: "2025-09-15",
    s1End: "2026-01-31",
    s2Start: "2026-02-16",
    s2End: "2026-06-30",
  });
  const [origAcad, setOrigAcad] = useState(acad);

  const [rules, setRules] = useState({
    maxAbsences: "10",
    warningThreshold: "6",
    justificationDeadline: "3",
  });
  const [origRules, setOrigRules] = useState(rules);

  function handleEdit() {
    setOrigAcad(acad);
    setOrigRules(rules);
    setEditing(true);
  }
  function handleCancel() {
    setAcad(origAcad);
    setRules(origRules);
    setEditing(false);
  }
  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setOrigAcad(acad);
    setOrigRules(rules);
    setEditing(false);
    setSaving(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <SectionHeader
        title="Administration settings"
        subtitle="Configure academic year and absence rules"
        action={
          <EditBtn
            editing={editing}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            saving={saving}
          />
        }
      />

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* Academic year card */}
        <Card style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111" }}>Academic year</p>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Set the current academic period</p>
          </div>

          <SelectField
            label="Academic year"
            value={acad.year}
            onChange={v => setAcad(a => ({ ...a, year: v }))}
            options={ACADEMIC_YEAR_OPTIONS}
            disabled={!editing}
          />
          <SelectField
            label="Current semester"
            value={acad.semester}
            onChange={v => setAcad(a => ({ ...a, semester: v }))}
            options={SEMESTER_OPTIONS}
            disabled={!editing}
          />

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.6)" }}>Semester 1</p>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <InputField label="Start date" value={acad.s1Start} onChange={editing ? v => setAcad(a => ({ ...a, s1Start: v })) : undefined} disabled={!editing} />
              </div>
              <div style={{ flex: 1 }}>
                <InputField label="End date" value={acad.s1End} onChange={editing ? v => setAcad(a => ({ ...a, s1End: v })) : undefined} disabled={!editing} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.6)" }}>Semester 2</p>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <InputField label="Start date" value={acad.s2Start} onChange={editing ? v => setAcad(a => ({ ...a, s2Start: v })) : undefined} disabled={!editing} />
              </div>
              <div style={{ flex: 1 }}>
                <InputField label="End date" value={acad.s2End} onChange={editing ? v => setAcad(a => ({ ...a, s2End: v })) : undefined} disabled={!editing} />
              </div>
            </div>
          </div>
        </Card>

        {/* Absence rules card */}
        <Card style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111" }}>Absence rules</p>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Define thresholds and deadlines</p>
          </div>

          <SelectField
            label="Maximum absences allowed"
            value={rules.maxAbsences}
            onChange={v => setRules(r => ({ ...r, maxAbsences: v }))}
            options={ABSENCE_LIMIT_OPTIONS}
            disabled={!editing}
          />
          <SelectField
            label="Warning threshold"
            value={rules.warningThreshold}
            onChange={v => setRules(r => ({ ...r, warningThreshold: v }))}
            options={WARNING_OPTIONS}
            disabled={!editing}
          />
          <SelectField
            label="Justification deadline"
            value={rules.justificationDeadline}
            onChange={v => setRules(r => ({ ...r, justificationDeadline: v }))}
            options={DEADLINE_OPTIONS}
            disabled={!editing}
          />

          <div style={{
            marginTop: 8, padding: 14, background: "#F0F5FF",
            borderRadius: 8, display: "flex", flexDirection: "column", gap: 6,
          }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#143888" }}>Current rules summary</p>
            <p style={{ margin: 0, fontSize: 12, color: "#4a6bc0" }}>
              Students are warned at <strong>{rules.warningThreshold}</strong> absences and excluded at <strong>{rules.maxAbsences}</strong>.
              Justifications must be submitted within <strong>{rules.justificationDeadline} day{Number(rules.justificationDeadline) > 1 ? "s" : ""}</strong>.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, role } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);

  const isAdmin = role === "admin";

  useEffect(() => {
    api.get(API_ENDPOINTS.USER_ME)
      .then(r => setProfile(r.data))
      .catch(() => {});
  }, []);

  const tabs = [
    { id: "profile", label: "Profile" },
    ...(isAdmin ? [{ id: "administration", label: "Administration" }] : []),
  ];

  return (
    <div className="main-page">
      {/* Header */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#143888", margin: 0 }}>Settings</h2>
          <p className="main-subtitle">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1.5px solid rgba(0,0,0,0.08)",
        marginBottom: 28,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 22px",
              border: "none", background: "none", cursor: "pointer",
              fontSize: 14, fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? "#143888" : "rgba(0,0,0,0.5)",
              borderBottom: activeTab === tab.id ? "2px solid #143888" : "2px solid transparent",
              marginBottom: -1.5,
              transition: "color 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "profile" && <ProfileTab profile={profile} />}
      {activeTab === "administration" && isAdmin && <AdministrationTab />}
    </div>
  );
}
