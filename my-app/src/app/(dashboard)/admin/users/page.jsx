// ============================================
// AMS — ESI Sidi Bel Abbès
// admin/users/page.jsx — Users Management Page
// ============================================

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { getAllUsers, createUser, disableUser } from "@/services/userService";
import { ROLES, STATUSES } from "@/lib/constants";
import DataTable from "@/components/shared/DataTable";
import StatusBadge from "@/components/shared/StatusBadge";

export default function UsersPage() {
  const searchParams = useSearchParams();

  // ── State ─────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: ROLES.TEACHER
  });
  const [submitting, setSubmitting] = useState(false);

  const activeView = searchParams.get("view") || "all";

  const headerCopy = {
    all: {
      title: "Users Management",
      description: "Manage system users and their roles",
    },
    teachers: {
      title: "Teachers Management",
      description: "Manage teacher accounts",
    },
    students: {
      title: "Students Management",
      description: "Manage student accounts",
    },
  };

  const currentHeader = headerCopy[activeView] || headerCopy.all;

  const filteredUsers = users.filter((user) => {
    const normalizedRole = String(user.role || "").toLowerCase();

    if (activeView === "teachers") {
      return normalizedRole === ROLES.TEACHER;
    }

    if (activeView === "students") {
      return normalizedRole === "student";
    }

    return true;
  });

  // ── Fetch Users ───────────────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError("");
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── Handle Create User ───────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createUser(formData);
      setShowModal(false);
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: ROLES.TEACHER,
      });
      fetchUsers(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Handle Disable User ──────────────────────
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      if (currentStatus === STATUSES.ACTIVE) {
        await disableUser(userId);
      }
      fetchUsers();
    } catch (err) {
      setError("Failed to update user status");
    }
  };

  // ── Render ───────────────────────────────────
  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>{currentHeader.title}</h1>
            <p>{currentHeader.description}</p>
          </div>
          <button className="add-user-btn" onClick={() => setShowModal(true)}>
            + Add User
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="dashboard-section">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading users...
          </div>
        ) : (
          <DataTable
            columns={[
              { Header: "Name", accessor: "name" },
              { Header: "Email", accessor: "email" },
              { Header: "Role", accessor: "role" },
              { Header: "Status", accessor: "status" },
              { Header: "Actions", accessor: "actions" },
            ]}
            data={
              filteredUsers.length === 0
                ? []
                : filteredUsers.map((user) => ({
                    id: user.id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    role:
                      user.role === ROLES.ADMIN
                        ? "Admin"
                        : user.role === ROLES.TEACHER
                          ? "Teacher"
                          : user.role === "student"
                            ? "Student"
                            : user.role,
                    status: (
                      <StatusBadge
                        status={user.is_active ? "active" : "disabled"}
                      />
                    ),
                    actions: (
                      <button
                        className="action-btn disable-btn"
                        onClick={() =>
                          handleToggleStatus(
                            user.id,
                            user.is_active
                              ? STATUSES.ACTIVE
                              : STATUSES.DISABLED,
                          )
                        }
                        disabled={user.is_active === false}
                      >
                        Disable
                      </button>
                    ),
                  }))
            }
          />
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                  placeholder="Enter last name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="user@esi-sba.dz"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="Enter password"
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value={ROLES.TEACHER}>Teacher</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                  <option value={ROLES.STUDENT}>Student</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inline Styles */}
      <style jsx>{`
        .add-user-btn {
          background: linear-gradient(180deg, #0ea5e9, #0284c7);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease;
        }
        .add-user-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(2, 132, 199, 0.35);
        }
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        .users-table th,
        .users-table td {
          padding: 14px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }
        .users-table th {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          background: #f8fafc;
        }
        .users-table td {
          font-size: 14px;
          color: #334155;
        }
        .users-table tr:hover td {
          background: #f8fafc;
        }
        .role-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .role-admin {
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          color: #2563eb;
        }
        .role-teacher {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          color: #16a34a;
        }
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-active {
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          color: #16a34a;
        }
        .status-disabled {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #d97706;
        }
        .action-btn {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 160ms ease;
        }
        .disable-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }
        .disable-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
        }
        .disable-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }
        .modal-content h2 {
          margin: 0 0 20px;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }
        .modal-content .form-group {
          margin-bottom: 16px;
        }
        .modal-content select {
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.18);
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          outline: none;
        }
        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .cancel-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.14);
          background: white;
          color: #64748b;
          font-weight: 700;
          cursor: pointer;
        }
        .submit-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(180deg, #0ea5e9, #0284c7);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
