"use client";
import { useState, useRef } from "react";

const IMPORT_TYPES = [
  {
    key: "students",
    label: "List of students",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    description: "Import from Progres — CSV file with columns: matricule, name, first name, email, year, group",
    endpoint: "/api/v1/import/students",
  },
  {
    key: "teachers",
    label: "List of teachers",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
        <path d="M12 12v5"/><path d="M8 12v5"/><path d="M16 12v5"/>
        <path d="M2 7l10-4 10 4"/>
      </svg>
    ),
    description: "Import from Progres — CSV file with columns: matricule, name, first name, email, year, group",
    endpoint: "/api/v1/import/teachers",
  },
  {
    key: "sessions",
    label: "Session planning",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    description: "Import from Progres — CSV file with columns: date, star_time, fin_time, module, teacher, room, group",
    endpoint: "/api/v1/import/planning",
  },
];

const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5"/>
    <circle cx="12" cy="12" r="1.5"/>
    <circle cx="12" cy="19" r="1.5"/>
  </svg>
);
function ErrorModal({ fileName, errorData, onClose }) {
  const isRowErrors = Array.isArray(errorData) && errorData.length > 0;
  const errorCount = isRowErrors ? errorData.length : 1;
  const today = new Date().toLocaleDateString("fr-FR");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      
      <div
        className="w-217.25 bg-white border border-black/10 shadow-[0_0_7px_rgba(0,0,0,0.07)] rounded-[18px] p-6 flex flex-col gap-9 tracking-wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl  font-normal text-[#D62525]">
            Errors occurred !
          </h2>

          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-[30px] ">
          {/* ===== Summary Card ===== */}
          <div className="border border-[#E3E8EF] rounded-lg overflow-hidden">
            {/* Card Header */}
            <div className="flex justify-between items-center px-4 py-[14px] border-b border-[#E3E8EF]">
              <span className="text-l font-medium text-[#D62525]">
                Import Errors Report
              </span>

              <button className="w-6 h-6 border border-[#E3E8EF] rounded flex items-center justify-center">
                <DotsIcon />
              </button>
            </div>

           
            <div className="flex justify-between px-4 py-[14px] text-[14px] font-thin">
              <div className="flex gap-1">
                <span className="text-[#D62525]">File:</span>
                <span className="text-[#4A5567]">{fileName}</span>
              </div>

              <div className="flex gap-1">
                <span className="text-[#D62525]">Errors found:</span>
                <span className="text-[#4A5567]">{errorCount}</span>
              </div>

              <div className="flex gap-1">
                <span className="text-[#D62525]">Date:</span>
                <span className="text-[#4A5567]">{today}</span>
              </div>
            </div>
          </div>
          <div className="border border-[#E3E8EF] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-[14px] border-b border-[#E3E8EF]">
              <span className="text-[16px] font-me text-[#D62525]">
                Error Details
              </span>

              <button className="w-6 h-6 border border-[#E3E8EF] rounded flex items-center justify-center">
                <DotsIcon />
              </button>
            </div>
            {isRowErrors ? (
              <table className="w-full text-[15px]">
  <thead className="bg-black/5 border-b border-[#E6EBF0]">
    <tr>
      <th className="text-left px-4 py-3 text-[#4A5567] font-light capitalize tracking-wide">
        Row
      </th>
      <th className="text-left px-4 py-3 text-[#4A5567] font-light capitalize tracking-wide">
        Field
      </th>
      <th className="text-left px-4 py-3 text-[#4A5567] font-light capitalize tracking-wide">
        Error Type
      </th>
      <th className="text-left px-4 py-3 text-[#4A5567] font-light capitalize tracking-wide">
        Description
      </th>
    </tr>
  </thead>

  <tbody className="[&>tr>td]:py-4">
    {errorData.map((err, i) => (
      <tr
        key={i}
        className="border-b border-[#E3E8EF] hover:bg-black/5 transition"
      >
        <td className="px-4 text-[#D62525] font-light capitalize">
          {err.line ?? i + 1}
        </td>

        <td className="px-4 text-[#D62525] font-light capitalize">
          {err.field ?? "—"}
        </td>

        <td className="px-4 text-[#D62525] font-light capitalize">
          {err.error_type ?? err.type ?? "Error"}
        </td>

        <td className="px-4 text-[#D62525] font-light capitalize leading-relaxed">
          {err.reason ?? err.description ?? "—"}
        </td>
      </tr>
    ))}
  </tbody>
</table>

            ) : (
              <div className="px-4 py-3 text-[14px] text-[#D62525]">
                {String(errorData)
                  .split(",")
                  .map((msg, i) => (
                    <div key={i} className="flex gap-2">
                      <span>•</span>
                      <span>{msg.trim()}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}





// ── Main Page ──────────────────────────────────────────────────────────────────
function ImportPage() {
  const [activeTab, setActiveTab] = useState("import");
  const [selected, setSelected]   = useState("students");
  const [file, setFile]           = useState(null);
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState("");
  const [errorData, setErrorData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const inputRef = useRef(null);

  const handleSelect = (key) => {
    setSelected(key); setFile(null);
    setMessage(""); setErrorData(null); setShowModal(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setMessage(""); setErrorData(null); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) { setFile(f); setMessage(""); setErrorData(null); }
  };

  const handleUpload = async () => {
    if (!file) return;
    const endpoint = IMPORT_TYPES.find((t) => t.key === selected)?.endpoint;
    try {
      setLoading(true); setMessage(""); setErrorData(null); setShowModal(false);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const data = await response.json();
      console.log("Upload response:", data);
      if (!response.ok || (data.errors !== undefined && data.errors > 0)) {
        if (Array.isArray(data.error_report) && data.error_report.length > 0) setErrorData(data.error_report);
        else if (data.detail) setErrorData(data.detail);
        else setErrorData("An unknown error occurred.");
        setShowModal(true);
        return;
      }
      setMessage("CSV imported successfully ✓");
      setFile(null);
    } catch (err) {
      setErrorData(err.message || "Failed to upload CSV.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    {showModal && (
      <ErrorModal
        fileName={file?.name ?? "uploaded_file.csv"}
        errorData={errorData}
        onClose={() => setShowModal(false)}
      />
    )}

   
    <input
      ref={inputRef}
      type="file"
      accept=".csv"
      className="hidden"
      onChange={handleFileChange}
    />

    <div className="flex flex-col gap-[30px] p-8 min-h-screen bg-white tracking-wide">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[22px] font-medium text-[#143888] m-0 leading-snug">
            Import / Export
          </h2>
          <p className="text-[13px] font-light text-gray-550 m-0 mt-1">
            Import the data from Progres (CSV) and export the absence reports.
          </p>
        </div>

       <div className="flex gap-2 shrink-0">
  <button
    onClick={() => setActiveTab("export")}
    className={`px-2 py-1.75 rounded-lg text-[13px] font-normal border transition-colors ${
      activeTab === "export"
        ? "border-[#143888] text-[#143888] bg-[#f0f4ff]"
        : "border-[#143888] text-white bg-[#143888] hover:border-gray-300"
    }`}
  >
    Export data
  </button>
</div>

      </div>

      
      <div className="flex flex-col gap-4 bg-white border border-gray-200 rounded-2xl p-5">

        <div className="grid grid-cols-3 gap-4">
          {IMPORT_TYPES.map((t) => (
            <div
              key={t.key}
              onClick={() => handleSelect(t.key)}
              className={`flex flex-col gap-2 border rounded-xl p-4 cursor-pointer transition-all ${
                selected === t.key
                  ? "border-[#143888] bg-[#f0f4ff]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-medium text-[16px] tracking-wide ${
                  selected === t.key ? "text-[#143888]" : "text-[#000000]/60"
                }`}
              >
                {t.icon}
                {t.label}
              </div>

              <p
                className={`text-[13px]  font-light ${
                  selected === t.key ? "text-gray-400" : "text-[#4A5567]/60"
                }`}
              >
                {t.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Upload drop zone ── */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col gap-4 border-2 border-dashed rounded-xl px-6 py-5 transition-all cursor-pointer select-none ${
            dragOver
              ? "border-[#143888] bg-blue-50"
              : file
              ? "border-gray-300 bg-white"
              : "border-gray-200 bg-white hover:border-[#143888] hover:bg-blue-50/20"
          }`}
        >
          <div>
            <p className="text-[16px] font-medium text-gray-800 m-0">
              Upload a CSV file
            </p>
            <p className="text-[14px] text-[#4A5567]/60 m-0 mt-1 tracking-wide">
              {file ? (
                <span className="text-[#143888] font-medium "> {file.name}</span>
              ) : (
                "Select a .csv file separated by semicolons (;)"
              )}
            </p>
          </div>

          
          <div
            className="flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {file && (
              <button
                onClick={() => inputRef.current?.click()}
                className="text-[12px] text-gray-400 underline hover:text-gray-600 transition-colors"
              >
                Change file
              </button>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2 ${
                !file
                  ? "bg-white text-[#4A5567]/60 cursor-not-allowed border border-gray-200"
                  : loading
                  ? "bg-[#93aad6] text-white cursor-not-allowed"
                  : "text-white bg-[#143888] border border-[#143888] hover:bg-[#f5f8ff]"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Uploading…
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>

          {message && (
            <p className="text-[13px] text-green-600 font-medium m-0">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  </>
);

}

export default ImportPage;