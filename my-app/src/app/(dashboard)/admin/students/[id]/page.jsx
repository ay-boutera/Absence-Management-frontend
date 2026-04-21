"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getStudentById, patchStudent } from "@/services/accountsService";
import Link from "next/link";
import Image from "next/image";
const STATUS_OPTIONS = [
  { value: "normal", label: "Normal", color: "#FFB44F" },
  { value: "warning", label: "Warning", color: "#D64545" },
  { value: "excluded", label: "Excluded", color: "#111827" },
];

function deriveStatus(raw) {
  if (!raw?.is_active) return "excluded";
  return raw?.status || "normal";
}

const LEGEND_ITEMS = [
  { key: "ACSI", color: "#62B2FD" },
  { key: "LOW", color: "#9BDFC4" },
  { key: "SEC", color: "#F99BAB" },
  { key: "GP", color: "#FFB44F" },
  { key: "Network", color: "#9F97F7" },
  { key: "Architecture", color: "#143888" },
  { key: "Sys", color: "#D64545" },
  { key: "Eng", color: "#000000" },
];

function AttendanceDonut({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const pct =
    total > 0
      ? Math.round((data.reduce((s, d) => s + d.attended, 0) / total) * 100)
      : 0;

  return (
    <div
      style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={38}
            outerRadius={56}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v, n, p) => [
              `${p.payload.attended}/${p.payload.total}`,
              p.payload.subject,
            ]}
            contentStyle={{ fontSize: 11, borderRadius: 6 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        <p
          style={{ fontSize: 14, fontWeight: 700, color: "#222529", margin: 0 }}
        >
          {pct}%
        </p>
        <p
          style={{ fontSize: 11, fontWeight: 500, color: "#8C97A7", margin: 0 }}
        >
          attendance
        </p>
      </div>
    </div>
  );
}

// ── Student info card ─────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: 500,
        color: "rgba(0,0,0,0.4)",
        margin: 0,
      }}
    >
      {label ? `${label} : ` : ""}
      {value || "—"}
    </p>
  );
}

// ── Status dropdown ───────────────────────────────────────────────────────────
function StatusCard({ status, onSave }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const cfg =
    STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSelect(option) {
    setOpen(false);
    setSaving(true);
    await onSave(option.value);
    setSaving(false);
  }

  return (
    <div
      ref={ref}
      className="box-border flex flex-col items-start p-3 gap-[6px] flex-1 bg-white border border-black/10 rounded-[10px] relative min-w-0"
    >
      <div className="flex items-center gap-1.5 w-full">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8337 6.99996C12.8337 10.2216 10.222 12.8333 7.00033 12.8333C3.77866 12.8333 1.16699 10.2216 1.16699 6.99996C1.16699 3.7783 3.77866 1.16663 7.00033 1.16663C10.222 1.16663 12.8337 3.7783 12.8337 6.99996Z"
            stroke="#999999"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="4 4"
          />
        </svg>

        <span style={{ fontSize: 14, color: "#999999", flex: 1 }}>Status</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="bg-transparent border-0 p-0 cursor-pointer flex"
          title="Edit status"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.45854 2.90639L10.2762 2.0887C10.7278 1.6371 11.46 1.6371 11.9116 2.0887C12.3632 2.5403 12.3632 3.27249 11.9116 3.72409L11.0939 4.54178M9.45854 2.90639L6.40546 5.95948C5.7957 6.56924 5.49081 6.87412 5.28321 7.24565C5.0756 7.61717 4.86673 8.49445 4.66699 9.33333C5.50588 9.1336 6.38315 8.92472 6.75468 8.71712C7.1262 8.50951 7.43108 8.20463 8.04084 7.59487L11.0939 4.54178M9.45854 2.90639L11.0939 4.54178"
              stroke="#999999"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.25 7C12.25 9.47487 12.25 10.7123 11.4812 11.4812C10.7123 12.25 9.47487 12.25 7 12.25C4.52513 12.25 3.28769 12.25 2.51884 11.4812C1.75 10.7123 1.75 9.47487 1.75 7C1.75 4.52513 1.75 3.28769 2.51884 2.51884C3.28769 1.75 4.52513 1.75 7 1.75"
              stroke="#999999"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
      <span className="text-[16px] font-medium" style={{ color: cfg.color }}>
        {saving ? "Saving…" : cfg.label}
      </span>

      {open && (
        <div className="absolute top-full right-0 z-50 bg-white border border-black/10 rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] min-w-[140px] mt-1 overflow-hidden">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className="block w-full text-left px-[14px] py-2 border-0 bg-transparent text-[13px] font-medium cursor-pointer"
              style={{ color: opt.color }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f8faff")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Grades section ────────────────────────────────────────────────────────────
const GRADE_ROWS = [
  { semester: "1CP", avg: "15.33", min: "15.18", max: "15.55" },
  { semester: "2CP", avg: "14.30", min: "12.26", max: "16.67" },
  { semester: "1CS", avg: null, min: null, max: null },
];

function GradesSection({ grades }) {
  const rows = grades && grades.length > 0 ? grades : GRADE_ROWS;
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      background: "#FFFFFF",
      border: "1px solid rgba(0,0,0,0.1)",
      borderRadius: 8,
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #E3E8EF",
        borderRadius: "8px 8px 0 0",
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#000", lineHeight: "17px" }}>
          Student&apos;s Grades
        </span>
      </div>

      {/* Body */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        padding: "11px 16px",
        gap: 15,
        borderRadius: 8,
      }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Separator before every row except the first */}
            {i > 0 && (
              <div style={{ border: "1px solid rgba(0,0,0,0.1)", marginBottom: 7 }} />
            )}

            {/* Label + average */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.7)", lineHeight: "100%" }}>
                {row.semester} :
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.7)", lineHeight: "100%" }}>
                {row.avg ?? "—"}
              </span>
            </div>

           
            {(row.min || row.max) && (
              <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(0,0,0,0.4)", lineHeight: "100%" }}>
                  {row.min}
                </span>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(0,0,0,0.4)", lineHeight: "100%" }}>
                  -
                </span>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(0,0,0,0.4)", lineHeight: "100%" }}>
                  {row.max}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("normal");

  // Build donut data from placeholder (real data needs absences-by-subject API)
  const chartData = LEGEND_ITEMS.map((item) => ({
    subject: item.key,
    color: item.color,
    value: 1, // equal segments placeholder
    attended: 0,
    total: 0,
  }));

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStudentById(id);
        setStudent(data);
        setStatus(deriveStatus(data));
      } catch {
        setError("Failed to load student profile.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function handleStatusSave(newStatus) {
    try {
      const isActive = newStatus !== "excluded";
      await patchStudent(id, { is_active: isActive, status: newStatus });
      setStatus(newStatus);
    } catch {
      // status reverts automatically since state wasn't changed yet
    }
  }

  if (loading) {
    return (
      <div className="main-page">
        <div style={{ padding: 24, color: "#4a5567", fontSize: 14 }}>
          Loading student profile…
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="main-page">
        <div className="error-message">{error || "Student not found."}</div>
      </div>
    );
  }

  const fullName =
    `${student.first_name || ""} ${student.last_name || ""}`.trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="main-page">
      {/* ── Breadcrumb + title ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <h2
          style={{ fontSize: 20, fontWeight: 600, color: "#4A5567", margin: 0 }}
        >
          <Link
            href="/admin/students"
            style={{ color: "#4A5567", textDecoration: "none" }}
          >
            Students
          </Link>
          {" > "}
          <span style={{ color: "#143888" }}>Student Profile</span>
        </h2>
        <p
          style={{ fontSize: 14, fontWeight: 400, color: "#4A5567", margin: 0 }}
        >
          View and manage students
        </p>
      </div>

      <div
        className="flex flex-row  flex-start"
        style={{
          gap: 25,
        }}
      >
        <div className="w-[267px] shrink-0 flex flex-col gap-0">
          <div className="box-border flex flex-col items-start p-5 gap-[25px] bg-white border border-black/10 rounded-[8px]">
            {/* Avatar + name row */}
            <div className="flex flex-row items-start gap-5 w-full">
              <div className="w-[79px] h-[79px] rounded-full bg-[linear-gradient(135deg,#c3d4f5_0%,#94b4ee_100%)] flex items-center justify-center shrink-0">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={fullName}
                    style={{
                      width: 79,
                      height: 79,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{ fontSize: 28, fontWeight: 700, color: "#143888" }}
                  >
                    {initials}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-col gap-1">
                  <span className="text-[16px] font-bold text-black text-left block">
                    {fullName}
                  </span>
                  <span className="text-[12px] font-medium text-black/40 text-center block">
                    {student.email}
                  </span>
                </div>

                <div className="flex justify-center">
                  <button className="flex items-center gap-1 px-2 py-1 bg-[#F8FAFF] border border-black/10 rounded-[4px] text-[12px] text-[#143888] cursor-pointer">
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full">
              <InfoRow label="Matricule" value={student.student_id} />
              <InfoRow label="Birthday" value={student.birthday || "—"} />
              <InfoRow label="Wilaya" value={student.wilaya || "—"} />
              <InfoRow label="" value={student.email} />
              <InfoRow
                label=""
                value={`${student.level || "—"} - ${student.group || "—"}`}
              />
            </div>
          </div>

          {/* book image */}
          <div className="flex justify-center pt-4">
            <Image
              src="/book.png"
              width={220}
              height={220}
              alt={fullName || "Profile"}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[25px] flex-1">
          <div className="flex flex-row gap-[25px] items-stretch">
            {/* absences */}
            <div className="flex-1 box-border flex flex-col gap-[6px] p-3 bg-white border border-black/10 rounded-[10px]">
              <div className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.51627 12.8338L8.51627 13.3338H8.51627V12.8338ZM5.59961 12.8338L5.59961 12.3338H5.59961V12.8338ZM2.61217 2.54511L2.25845 2.19172L2.25845 2.19172L2.61217 2.54511ZM11.5037 2.54511L11.15 2.8985V2.8985L11.5037 2.54511ZM11.5037 12.3207L11.15 11.9674V11.9674L11.5037 12.3207ZM2.61217 12.3207L2.25845 12.6741H2.25845L2.61217 12.3207ZM3.85189 5.33378C3.57575 5.33378 3.35189 5.55764 3.35189 5.83378C3.35189 6.10992 3.57575 6.33378 3.85189 6.33378L3.85189 5.83378V5.33378ZM6.18522 6.33378C6.46136 6.33378 6.68522 6.10992 6.68522 5.83378C6.68522 5.55764 6.46136 5.33378 6.18522 5.33378V5.83378V6.33378ZM7.93522 5.91711C7.65908 5.91711 7.43522 6.14097 7.43522 6.41712C7.43522 6.69326 7.65908 6.91711 7.93522 6.91711L7.93522 6.41711L7.93522 5.91711ZM8.51855 7.00045L8.07134 7.22405C8.15193 7.38523 8.31302 7.49058 8.49299 7.49979C8.67295 7.50901 8.84396 7.42067 8.94059 7.26856L8.51855 7.00045ZM10.4355 5.72176C10.6958 5.62957 10.8321 5.34382 10.7399 5.08352C10.6477 4.82323 10.3619 4.68694 10.1016 4.77913L10.2686 5.25045L10.4355 5.72176ZM3.85189 8.83378C3.57575 8.83378 3.35189 9.05764 3.35189 9.33378C3.35189 9.60992 3.57575 9.83378 3.85189 9.83378L3.85189 9.33378V8.83378ZM6.18522 9.83378C6.46136 9.83378 6.68522 9.60992 6.68522 9.33378C6.68522 9.05764 6.46136 8.83378 6.18522 8.83378V9.33378V9.83378ZM7.93522 9.41712C7.65908 9.41712 7.43522 9.64097 7.43522 9.91712C7.43522 10.1933 7.65908 10.4171 7.93522 10.4171L7.93522 9.91712L7.93522 9.41712ZM8.51855 10.5004L8.07134 10.7241C8.15193 10.8852 8.31302 10.9906 8.49299 10.9998C8.67295 11.009 8.84396 10.9207 8.94059 10.7686L8.51855 10.5004ZM10.4355 9.22176C10.6958 9.12957 10.8321 8.84382 10.7399 8.58352C10.6477 8.32323 10.3619 8.18694 10.1016 8.27913L10.2686 8.75045L10.4355 9.22176ZM8.51627 12.8338V12.3338L5.59961 12.3338L5.59961 12.8338L5.59961 13.3338L8.51627 13.3338L8.51627 12.8338ZM12.0163 9.33052H12.5163V5.53533H12.0163H11.5163V9.33052H12.0163ZM2.09961 5.53533H1.59961L1.59961 9.33052H2.09961H2.59961L2.59961 5.53533H2.09961ZM2.09961 5.53533H2.59961C2.59961 4.69548 2.60067 4.11584 2.65923 3.67988C2.71586 3.25824 2.81791 3.04661 2.96589 2.8985L2.61217 2.54511L2.25845 2.19172C1.89387 2.55664 1.73964 3.0144 1.66813 3.54675C1.59855 4.06477 1.59961 4.72372 1.59961 5.53533H2.09961ZM12.0163 5.53533H12.5163C12.5163 4.72372 12.5173 4.06477 12.4478 3.54675C12.3762 3.0144 12.222 2.55664 11.8574 2.19172L11.5037 2.54511L11.15 2.8985C11.298 3.04661 11.4 3.25824 11.4567 3.67988C11.5152 4.11584 11.5163 4.69548 11.5163 5.53533H12.0163ZM8.51627 12.8338V13.3338C9.32708 13.3338 9.98554 13.3348 10.5032 13.2652C11.0353 13.1936 11.4928 13.0391 11.8574 12.6741L11.5037 12.3207L11.15 11.9674C11.0021 12.1154 10.7908 12.2175 10.3698 12.2741C9.93436 12.3327 9.35538 12.3338 8.51627 12.3338V12.8338ZM12.0163 9.33052H11.5163C11.5163 10.1704 11.5152 10.75 11.4567 11.186C11.4 11.6076 11.298 11.8192 11.15 11.9674L11.5037 12.3207L11.8574 12.6741C12.222 12.3092 12.3762 11.8515 12.4478 11.3191C12.5173 10.8011 12.5163 10.1421 12.5163 9.33052H12.0163ZM5.59961 12.8338V12.3338C4.7605 12.3338 4.18152 12.3327 3.74607 12.2741C3.32505 12.2175 3.11381 12.1154 2.96589 11.9674L2.61217 12.3207L2.25845 12.6741C2.6231 13.0391 3.08062 13.1936 3.6127 13.2652C4.13035 13.3348 4.7888 13.3338 5.59961 13.3338L5.59961 12.8338ZM2.09961 9.33052H1.59961C1.59961 10.1421 1.59855 10.8011 1.66813 11.3191C1.73964 11.8514 1.89387 12.3092 2.25845 12.6741L2.61217 12.3207L2.96589 11.9674C2.81791 11.8192 2.71586 11.6076 2.65923 11.186C2.60067 10.75 2.59961 10.1704 2.59961 9.33052H2.09961ZM4.43522 2.04211L4.42023 1.54234C3.52033 1.56934 2.78678 1.66291 2.25845 2.19172L2.61217 2.54511L2.96589 2.8985C3.18638 2.6778 3.53501 2.56935 4.45021 2.54189L4.43522 2.04211ZM9.68066 2.04211L9.66567 2.54189C10.5809 2.56935 10.9295 2.6778 11.15 2.8985L11.5037 2.54511L11.8574 2.19172C11.3291 1.66291 10.5956 1.56934 9.69565 1.54234L9.68066 2.04211ZM5.45378 1.16711V1.66711L8.66211 1.66711V1.16711V0.667114L5.45378 0.667114V1.16711ZM8.66211 3.20878V2.70878L5.45378 2.70878V3.20878V3.70878L8.66211 3.70878V3.20878ZM5.45378 3.20878V2.70878C5.16613 2.70878 4.93294 2.4756 4.93294 2.18795H4.43294L3.93294 2.18795C3.93294 3.02788 4.61384 3.70878 5.45378 3.70878V3.20878ZM9.68294 2.18795H9.18294C9.18294 2.4756 8.94976 2.70878 8.66211 2.70878V3.20878V3.70878C9.50204 3.70878 10.1829 3.02788 10.1829 2.18795H9.68294ZM8.66211 1.16711V1.66711C8.94976 1.66711 9.18294 1.9003 9.18294 2.18795H9.68294H10.1829C10.1829 1.34801 9.50204 0.667114 8.66211 0.667114V1.16711ZM5.45378 1.16711V0.667114C4.61384 0.667114 3.93294 1.34801 3.93294 2.18795L4.43294 2.18795H4.93294C4.93294 1.9003 5.16613 1.66711 5.45378 1.66711V1.16711ZM3.85189 5.83378L3.85189 6.33378L6.18522 6.33378V5.83378V5.33378L3.85189 5.33378V5.83378ZM7.93522 6.41711C7.93522 6.91711 7.93473 6.91711 7.93425 6.91711C7.93409 6.91711 7.9336 6.91711 7.93328 6.91711C7.93263 6.91711 7.93199 6.9171 7.93135 6.9171C7.93008 6.91709 7.92881 6.91707 7.92756 6.91705C7.92506 6.91702 7.92261 6.91696 7.9202 6.91688C7.9154 6.91673 7.91079 6.9165 7.90638 6.91622C7.89755 6.91565 7.88952 6.91484 7.88224 6.91387C7.86764 6.91192 7.8563 6.90937 7.84799 6.90699C7.83064 6.90204 7.82893 6.89856 7.84016 6.90606C7.86167 6.92039 7.95516 6.9917 8.07134 7.22405L8.51855 7.00045L8.96577 6.77684C8.79028 6.42586 8.59211 6.2055 8.39486 6.07401C8.29672 6.00858 8.20386 5.96865 8.12271 5.94547C8.0825 5.93398 8.0461 5.92687 8.0144 5.92264C7.99859 5.92053 7.984 5.91915 7.97076 5.91829C7.96414 5.91787 7.95786 5.91757 7.95193 5.91738C7.94897 5.91729 7.94609 5.91722 7.94331 5.91718C7.94191 5.91716 7.94054 5.91714 7.9392 5.91713C7.93852 5.91712 7.93785 5.91712 7.93719 5.91712C7.93686 5.91712 7.93637 5.91712 7.9362 5.91712C7.93571 5.91711 7.93522 5.91711 7.93522 6.41711ZM8.51855 7.00045C8.94059 7.26856 8.94055 7.26862 8.94052 7.26868C8.94051 7.26869 8.94048 7.26873 8.94047 7.26876C8.94044 7.2688 8.94043 7.26882 8.94043 7.26882C8.94043 7.26881 8.94049 7.26872 8.9406 7.26855C8.94083 7.2682 8.94127 7.2675 8.94193 7.26648C8.94324 7.26443 8.94542 7.26105 8.94842 7.25643C8.95443 7.24718 8.96374 7.23296 8.9761 7.21441C9.00085 7.17726 9.0377 7.12291 9.08467 7.05637C9.17896 6.92279 9.31224 6.74264 9.46867 6.55512C9.62607 6.36644 9.80077 6.17772 9.97736 6.02285C10.1591 5.86344 10.3157 5.76418 10.4355 5.72176L10.2686 5.25045L10.1016 4.77913C9.80963 4.88255 9.54157 5.07496 9.31802 5.27101C9.08928 5.47161 8.87795 5.70216 8.70079 5.91453C8.52266 6.12805 8.37285 6.33071 8.2677 6.47968C8.21494 6.55442 8.17298 6.61628 8.14384 6.66002C8.12926 6.68191 8.11786 6.69931 8.1099 6.71157C8.10591 6.7177 8.10279 6.72255 8.10055 6.72603C8.09943 6.72778 8.09853 6.72918 8.09786 6.73023C8.09752 6.73076 8.09724 6.7312 8.09702 6.73155C8.09691 6.73172 8.09681 6.73188 8.09672 6.73201C8.09668 6.73207 8.09663 6.73215 8.09661 6.73219C8.09656 6.73226 8.09652 6.73233 8.51855 7.00045ZM3.85189 9.33378L3.85189 9.83378L6.18522 9.83378V9.33378V8.83378H3.85189V9.33378ZM7.93522 9.91712C7.93522 10.4171 7.93473 10.4171 7.93425 10.4171C7.93409 10.4171 7.9336 10.4171 7.93328 10.4171C7.93263 10.4171 7.93199 10.4171 7.93135 10.4171C7.93008 10.4171 7.92881 10.4171 7.92756 10.4171C7.92506 10.417 7.92261 10.417 7.9202 10.4169C7.9154 10.4167 7.91079 10.4165 7.90638 10.4162C7.89755 10.4157 7.88952 10.4148 7.88224 10.4139C7.86764 10.4119 7.8563 10.4094 7.84799 10.407C7.83064 10.402 7.82893 10.3986 7.84016 10.4061C7.86167 10.4204 7.95516 10.4917 8.07134 10.7241L8.51855 10.5004L8.96577 10.2768C8.79028 9.92586 8.59211 9.7055 8.39486 9.57401C8.29672 9.50858 8.20386 9.46865 8.12271 9.44547C8.0825 9.43398 8.0461 9.42687 8.0144 9.42264C7.99859 9.42053 7.984 9.41915 7.97076 9.41829C7.96414 9.41787 7.95786 9.41757 7.95193 9.41738C7.94897 9.41729 7.94609 9.41722 7.94331 9.41718C7.94191 9.41716 7.94054 9.41714 7.9392 9.41713C7.93852 9.41712 7.93785 9.41712 7.93719 9.41712C7.93686 9.41712 7.93637 9.41712 7.9362 9.41712C7.93571 9.41712 7.93522 9.41712 7.93522 9.91712ZM8.51855 10.5004C8.94059 10.7686 8.94055 10.7686 8.94052 10.7687C8.94051 10.7687 8.94048 10.7687 8.94047 10.7688C8.94044 10.7688 8.94043 10.7688 8.94043 10.7688C8.94043 10.7688 8.94049 10.7687 8.9406 10.7685C8.94083 10.7682 8.94127 10.7675 8.94193 10.7665C8.94324 10.7644 8.94542 10.7611 8.94842 10.7564C8.95443 10.7472 8.96374 10.733 8.9761 10.7144C9.00085 10.6773 9.0377 10.6229 9.08467 10.5564C9.17896 10.4228 9.31224 10.2426 9.46867 10.0551C9.62607 9.86644 9.80077 9.67772 9.97736 9.52285C10.1591 9.36344 10.3157 9.26418 10.4355 9.22176L10.2686 8.75045L10.1016 8.27913C9.80963 8.38255 9.54157 8.57496 9.31802 8.77101C9.08928 8.97161 8.87795 9.20216 8.70079 9.41453C8.52266 9.62805 8.37285 9.83071 8.2677 9.97968C8.21494 10.0544 8.17298 10.1163 8.14384 10.16C8.12926 10.1819 8.11786 10.1993 8.1099 10.2116C8.10591 10.2177 8.10279 10.2225 8.10055 10.226C8.09943 10.2278 8.09853 10.2292 8.09786 10.2302C8.09752 10.2308 8.09724 10.2312 8.09702 10.2315C8.09691 10.2317 8.09681 10.2319 8.09672 10.232C8.09668 10.2321 8.09663 10.2322 8.09661 10.2322C8.09656 10.2323 8.09652 10.2323 8.51855 10.5004Z"
                    fill="#999999"
                  />
                </svg>

                <span className="text-[14px] text-[#999999]">
                  Total absences
                </span>
              </div>
              <span className="text-[16px] font-medium text-black">
                {student.absence_count ?? student.absences ?? 0}
              </span>
            </div>

            {/* justifi */}
            <div className="flex-1 box-border flex flex-col gap-[6px] p-3 bg-white border border-black/10 rounded-[10px]">
              <div className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.32491 3.72974C9.12965 3.53448 8.81306 3.53448 8.6178 3.72974C8.42254 3.925 8.42254 4.24159 8.6178 4.43685L8.97135 4.08329L9.32491 3.72974ZM9.55469 4.95829L9.10748 5.1819C9.18807 5.34308 9.34915 5.44843 9.52912 5.45764C9.70909 5.46685 9.8801 5.37851 9.97673 5.22641L9.55469 4.95829ZM11.4716 3.67961C11.7319 3.58742 11.8682 3.30167 11.776 3.04137C11.6838 2.78107 11.3981 2.64479 11.1378 2.73698L11.3047 3.20829L11.4716 3.67961ZM6.04193 1.66955C6.31782 1.68123 6.55095 1.46704 6.56263 1.19115C6.57431 0.915254 6.36012 0.682127 6.08423 0.670445L6.06308 1.17L6.04193 1.66955ZM3.47965 1.27619L3.51531 1.77491L3.53443 1.77355L3.55339 1.77072L3.47965 1.27619ZM1.40611 4.05353L0.90611 4.05353L1.40611 4.05353ZM1.40611 10.3415H1.90615L1.90607 10.3349L1.40611 10.3415ZM3.32048 12.7378L3.3496 12.2386H3.3496L3.32048 12.7378ZM9.8697 12.7378L9.84152 12.2386L9.83428 12.239L9.82705 12.2396L9.8697 12.7378ZM11.7671 10.955L11.2704 10.8972V10.8972L11.7671 10.955ZM12.4067 8.1667C12.4067 7.89056 12.1828 7.6667 11.9067 7.6667C11.6306 7.6667 11.4067 7.89056 11.4067 8.1667H11.9067H12.4067ZM4.30469 7.08329C4.02855 7.08329 3.80469 7.30715 3.80469 7.58329C3.80469 7.85943 4.02855 8.08329 4.30469 8.08329V7.58329V7.08329ZM6.63802 8.08329C6.91416 8.08329 7.13802 7.85943 7.13802 7.58329C7.13802 7.30715 6.91416 7.08329 6.63802 7.08329V7.58329V8.08329ZM4.30469 9.41663C4.02855 9.41663 3.80469 9.64048 3.80469 9.91663C3.80469 10.1928 4.02855 10.4166 4.30469 10.4166V9.91663V9.41663ZM8.97135 10.4166C9.2475 10.4166 9.47135 10.1928 9.47135 9.91663C9.47135 9.64048 9.2475 9.41663 8.97135 9.41663V9.91663V10.4166ZM8.97135 4.08329C8.6178 4.43685 8.61772 4.43676 8.61763 4.43668C8.61761 4.43665 8.61752 4.43657 8.61747 4.43651C8.61736 4.43641 8.61726 4.43631 8.61716 4.43621C8.61697 4.43601 8.61679 4.43583 8.61663 4.43567C8.61631 4.43535 8.61606 4.43509 8.61587 4.43491C8.61551 4.43453 8.61541 4.43443 8.61558 4.43461C8.61592 4.43496 8.61731 4.4364 8.61969 4.43894C8.62444 4.44401 8.63313 4.45344 8.6452 4.46723C8.66934 4.49483 8.70695 4.53978 8.75365 4.60204C8.8471 4.72665 8.97652 4.91999 9.10748 5.1819L9.55469 4.95829L10.0019 4.73469C9.84119 4.41327 9.67894 4.16911 9.55365 4.00204C9.49097 3.91848 9.43743 3.85405 9.39777 3.80873C9.37794 3.78606 9.36156 3.76815 9.34923 3.75499C9.34306 3.74842 9.3379 3.74302 9.33382 3.73881C9.33178 3.73671 9.33002 3.7349 9.32853 3.73339C9.32778 3.73263 9.32711 3.73195 9.3265 3.73134C9.3262 3.73104 9.32592 3.73075 9.32565 3.73049C9.32552 3.73035 9.32539 3.73022 9.32527 3.7301C9.3252 3.73004 9.32512 3.72995 9.32508 3.72992C9.325 3.72983 9.32491 3.72974 8.97135 4.08329ZM9.55469 4.95829C9.97673 5.22641 9.97669 5.22646 9.97666 5.22652C9.97665 5.22653 9.97662 5.22658 9.97661 5.2266C9.97658 5.22664 9.97657 5.22666 9.97657 5.22666C9.97657 5.22665 9.97663 5.22656 9.97674 5.22639C9.97696 5.22604 9.97741 5.22534 9.97806 5.22432C9.97938 5.22227 9.98156 5.21889 9.98456 5.21427C9.99057 5.20502 9.99988 5.19081 10.0122 5.17225C10.037 5.1351 10.0738 5.08075 10.1208 5.01421C10.2151 4.88063 10.3484 4.70048 10.5048 4.51296C10.6622 4.32429 10.8369 4.13556 11.0135 3.9807C11.1953 3.82129 11.3518 3.72202 11.4716 3.67961L11.3047 3.20829L11.1378 2.73698C10.8458 2.8404 10.5777 3.0328 10.3541 3.22886C10.1254 3.42946 9.91407 3.66001 9.73691 3.87238C9.55879 4.0859 9.40898 4.28856 9.30383 4.43753C9.25107 4.51227 9.20911 4.57413 9.17997 4.61787C9.16539 4.63976 9.15399 4.65716 9.14603 4.66942C9.14205 4.67555 9.13892 4.6804 9.13668 4.68388C9.13556 4.68563 9.13466 4.68703 9.13399 4.68808C9.13365 4.68861 9.13337 4.68905 9.13315 4.6894C9.13304 4.68957 9.13294 4.68973 9.13286 4.68986C9.13282 4.68992 9.13276 4.69 9.13274 4.69004C9.1327 4.69011 9.13265 4.69018 9.55469 4.95829ZM6.06308 1.17L6.08423 0.670445C5.33177 0.638587 4.666 0.665991 4.18798 0.701311C3.94865 0.718995 3.75554 0.738727 3.62117 0.754198C3.55396 0.761936 3.50139 0.768616 3.465 0.773451C3.44681 0.775869 3.43266 0.777827 3.42275 0.779227C3.41779 0.779926 3.4139 0.780487 3.41108 0.780895C3.40967 0.7811 3.40854 0.781266 3.40767 0.781393C3.40724 0.781456 3.40688 0.78151 3.40659 0.781554C3.40644 0.781575 3.40631 0.781595 3.4062 0.781611C3.40614 0.78162 3.40607 0.78163 3.40604 0.781635C3.40597 0.781645 3.40591 0.781654 3.47965 1.27619C3.55339 1.77072 3.55334 1.77073 3.55329 1.77073C3.55328 1.77074 3.55323 1.77074 3.55321 1.77075C3.55316 1.77075 3.55314 1.77076 3.55313 1.77076C3.55311 1.77076 3.55315 1.77075 3.55327 1.77074C3.5535 1.7707 3.554 1.77063 3.55477 1.77052C3.55631 1.7703 3.55891 1.76992 3.56255 1.76941C3.56985 1.76838 3.58131 1.76679 3.59675 1.76473C3.62764 1.76063 3.67442 1.75467 3.73555 1.74764C3.85785 1.73355 4.03732 1.71517 4.26167 1.69859C4.71101 1.66539 5.33694 1.6397 6.04193 1.66955L6.06308 1.17ZM3.47965 1.27619L3.44399 0.77746C3.02729 0.807254 2.38134 0.94053 1.83687 1.44378C1.2801 1.9584 0.906103 2.78805 0.90611 4.05353L1.40611 4.05353L1.90611 4.05353C1.9061 2.9911 2.21338 2.4575 2.51563 2.17814C2.83019 1.8874 3.22102 1.79595 3.51531 1.77491L3.47965 1.27619ZM1.40611 4.05353L0.90611 4.05353C0.906121 6.35489 0.891026 9.20947 0.906154 10.3481L1.40611 10.3415L1.90607 10.3349C1.89105 9.20476 1.90612 6.36843 1.90611 4.05353L1.40611 4.05353ZM1.40611 10.3415H0.90611C0.90611 10.7652 1.03149 11.4317 1.37456 12.0192C1.72732 12.6232 2.33821 13.1813 3.29136 13.2369L3.32048 12.7378L3.3496 12.2386C2.8175 12.2076 2.4712 11.9141 2.23809 11.5149C1.99529 11.0991 1.90611 10.6109 1.90611 10.3415H1.40611ZM3.32048 12.7378L3.29136 13.2369C5.10887 13.343 8.38704 13.3665 9.91234 13.236L9.8697 12.7378L9.82705 12.2396C8.36827 12.3645 5.14275 12.3432 3.3496 12.2386L3.32048 12.7378ZM9.8697 12.7378L9.89787 13.237C10.1672 13.2218 10.6877 13.1179 11.1774 12.7998C11.6865 12.4691 12.1599 11.9053 12.2637 11.0128L11.7671 10.955L11.2704 10.8972C11.206 11.4514 10.9304 11.7678 10.6327 11.9612C10.3157 12.1671 9.97161 12.2312 9.84152 12.2386L9.8697 12.7378ZM11.7671 10.955L12.2637 11.0128C12.442 9.4799 12.4067 8.40818 12.4067 8.1667H11.9067H11.4067C11.4067 8.42104 11.4408 9.43253 11.2704 10.8972L11.7671 10.955ZM13.0659 4.08329H12.5659C12.5659 5.41752 11.4831 6.49996 10.1464 6.49996V6.99996V7.49996C12.0345 7.49996 13.5659 5.97072 13.5659 4.08329H13.0659ZM10.1464 6.99996V6.49996C8.80976 6.49996 7.72696 5.41752 7.72696 4.08329H7.22696H6.72696C6.72696 5.97072 8.25838 7.49996 10.1464 7.49996V6.99996ZM7.22696 4.08329H7.72696C7.72696 2.74906 8.80976 1.66663 10.1464 1.66663V1.16663V0.666626C8.25838 0.666626 6.72696 2.19587 6.72696 4.08329H7.22696ZM10.1464 1.16663V1.66663C11.4831 1.66663 12.5659 2.74906 12.5659 4.08329H13.0659H13.5659C13.5659 2.19587 12.0345 0.666626 10.1464 0.666626V1.16663ZM4.30469 7.58329V8.08329H6.63802V7.58329V7.08329H4.30469V7.58329ZM4.30469 9.91663V10.4166H8.97135V9.91663V9.41663H4.30469V9.91663Z"
                    fill="#999999"
                  />
                </svg>

                <span className="text-[14px] text-[#999999]">
                  Total justifications
                </span>
              </div>
              <span className="text-[16px] font-medium text-black">
                {student.justification_count ?? 0}
              </span>
            </div>

            <StatusCard status={status} onSave={handleStatusSave} />
          </div>

          <div className="flex flex-col bg-white border border-black/10 rounded-[8px]">
            <div className="px-4 py-3 border-b border-[#E3E8EF] text-[14px] font-semibold text-black">
              Student&apos;s Attendance
            </div>
            <div className="flex flex-row flex-wrap items-center p-4 gap-x-[34px] gap-y-[32px]">
              <AttendanceDonut data={chartData} />

              <div className="flex flex-row gap-[30px] flex-1">
                {/* Column 1 */}
                <div className="flex flex-col gap-[10px] flex-1">
                  {LEGEND_ITEMS.slice(0, 5).map((item) => (
                    <div
                      key={item.key}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: item.color }}
                        />
                        <span style={{ fontSize: 10, color: "#8C97A7" }}>
                          {item.key}
                        </span>
                      </div>
                      <span className="text-[12px] font-semibold text-[#2A2E33]">
                        —
                      </span>
                    </div>
                  ))}
                </div>
                {/* Column 2 */}
                <div className="flex flex-col gap-[10px] flex-1">
                  {LEGEND_ITEMS.slice(5).map((item) => (
                    <div
                      key={item.key}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: item.color }}
                        />
                        <span style={{ fontSize: 10, color: "#8C97A7" }}>
                          {item.key}
                        </span>
                      </div>
                      <span className="text-[12px] font-semibold text-[#2A2E33]">
                        —
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <GradesSection grades={student.grades} />
        </div>
      </div>
    </div>
  );
}
