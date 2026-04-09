import AdminJustificationsTable from "@/components/dashboard/AdminJustificationsTable";

const MOCK_JUSTIFICATIONS = [
  {
    id: 1,
    student_name: "Bouhafs Rim",
    student_email: "r.bouhafs@esi-sba.dz",
    date: "2026-03-21",
    reason: "Medical — Flu",
    document: "/docs/medical_cert_001.pdf",
    document_name: "medical_cert_001.pdf",
    status: "Pending",
  },
  {
    id: 2,
    student_name: "Ilyes Brahmi",
    student_email: "i.brahmi@esi-sba.dz",
    date: "2026-03-21",
    reason: "Family emergency",
    document: "/docs/family_cert_002.pdf",
    document_name: "family_cert_002.pdf",
    status: "Pending",
  },
  {
    id: 3,
    student_name: "Bouteraa Ahmed Yassine",
    student_email: "a.bouteraa@esi-sba.dz",
    date: "2026-03-21",
    reason: "Medical — Surgery recovery",
    document: "/docs/surgery_cert_003.pdf",
    document_name: "surgery_cert_003.pdf",
    status: "Pending",
  },
  {
    id: 4,
    student_name: "Meziani Ayla",
    student_email: "a.meziani@esi-sba.dz",
    date: "2026-03-21",
    reason: "Transport strike",
    document: "/docs/transport_proof_004.pdf",
    document_name: "transport_proof_004.pdf",
    status: "Rejected",
  },
  {
    id: 5,
    student_name: "Bouhafs Abd El Djalil",
    student_email: "d.bouhafs@esi-sba.dz",
    date: "2026-03-21",
    reason: "Medical — Dental procedure",
    document: "/docs/dental_cert_005.pdf",
    document_name: "dental_cert_005.pdf",
    status: "Approved",
  },
  {
    id: 6,
    student_name: "Trari Foued",
    student_email: "f.trari@esi-sba.dz",
    date: "2026-03-21",
    reason: "Medical — Dental procedure",
    document: "/docs/dental_cert_005.pdf",
    document_name: "dental_cert_005.pdf",
    status: "Rejected",
  },
  {
    id: 7,
    student_name: "Trari Foued",
    student_email: "f.trari@esi-sba.dz",
    date: "2026-03-21",
    reason: "Medical — Dental procedure",
    document: "/docs/dental_cert_005.pdf",
    document_name: "dental_cert_005.pdf",
    status: "Rejected",
  },
  {
    id: 8,
    student_name: "Ait Oussama",
    student_email: "o.ait@esi-sba.dz",
    date: "2026-03-20",
    reason: "Administrative issue",
    document: "/docs/admin_006.pdf",
    document_name: "admin_006.pdf",
    status: "Pending",
  },
];

export default function JustificationPage() {
  return (
    <div className="main-page">
      {/* ── Header row ── */}
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Justification</h2>
          <p className="main-subtitle">View ESI attendance statistics</p>
        </div>
        <div className="justifications-actions">
          <button className="justifications-action-btn justifications-action-btn--reject">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8.60001 0.600098L0.600006 8.6001M0.600006 0.600098L8.60001 8.6001"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reject all
          </button>
          <button className="justifications-action-btn justifications-action-btn--approve">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M11.2667 0.600098L3.93334 7.93343L0.600006 4.6001"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Approve all
          </button>
        </div>
      </div>

      <AdminJustificationsTable justifications={MOCK_JUSTIFICATIONS} />
    </div>
  );
}
