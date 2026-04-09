"use client";

import { useState, useEffect } from "react";
import { getAllTeachers } from "@/services/accountsService";
import AdminTeachersTable from "@/components/dashboard/AdminTeachersTable";
function TeachersPage() {
  // ── State ─────────────────────────────────────
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setShowModal] = useState(false);

  // ── Fetch Teachers ───────────────────────────────
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await getAllTeachers();
      setTeachers(data);
      setError("");
    } catch (err) {
      setError("Failed to load teachers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="main-page">
      {/* ── Header row ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Teachers</h2>
          <p className="main-subtitle">View and manage teachers</p>
        </div>

        <div className="flex gap-4">
          <button className="main-add-btn" onClick={() => setShowModal(true)}>
            Add New Teacher
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
            >
              <path
                d="M5.16667 0.5V9.83333M0.5 5.16667H9.83333"
                stroke="#143888"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="main-export-btn">
            Import CSV
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M11.652 6.007C11.657 6.007 11.662 6.007 11.667 6.007C13.324 6.007 14.667 7.353 14.667 9.013C14.667 10.56 13.5 11.834 12 12M11.652 6.007C11.662 5.897 11.667 5.786 11.667 5.673C11.667 3.645 10.025 2 8 2C6.082 2 4.508 3.475 4.347 5.355M11.652 6.007C11.584 6.765 11.286 7.456 10.829 8.011M4.347 5.355C2.656 5.516 1.333 6.943 1.333 8.679C1.333 10.295 2.479 11.642 4 11.952M4.347 5.355C4.452 5.345 4.559 5.339 4.667 5.339C5.417 5.339 6.11 5.588 6.667 6.007"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 8.667L8 14M8 8.667C7.533 8.667 6.661 9.996 6.333 10.333M8 8.667C8.467 8.667 9.339 9.996 9.667 10.333"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Teachers Table */}
      {loading ? (
        <div className="border border-[#e3e8ef] rounded-xl px-4 py-6 text-[14px] text-[#4a5567] bg-white">
          Loading teachers...
        </div>
      ) : (
        <AdminTeachersTable teachers={teachers} />
      )}
    </div>
  );
}

export default TeachersPage;
