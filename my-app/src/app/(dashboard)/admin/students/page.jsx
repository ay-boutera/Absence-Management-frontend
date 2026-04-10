"use client";

import { useState, useEffect, useMemo } from "react";

import { ROLES, STATUSES } from "@/lib/constants";
import { getAllStudents } from "@/services/studentService";

const T = {
  blue2: "#143888",
  text: "#030712",
  muted: "#4A5567",
  border: "#E3E8EF",
  bg: "#F8FAFF",
  safe: { bg: "#E7F6EF", text: "#069855" },
  warning: { bg: "#FFEDED", text: "#D62525" },
  exclu: { bg: "#ECECEC", text: "#000000" },
};

const MOCK_STUDENTS = [
  {
    id: "1",
    matricule: "202334652314",
    nom: "Rim",
    prenom: "Bouhafs",
    filiere: "CP",
    niveau: "1CP",
    groupe: "G3",
    email: "r.bouhafs@esi-sba.dz",
    absences: 1,
    totalAbsences: 12,
  },
  {
    id: "2",
    matricule: "202334652315",
    nom: "Ilyes",
    prenom: "Brahmi",
    filiere: "CP",
    niveau: "1CP",
    groupe: "G2",
    email: "i.brahmi@esi-sba.dz",
    absences: 3,
    totalAbsences: 12,
  },
  {
    id: "3",
    matricule: "202334652316",
    nom: "Ahmed Yassine",
    prenom: "Bouteraa",
    filiere: "CS",
    niveau: "3CS",
    groupe: "G1",
    email: "a.bouteraa@esi-sba.dz",
    absences: 7,
    totalAbsences: 12,
  },
  {
    id: "4",
    matricule: "202334652317",
    nom: "Ayla",
    prenom: "Meziani",
    filiere: "CS",
    niveau: "1CS",
    groupe: "G6",
    email: "a.meziani@esi-sba.dz",
    absences: 8,
    totalAbsences: 12,
  },
  {
    id: "5",
    matricule: "202334652318",
    nom: "Abd El Djalil",
    prenom: "Bouhafs",
    filiere: "CS",
    niveau: "2CS",
    groupe: "G8",
    email: "a.bouhafs@esi-sba.dz",
    absences: 0,
    totalAbsences: 12,
  },
  {
    id: "6",
    matricule: "202334652319",
    nom: "Foued",
    prenom: "Trari",
    filiere: "CP",
    niveau: "2CP",
    groupe: "G10",
    email: "f.trari@esi-sba.dz",
    absences: 2,
    totalAbsences: 12,
  },
  {
    id: "7",
    matricule: "202334652320",
    nom: "Sara",
    prenom: "Benali",
    filiere: "CS",
    niveau: "2CS",
    groupe: "G4",
    email: "s.benali@esi-sba.dz",
    absences: 5,
    totalAbsences: 12,
  },
];
function getStatus(absences, total) {
  const ratio = absences / total;
  if (ratio >= 0.6) return "Exclu";
  if (ratio >= 0.5) return "warning";
  return "Safe";
}
const AVATAR_COLORS = [
  ["#DBEAFE", "#1E40AF"],
  ["#FCE7F3", "#9D174D"],
  ["#D1FAE5", "#065F46"],
  ["#FEF3C7", "#92400E"],
  ["#EDE9FE", "#5B21B6"],
  ["#FFE4E6", "#9F1239"],
  ["#CFFAFE", "#155E75"],
];
function getAvatarColors(id) {
  const idx = parseInt(id, 10) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] || AVATAR_COLORS[0];
}
function StatusBadge({ status }) {
  const s =
    status === "Safe" ? T.safe : status === "warning" ? T.warning : T.exclu;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8px",
        height: 24,
        borderRadius: 4,
        background: s.bg,
        color: s.text,
        fontSize: 12,
        letterSpacing: -0.02 * 12,
      }}
    >
      {status}
    </span>
  );
}
function Avatar({ student }) {
  const [bg, fg] = getAvatarColors(student.id);
  const initials = `${student.first_name[0]}${student.last_name[0]}`.toUpperCase();
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        flexShrink: 0,
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 0.5,
      }}
    >
      {initials}
    </div>
  );
}
function StudentRow({ student }) {
  const status = getStatus(student.absences, student.totalAbsences);
  const fullName = `${student.prenom} ${student.nom}`;

  return (
    <tr
      style={{
        borderBottom: `1px solid ${T.border}`,
        transition: "background 0.12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F8FF")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Name cell */}
      <td style={{ padding: "0 16px", width: 260, height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar student={student} />
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: T.text,
                letterSpacing: -0.02 * 12,
              }}
            >
              {fullName}
            </div>
            <div
              style={{
                fontSize: 11,
                color: T.muted,
                letterSpacing: 0.06 * 11,
                marginTop: 1,
              }}
            >
              {student.email}
            </div>
          </div>
        </div>
      </td>

      {/* matricule → Student ID */}
      <td
        style={{
          padding: "0 24px 0 16px",
          fontSize: 12,
          color: T.text,
          letterSpacing: -0.02 * 12,
        }}
      >
        {student.matricule}
      </td>

      {/* niveau → Year */}
      <td
        style={{
          padding: "0 24px 0 16px",
          fontSize: 12,
          color: T.text,
          letterSpacing: -0.02 * 12,
        }}
      >
        {student.niveau}
      </td>

      {/* groupe → Group */}
      <td
        style={{
          padding: "0 24px 0 16px",
          fontSize: 12,
          color: T.text,
          letterSpacing: -0.02 * 12,
        }}
      >
        {student.groupe}
      </td>

      {/* absences */}
      <td
        style={{
          padding: "0 24px 0 16px",
          fontSize: 12,
          color: T.text,
          letterSpacing: -0.02 * 12,
        }}
      >
        {student.absences}/{student.totalAbsences}
      </td>

      {/* status */}
      <td style={{ padding: "0 24px 0 16px" }}>
        <StatusBadge status={status} />
      </td>

      {/* action */}
      <td style={{ padding: "0 16px", width: 68 }}>
        <button
          style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            border: `1px solid ${T.border}`,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {/* <DotsIcon /> */}
        </button>
      </td>
    </tr>
  );
}

function Pagination({ page, totalPages, onPage }) {
  const pages = [1, 2, 3, 4, 5, "...", 10];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderTop: `1px solid ${T.border}`,
      }}
    >
      {/* Showing */}
      <div style={{ display: "flex", gap: 6, fontSize: 14, color: T.muted }}>
        <span>Showing</span>
        <span style={{ color: T.text }}>1 to 7 of 120</span>
        <span>students</span>
      </div>

      {/* Pages */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={i}
              style={{ padding: "0 4px", fontSize: 12, color: T.muted }}
            >
              ...
            </span>
          ) : (
            <button
              key={i}
              onClick={() => onPage(p)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                border: p === page ? `1px solid ${T.blue2}` : "none",
                background: "transparent",
                fontSize: 12,
                cursor: "pointer",
                color: T.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "inherit",
              }}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Back / Next */}
      <div style={{ display: "flex", gap: 8 }}>
        {[
          // { label: "Back", icon: <IconsChevronLeft />, side: "left" },
          // { label: "Next", icon: <IconsChevronRight />, side: "right" },
        ].map((btn) => (
          <button
            key={btn.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 12px",
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
              color: T.text,
              fontFamily: "inherit",
              boxShadow: "0 1px 1px rgba(0,0,0,0.04)",
            }}
          >
            {btn.side === "left" && btn.icon}
            {btn.label}
            {btn.side === "right" && btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //   t3 csv
  const [csvFile, setCsvFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleUploadCSV = async () => {
    if (!csvFile) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await fetch("http://localhost:8000/api/v1/import/students", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
       console.log("these are the result" , res)

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Upload failed");
      }

      alert("CSV uploaded successfully");
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  //   t3 csv

  const filtered = useMemo(() => {
    if (!search) return students;
    console.log("these are the students" , students)

    const q = search.toLowerCase();

    return students.filter(
      (s) =>
        `${s.prenom} ${s.nom}`.toLowerCase().includes(q) ||
        s.matricule.includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [search, students]);

  const thStyle = {
    padding: "0 16px",
    height: 36,
    fontSize: 12,
    fontWeight: 400,
    color: T.muted,
    textAlign: "left",
    whiteSpace: "nowrap",
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
      setError("");
    } catch (err) {
      setError("Failed to load students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="main-page">
      {/* ── Header row ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Students</h2>
          <p className="main-subtitle">View and manage students</p>
        </div>

        <div className="flex gap-4">
          <button className="main-add-btn" onClick={() => setShowModal(true)}>
            Add New Student
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

      {/* Students Table */}
      {loading ? (
        <div className="border border-[#e3e8ef] rounded-xl px-4 py-6 text-[14px] text-[#4a5567] bg-white">
          Loading students...
        </div>
      ) : (<div>
        {/* <AdminStudentsTable students={students} /> */}
        </div>
     ) }
    </div>
  );
}



const FilterIcon = () => {
  return (
    <div>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.16663 2.68333C1.16663 2.35664 1.16663 2.19329 1.23021 2.06851C1.28613 1.95874 1.37537 1.86951 1.48513 1.81358C1.60991 1.75 1.77326 1.75 2.09996 1.75H11.9C12.2267 1.75 12.39 1.75 12.5148 1.81358C12.6245 1.86951 12.7138 1.95874 12.7697 2.06851C12.8333 2.19329 12.8333 2.35664 12.8333 2.68333V3.07381C12.8333 3.23061 12.8333 3.30901 12.8141 3.38191C12.7972 3.44651 12.7692 3.50772 12.7315 3.56286C12.689 3.62508 12.6297 3.67643 12.5112 3.77912L8.78036 7.01254C8.66187 7.11524 8.60262 7.16658 8.56008 7.22881C8.52238 7.28395 8.49443 7.34515 8.47745 7.40975C8.45829 7.48266 8.45829 7.56106 8.45829 7.71785V10.7674C8.45829 10.8815 8.45829 10.9385 8.43989 10.9878C8.42364 11.0314 8.3972 11.0704 8.36277 11.1017C8.32382 11.1371 8.27086 11.1583 8.16494 11.2007L6.18161 11.994C5.96721 12.0798 5.86001 12.1226 5.77395 12.1048C5.6987 12.0891 5.63266 12.0444 5.59019 11.9804C5.54163 11.9071 5.54163 11.7916 5.54163 11.5607V7.71785C5.54163 7.56106 5.54163 7.48266 5.52247 7.40975C5.50549 7.34515 5.47754 7.28395 5.43984 7.22881C5.3973 7.16658 5.33805 7.11524 5.21956 7.01254L1.48869 3.77912C1.3702 3.67643 1.31095 3.62508 1.26841 3.56286C1.23071 3.50772 1.20277 3.44651 1.18579 3.38191C1.16663 3.30901 1.16663 3.23061 1.16663 3.07381V2.68333Z"
          stroke="#030712"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

const SortIcon = () => {
  return (
    <div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 9H13.5"
          stroke="#030712"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1.6875 5.625H16.3125"
          stroke="#030712"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.3125 12.375H10.6875"
          stroke="#030712"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

const SearchIcon = () => {
  return (
    <div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.3999 14.4L11.7899 11.79M13.2 8.39998C13.2 11.0509 11.0509 13.2 8.39998 13.2C5.74901 13.2 3.59998 11.0509 3.59998 8.39998C3.59998 5.74901 5.74901 3.59998 8.39998 3.59998C11.0509 3.59998 13.2 5.74901 13.2 8.39998Z"
          stroke="#030712"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

const StudentsIcon = () => {
  return (
    <div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.9775 2.66671C12.2708 2.66671 13.3108 3.71337 13.3108 5.00004C13.3108 6.26004 12.3108 7.28671 11.0642 7.33337C11.0108 7.32671 10.9508 7.32671 10.8908 7.33337M12.2642 13.3334C12.7442 13.2334 13.1975 13.04 13.5708 12.7534C14.6108 11.9734 14.6108 10.6867 13.5708 9.90671C13.2042 9.62671 12.7575 9.44004 12.2842 9.33337M6.14416 7.24671C6.0775 7.24004 5.9975 7.24004 5.92416 7.24671C4.3375 7.19337 3.0775 5.89337 3.0775 4.29337C3.0775 2.66004 4.3975 1.33337 6.0375 1.33337C7.67083 1.33337 8.9975 2.66004 8.9975 4.29337C8.99083 5.89337 7.73083 7.19337 6.14416 7.24671ZM2.81083 9.70671C1.1975 10.7867 1.1975 12.5467 2.81083 13.62C4.64416 14.8467 7.65083 14.8467 9.48416 13.62C11.0975 12.54 11.0975 10.78 9.48416 9.70671C7.6575 8.48671 4.65083 8.48671 2.81083 9.70671Z"
          stroke="black"
          stroke-width="1.3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

const PlusIcon = () => {
  return (
    <div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.00004 3.33337V12.6667M3.33337 8.00004H12.6667"
          stroke="#143888"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

const ImportIcon = () => {
  return (
    <div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.6518 6.00737C11.6567 6.00735 11.6617 6.00734 11.6667 6.00734C13.3236 6.00734 14.6667 7.35295 14.6667 9.01284C14.6667 10.5599 13.5 11.8339 12 12M11.6518 6.00737C11.6617 5.89737 11.6667 5.78597 11.6667 5.67339C11.6667 3.64463 10.0251 2 8.00004 2C6.0822 2 4.50826 3.47511 4.34699 5.35461M11.6518 6.00737C11.5836 6.76506 11.2858 7.4564 10.8286 8.01101M4.34699 5.35461C2.65603 5.51582 1.33337 6.94261 1.33337 8.6789C1.33337 10.2945 2.47855 11.6421 4.00004 11.9515M4.34699 5.35461C4.45221 5.34458 4.55886 5.33945 4.66671 5.33945C5.41726 5.33945 6.10987 5.58796 6.66703 6.00734"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.00004 14L8.00004 8.66667M8.00004 14C7.53322 14 6.66106 12.6705 6.33337 12.3333M8.00004 14C8.46686 14 9.33902 12.6705 9.66671 12.3333"
          stroke="white"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
const IconsChevronLeft = () => {
  return (
    <div>
      <svg
        width="5"
        height="9"
        viewBox="0 0 5 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.09998 7.59998L0.599976 4.09998L4.09998 0.599976"
          stroke="#4A5567"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

const IconsChevronRight = () => {
  return (
    <div>
      <svg
        width="5"
        height="9"
        viewBox="0 0 5 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.599976 7.59998L4.09998 4.09998L0.599976 0.599976"
          stroke="#4A5567"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

const DotsIcon = () => {
  return (
    <div>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 6C5 5.44772 5.44772 5 6 5C6.55228 5 7 5.44772 7 6C7 6.55228 6.55228 7 6 7C5.44772 7 5 6.55228 5 6Z"
          fill="#4A5567"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 2.5C5 1.94772 5.44772 1.5 6 1.5C6.55228 1.5 7 1.94772 7 2.5C7 3.05228 6.55228 3.5 6 3.5C5.44772 3.5 5 3.05228 5 2.5Z"
          fill="#4A5567"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5 9.5C5 8.94772 5.44772 8.5 6 8.5C6.55228 8.5 7 8.94772 7 9.5C7 10.0523 6.55228 10.5 6 10.5C5.44772 10.5 5 10.0523 5 9.5Z"
          fill="#4A5567"
        />
      </svg>
    </div>
  );
};
