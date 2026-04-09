"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SessionCard from "@/components/session/SessionCard";
import RescheduleSession from "@/components/session/RescheduleSession";

// ─── Mock data ────────────────────────────────────────────────────────────────
const SESSIONS = [
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SessionsPage() {
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const router = useRouter();

  const openRescheduleModal = (session) => {
    setRescheduleTarget(session);
  };

  const closeRescheduleModal = () => {
    setRescheduleTarget(null);
  };

  return (
    <div className="main-page">
      {/* Page header — matches Figma node 292:4685 */}
      <div className="main-header">
        <div className="main-header-text">
          <h1 className="main-title">Today&apos;s Classes</h1>
          <p className="main-subtitle">Saturday — 21 March 2026</p>
        </div>
      </div>

      {/* Cards grid — matches Figma flex row with gap-22 */}
      <div className="sessions-page__grid">
        {SESSIONS.map((s) => (
          <SessionCard
            key={s.id}
            id={s.id}
            title={s.title}
            type={s.type}
            time={s.time}
            room={s.room}
            group={s.group}
            groupNumber={s.groupNumber}
            onStartSession={() => router.push(`/teacher/sessions/${s.id}`)}
            onReschedule={() => openRescheduleModal(s)}
            onCancel={() => console.log("Cancel", s.id)}
          />
        ))}
      </div>

      <RescheduleSession
        isOpen={Boolean(rescheduleTarget)}
        session={rescheduleTarget}
        onClose={closeRescheduleModal}
      />
    </div>
  );
}
