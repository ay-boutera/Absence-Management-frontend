"use client";

import { useState, useMemo } from "react";
import { Plus, Upload, GraduationCap, MoreVertical } from "lucide-react";


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
const MOCK_TEACHERS = [
  { id: "1", name: "Dr. Bouhafs Rim", email: "r.bouhafs@esi-sba.dz", role: "Director", subjects: ["AI", "Data Structures", "Algorithms"], groups: ["1CP-G3", "1CS-G2", "2CP-G1"] },
  { id: "2", name: "Dr. Bouhafs Rim", email: "r.bouhafs@esi-sba.dz", role: "Director", subjects: ["AI", "Data Structures"], groups: ["1CS-G2"] },
  { id: "3", name: "Dr. Bouhafs Rim", email: "r.bouhafs@esi-sba.dz", role: "Director", subjects: ["AI", "Algorithms"], groups: ["1CP-G3", "2CP-G1"] },
  { id: "4", name: "Dr. Bouhafs Rim", email: "r.bouhafs@esi-sba.dz", role: "Director", subjects: ["AI", "Data Structures"], groups: ["1CP-G3", "2CP-G1"] },
  { id: "5", name: "Dr. Bouhafs Rim", email: "r.bouhafs@esi-sba.dz", role: "Director", subjects: ["Algorithms"], groups: ["1CS-G2"] },
  { id: "6", name: "Dr. Bouhafs Rim", email: "r.bouhafs@esi-sba.dz", role: "Director", subjects: ["AI", "Algorithms"], groups: ["1CP-G3", "1CS-G2"] },
];

const AVATAR_COLORS = [
  ["bg-blue-100", "text-blue-800"],
  ["bg-pink-100", "text-pink-800"],
  ["bg-emerald-100", "text-emerald-800"],
  ["bg-amber-100", "text-amber-800"],
  ["bg-violet-100", "text-violet-800"],
  ["bg-rose-100", "text-rose-800"],
];

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
          { label: "Back", icon: <IconsChevronLeft />, side: "left" },
          { label: "Next", icon: <IconsChevronRight />, side: "right" },
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
function TableToolbar({
  icon,
  totalLabel,
  totalCount,
  search,
  onSearchChange,
  searchPlaceholder = "Search by id or name",
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#E3E8EF] bg-[#F8FAFF]">
      <div className="flex items-center gap-2 text-muted-foreground">
        <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: `1px solid ${T.border}`,
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
        <HatIcon /> </div>
        <span className="text-sm font-medium text-foreground">
          {totalLabel} :{" "}
          <span className="font-semibold">{totalCount}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  width: 310,
                  height: 36,
                  border: `1px solid #E5E9F0`,
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                <SearchIcon />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by id or name"
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 14,
                    color: T.muted,
                    fontFamily: "inherit",
                    width: "100%",
                  }}
                />
              </div>
         
        </div>

        <button className="flex items-center gap-1.5 px-3 h-9 text-sm border border-[#E3E8EF] rounded-lg hover:bg-muted transition-colors text-foreground">
          {/* <SlidersHorizontal size={14} />  */}
          Filter
        </button>

        <button className="flex items-center gap-1.5 px-3 h-9 text-sm border border-[#E3E8EF] rounded-lg hover:bg-muted transition-colors text-foreground">
          <SortIcon size={14} /> 
          Sort
        </button>
      </div>
    </div>
  );
}

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
function TeacherAvatar({ teacher }) {
  const idx = parseInt(teacher.id) % AVATAR_COLORS.length;
  const [bg, fg] = AVATAR_COLORS[idx];

  const initials = teacher.name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${bg} ${fg}`}
    >
      {initials}
    </div>
  );
}

function Badge({ children }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "3px 11px",
        gap: "10px",
        border: "0.8px solid rgba(0, 0, 0, 0.08)",
        borderRadius: "60px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <span
        style={{
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "20px",
          textAlign: "center",
          letterSpacing: "-0.02em",
          color: "#000000",
        }}
      >
        {children}
      </span>
    </div>
  );
}


export default function TeachersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [teachers, setTeachers] = useState([]);
  const perPage = 7;

  //   t3 csv
  const [csvFile, setCsvFile] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
    }
  };


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

  const handleUploadCSV = async () => {
    if (!csvFile) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await fetch("http://localhost:8000/api/v1/import/teachers", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.detail || "Upload failed");
      }

      alert("CSV uploaded successfully");
      fetchTeachers();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  //   t3 csv

  const filtered = useMemo(() => {
    if (!search) return MOCK_TEACHERS;
    const q = search.toLowerCase();
    return MOCK_TEACHERS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );
  }, [search]);
  

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="m-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        
        <div>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: T.blue2,
                margin: 0,
              }}
            >
              Teachers
            </h1>
            <p style={{ fontSize: 14, color: T.muted, margin: "3px 0 0" }}>
              View and manage teachers
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
           
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px",
                height: 36,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
                fontSize: 14,
                color: T.blue2,
                fontFamily: "inherit",
              }}
            >
              Add new teacher
              <PlusIcon />
            </button>
            {/* Import csv */}
            {/* <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px",
                height: 36,
                border: `0.5px solid rgba(0,0,0,0.08)`,
                borderRadius: 8,
                background: T.blue2,
                cursor: "pointer",
                fontSize: 14,
                color: "#fff",
                fontFamily: "inherit",
              }}
            >
              Import csv
              <ImportIcon />
            </button> */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="file"
                accept=".csv"
                id="csvUpload"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <label
                htmlFor="csvUpload"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 14px",
                  height: 36,
                  border: `0.5px solid rgba(0,0,0,0.08)`,
                  borderRadius: 8,
                  background: T.blue2,
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#fff",
                }}
              >
                Select CSV
                <ImportIcon />
              </label>

              <button
                onClick={handleUploadCSV}
                style={{
                  padding: "6px 14px",
                  height: 36,
                  borderRadius: 8,
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Upload
              </button>
            </div>
          </div>

        
      </div>


      {/* Table card */}
      <div className="bg-card rounded-xl border border-[#E3E8EF]">
        <TableToolbar
          icon={<GraduationCap size={18} />}
          totalLabel="Total teachers"
          totalCount={26}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="overflow-x-auto ">
          <table className="w-full ">
            <thead> 
              <tr className="border-b border-[#E3E8EF] bg-[#F8FAFF]">
                {["Name", "Role", "Subjects", "Groups", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-normal text-muted-foreground whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paged.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[#E3E8EF] last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <TeacherAvatar teacher={t} />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-foreground">
                    {t.role}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.slice(0, 3).map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {s}
                        </Badge>
                      ))}
                      {t.subjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          ...
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
  <div className="flex flex-wrap gap-1">
    {t.groups.map((g) => (
      <div
        key={g}
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "3px 11px",
          border: "0.8px solid rgba(0, 0, 0, 0.08)",
          borderRadius: "60px",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <span
          style={{
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "20px",
            textAlign: "center",
            letterSpacing: "-0.02em",
            color: "#000000",
          }}
        >
          {g}
        </span>
      </div>
    ))}
  </div>
</td>

                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
  page={page}
  totalPages={totalPages}
  onPage={setPage}
/>
      </div>
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
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.3125 12.375H10.6875"
          stroke="#030712"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
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
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
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
const HatIcon = () => {
  return (
    <div>
     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.26175 7.33333L4.42515 11.0866C4.42842 11.1617 4.43654 11.237 4.45833 11.309C4.52564 11.5315 4.64971 11.7337 4.83899 11.8696C6.31996 12.9323 10.1924 12.9323 11.6734 11.8696C11.8627 11.7337 11.9867 11.5315 12.054 11.309C12.0758 11.237 12.0839 11.1617 12.0872 11.0866L12.2506 7.33333M13.9147 6.33333V11M13.9147 11C13.3867 11.9642 13.1532 12.4808 12.9161 13.3333C12.8646 13.6367 12.9055 13.7895 13.1145 13.9253C13.1995 13.9804 13.3015 14 13.4027 14H14.4164C14.5241 14 14.6329 13.9775 14.7216 13.9164C14.9159 13.7824 14.966 13.6353 14.9133 13.3333C14.7054 12.5417 14.4406 12.0006 13.9147 11ZM1.59909 5.33333C1.59909 6.22785 6.9957 8.66667 8.25648 8.66667C9.51726 8.66667 14.9139 6.22785 14.9139 5.33333C14.9139 4.43881 9.51726 2 8.25648 2C6.9957 2 1.59909 4.43881 1.59909 5.33333Z" stroke="#16151C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    </div>
  );
};


