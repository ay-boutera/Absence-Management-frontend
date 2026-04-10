"use client";
import { use, useState } from "react";
import SessionDetailsHeader from "@/components/session/SessionDetailsHeader";
import SessionDetailsStats from "@/components/session/SessionDetailsStats";
import SessionStudentsTable from "@/components/session/SessionStudentsTable";

const MOCK_SESSIONS = [
  {
    id: 101,
    title: "Data Structures",
    type: "TD",
    time: "08:00 — 09:30",
    room: "Salle A2 — Sup",
    group: "CP1 — group",
    groupNumber: "3",
  },
  {
    id: 102,
    title: "Algorithms",
    type: "Course",
    time: "10:00 — 11:30",
    room: "Salle B1",
    group: "CP2 — group",
    groupNumber: "1",
  },
  {
    id: 103,
    title: "Database Systems",
    type: "Lab",
    time: "12:00 — 13:30",
    room: "Salle S3",
    group: "CS1 — group",
    groupNumber: "2",
  },
  {
    id: 104,
    title: "Operating Systems",
    type: "TD",
    time: "14:00 — 15:30",
    room: "Salle S4",
    group: "CS3 — group",
    groupNumber: "4",
  },
  {
    id: 105,
    title: "Computer Networks",
    type: "Course",
    time: "16:00 — 17:30",
    room: "Amphi E",
    group: "CS2 — group",
    groupNumber: "1",
  },
];

const MOCK_STUDENTS = [
  {
    id: 1,
    name: "Bouhafs Rim",
    email: "r.bouhafs@esi-sba.dz",
    studentId: "202334652314",
    present: false,
    grade: "A+",
    avatarColor: "#e2e8f0",
  },
  {
    id: 2,
    name: "Ilyes Brahmi",
    email: "i.brahmi@esi-sba.dz",
    studentId: "202334652320",
    present: true,
    grade: "A+",
    avatarColor: "#dbeafe",
  },
  {
    id: 3,
    name: "Trari Foued",
    email: "f.trari@esi-sba.dz",
    studentId: "202334652321",
    present: true,
    grade: "B+",
    avatarColor: "#fbecd1",
  },
  {
    id: 4,
    name: "Khelifi Sara",
    email: "s.khelifi@esi-sba.dz",
    studentId: "202334652322",
    present: true,
    grade: "B",
    avatarColor: "#f5d0fe",
  },
  {
    id: 5,
    name: "Cherif Malik",
    email: "m.cherif@esi-sba.dz",
    studentId: "202334652323",
    present: true,
    grade: "A-",
    avatarColor: "#e2e8f0",
  },
  {
    id: 6,
    name: "Bensalem Nadia",
    email: "n.bensalem@esi-sba.dz",
    studentId: "202334652324",
    present: true,
    grade: "A-",
    avatarColor: "#fde68a",
  },
  {
    id: 7,
    name: "Hassani Youssef",
    email: "y.hassani@esi-sba.dz",
    studentId: "202334652325",
    present: true,
    grade: "B+",
    avatarColor: "#bfdbfe",
  },
  {
    id: 8,
    name: "Amrani Lila",
    email: "l.amrani@esi-sba.dz",
    studentId: "202334652326",
    present: true,
    grade: "B",
    avatarColor: "#fecaca",
  },
];

export default function SessionDetailsPage({ params }) {
  const resolvedParams = use(params);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const sessionId = Array.isArray(resolvedParams?.id)
    ? resolvedParams.id[0]
    : resolvedParams?.id;
  const sessionIdNum = Number(sessionId);
  const session = MOCK_SESSIONS.find((s) => s.id === sessionIdNum) ?? null;
  const presentCount = students.filter((student) => student.present).length;
  const absentCount = students.length - presentCount;
  const absenceRate = ((absentCount / students.length) * 100).toFixed(1);

  if (!session) {
    return (
      <div className="main-page">
        <h2 className="main-title">Session not found</h2>
        <p className="main-subtitle">
          No session exists for ID: {String(sessionId)}
        </p>
      </div>
    );
  }

  return (
    <div className="main-page">
      <SessionDetailsHeader session={session} />
      <SessionDetailsStats
        session={session}
        presentCount={presentCount}
        absentCount={absentCount}
        absenceRate={absenceRate}
      />
      <SessionStudentsTable
        session={session}
        students={students}
        onStudentsChange={setStudents}
      />

      <div className="flex justify-end">
        <button className="bg-[#143888] border border-black/10 rounded-lg px-3.5 py-1.5 text-[14px] font-medium text-white hover:bg-[#0f2d6e] transition-colors">
          Save &amp; End session
        </button>
      </div>
    </div>
  );
}
