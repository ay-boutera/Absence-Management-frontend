"use client";
import { useState, useRef } from "react";

const IMPORT_TYPES = [
  {
    key: "students",
    label: "List of students",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.8405 3.39929C13.1978 3.39929 14.2893 4.49774 14.2893 5.84806C14.2893 7.17039 13.2398 8.24784 11.9315 8.29682C11.8755 8.28982 11.8125 8.28982 11.7496 8.29682M13.1908 14.5936C13.6946 14.4887 14.1704 14.2858 14.5622 13.9849C15.6536 13.1664 15.6536 11.816 14.5622 10.9975C14.1773 10.7036 13.7086 10.5077 13.2118 10.3958M6.76809 8.20587C6.69813 8.19887 6.61417 8.19887 6.53721 8.20587C4.87205 8.14989 3.54972 6.78558 3.54972 5.10643C3.54972 3.3923 4.93502 2 6.65615 2C8.37028 2 9.76258 3.3923 9.76258 5.10643C9.75558 6.78558 8.43325 8.14989 6.76809 8.20587ZM3.26986 10.7876C1.57671 11.921 1.57671 13.7681 3.26986 14.8945C5.19389 16.1818 8.34929 16.1818 10.2733 14.8945C11.9665 13.7611 11.9665 11.914 10.2733 10.7876C8.35629 9.50721 5.20088 9.50721 3.26986 10.7876Z"
          stroke="#143888"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    description:
      "Import from Progres — CSV file with columns: matricule, name, first name, email, year, group",
    endpoint: "/api/v1/import/students",
  },
  {
    key: "teachers",
    label: "List of teachers",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.79456 8.25L4.97839 12.4724C4.98207 12.557 4.99121 12.6416 5.01571 12.7226C5.09144 12.973 5.23101 13.2004 5.44396 13.3533C7.11005 14.5489 11.4666 14.5489 13.1326 13.3533C13.3456 13.2004 13.4852 12.973 13.5609 12.7226C13.5854 12.6416 13.5945 12.557 13.5982 12.4724L13.782 8.25M15.6541 7.125V12.375M15.6541 12.375C15.0601 13.4597 14.7975 14.0409 14.5307 15C14.4728 15.3413 14.5188 15.5132 14.754 15.6659C14.8495 15.728 14.9643 15.75 15.0782 15.75H16.2185C16.3397 15.75 16.4621 15.7247 16.5619 15.6559C16.7805 15.5051 16.8368 15.3397 16.7775 15C16.5437 14.1094 16.2458 13.5006 15.6541 12.375ZM1.79907 6C1.79907 7.00633 7.87026 9.75 9.28864 9.75C10.707 9.75 16.7782 7.00633 16.7782 6C16.7782 4.99366 10.707 2.25 9.28864 2.25C7.87026 2.25 1.79907 4.99366 1.79907 6Z"
          stroke="black"
          stroke-opacity="0.6"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    description:
      "Import from Progres — CSV file with columns: matricule, name, first name, email, year, group",
    endpoint: "/api/v1/import/teachers",
  },
  {
    key: "sessions",
    label: "Session planning",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7 2.25V4.95M6.30005 2.25V4.95"
          stroke="CurrentColor"
          stroke-opacity="0.6"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.67505 3.6001H8.32505C5.77946 3.6001 4.50667 3.6001 3.71586 4.39091C2.92505 5.18172 2.92505 6.45451 2.92505 9.0001V10.3501C2.92505 12.8957 2.92505 14.1685 3.71586 14.9593C4.50667 15.7501 5.77946 15.7501 8.32505 15.7501H9.67505C12.2206 15.7501 13.4934 15.7501 14.2842 14.9593C15.075 14.1685 15.075 12.8957 15.075 10.3501V9.0001C15.075 6.45451 15.075 5.18172 14.2842 4.39091C13.4934 3.6001 12.2206 3.6001 9.67505 3.6001Z"
          stroke="CurrentColor"
          stroke-opacity="0.6"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.92505 7.6499H15.075"
          stroke="CurrentColor"
          stroke-opacity="0.6"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    description:
      "Import from Progres — CSV file with columns: date, star_time, fin_time, module, teacher, room, group",
    endpoint: "/api/v1/import/planning",
  },
];

const DotsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
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
  const [selected, setSelected] = useState("students");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorData, setErrorData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleSelect = (key) => {
    setSelected(key);
    setFile(null);
    setMessage("");
    setErrorData(null);
    setShowModal(false);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setMessage("");
      setErrorData(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
      setMessage("");
      setErrorData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const endpoint = IMPORT_TYPES.find((t) => t.key === selected)?.endpoint;
    try {
      setLoading(true);
      setMessage("");
      setErrorData(null);
      setShowModal(false);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Upload response:", data);
      if (!response.ok || (data.errors !== undefined && data.errors > 0)) {
        if (Array.isArray(data.error_report) && data.error_report.length > 0)
          setErrorData(data.error_report);
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
          <div className="main-header-text">
            <h2 className="main-title">Import / Export</h2>
            <p className="main-subtitle">
              {" "}
              Import the data from Progres (CSV) and export the absence reports.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("export")}
              className={`px-2 py-1.75 rounded-lg font-regular text-[14px] leading-[24px] text-white border flex items-center gap-3.5 transition-colors ${
                activeTab === "export"
                  ? "border-[#143888] text-[#143888] bg-[#f0f4ff]"
                  : "border-[#143888] text-white bg-[#143888] hover:border-gray-300"
              }`}
            >
              Export data
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6516 6.00737C11.6566 6.00735 11.6616 6.00734 11.6666 6.00734C13.3234 6.00734 14.6666 7.35295 14.6666 9.01284C14.6666 10.5599 13.4999 11.8339 11.9999 12M11.6516 6.00737C11.6615 5.89737 11.6666 5.78597 11.6666 5.67339C11.6666 3.64463 10.025 2 7.99992 2C6.08208 2 4.50814 3.47511 4.34687 5.35461M11.6516 6.00737C11.5835 6.76506 11.2857 7.4564 10.8285 8.01101M4.34687 5.35461C2.65591 5.51582 1.33325 6.94261 1.33325 8.6789C1.33325 10.2945 2.47842 11.6421 3.99992 11.9515M4.34687 5.35461C4.45209 5.34458 4.55874 5.33945 4.66659 5.33945C5.41713 5.33945 6.10975 5.58796 6.66691 6.00734"
                  stroke="white"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.99992 8.6665L7.99992 13.9998M7.99992 8.6665C7.5331 8.6665 6.66094 9.99604 6.33325 10.3332M7.99992 8.6665C8.46674 8.6665 9.3389 9.99604 9.66659 10.3332"
                  stroke="white"
                  stroke-width="1.3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
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
                  <span className="text-[#143888] font-medium ">
                    {" "}
                    {file.name}
                  </span>
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
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
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
