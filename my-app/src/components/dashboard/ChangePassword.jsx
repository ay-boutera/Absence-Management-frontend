"use client";

import { useMemo, useState } from "react";
import { changePassword } from "@/services/authService";

function EyeOpenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  disabled,
}) {
  return (
    <div className="change-password__field">
      <label htmlFor={id} className="change-password__label">
        {label}
      </label>

      <div className="change-password__input-wrapper">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
          className="change-password__input"
          placeholder="••••••••••••"
          autoComplete={
            id === "current-password" ? "current-password" : "new-password"
          }
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="change-password__toggle-btn"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    </div>
  );
}

function parseErrorMessage(err) {
  const detail = err?.response?.data?.detail;

  const normalizeText = (value) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

  const oauthOnlyMessage =
    "This account uses Google sign-in only. Password change is not available for this account.";

  if (Array.isArray(detail) && detail.length > 0) {
    const firstMsg = detail[0]?.msg;
    const normalizedFirstMsg = normalizeText(firstMsg);

    if (
      normalizedFirstMsg.includes("oauth") ||
      normalizedFirstMsg.includes("google") ||
      (normalizedFirstMsg.includes("password") &&
        normalizedFirstMsg.includes("not set"))
    ) {
      return oauthOnlyMessage;
    }

    return firstMsg || "Something went wrong. Please try again.";
  }

  if (typeof detail === "string" && detail.trim()) {
    const normalizedDetail = normalizeText(detail);

    if (
      normalizedDetail.includes("oauth") ||
      normalizedDetail.includes("google") ||
      (normalizedDetail.includes("password") &&
        normalizedDetail.includes("not set"))
    ) {
      return oauthOnlyMessage;
    }

    return detail;
  }

  const status = err?.response?.status;
  if (status === 400) return "Please check the entered passwords.";
  if (status === 401 || status === 403)
    return "You are not authorized. Please login again.";

  return "Unable to change password right now. Please try again.";
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      currentPassword.trim().length > 0 &&
      newPassword.trim().length > 0 &&
      confirmPassword.trim().length > 0 &&
      !loading
    );
  }, [currentPassword, newPassword, confirmPassword, loading]);

  const clearMessages = () => {
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from old password.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="change-password">
      <div className="change-password__header">
        <h3 className="change-password__title">Change your password</h3>
      </div>

      <div className="change-password__body">
        <PasswordField
          id="current-password"
          label="Old password"
          value={currentPassword}
          onChange={(value) => {
            clearMessages();
            setCurrentPassword(value);
          }}
          visible={showCurrent}
          onToggle={() => setShowCurrent((prev) => !prev)}
          disabled={loading}
        />

        <PasswordField
          id="new-password"
          label="New password"
          value={newPassword}
          onChange={(value) => {
            clearMessages();
            setNewPassword(value);
          }}
          visible={showNew}
          onToggle={() => setShowNew((prev) => !prev)}
          disabled={loading}
        />

        <PasswordField
          id="confirm-password"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(value) => {
            clearMessages();
            setConfirmPassword(value);
          }}
          visible={showConfirm}
          onToggle={() => setShowConfirm((prev) => !prev)}
          disabled={loading}
        />

        {error && <div className="change-password__error-box">{error}</div>}

        {success && (
          <div className="change-password__success-box">{success}</div>
        )}

        <div className="change-password__actions">
          <button
            type="submit"
            disabled={!canSubmit}
            className="change-password__submit-btn"
          >
            {loading ? "Updating..." : "Save password"}
          </button>
        </div>
      </div>
    </form>
  );
}
