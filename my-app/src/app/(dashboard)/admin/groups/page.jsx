import AdminGroupsTable from "@/components/dashboard/AdminGroupsTable";
const mockGroups = [
  {
    id: 1,
    year: "CP1",
    section: "A",
    number: "G1",
    speciality: "Computer Science",
    student_count: 32,
    absence_rate: 12,
  },
  {
    id: 2,
    year: "CP2",
    section: "B",
    number: "G2",
    speciality: "Information Systems",
    student_count: 28,
    absence_rate: 8,
  },
  {
    id: 3,
    year: "CS1",
    section: "A",
    number: "G3",
    speciality: "Software Engineering",
    student_count: 35,
    absence_rate: 15,
  },
  {
    id: 4,
    year: "CS2",
    section: "C",
    number: "G4",
    speciality: "AI",
    student_count: 22,
    absence_rate: 5,
  },
  {
    id: 5,
    year: "CS3",
    section: "B",
    number: "G5",
    speciality: "Cyber Security",
    student_count: 30,
    absence_rate: 18,
  },
  {
    id: 6,
    year: "CP1",
    section: "B",
    number: "G1",
    speciality: "Data Science",
    student_count: 27,
    absence_rate: 10,
  },
  {
    id: 7,
    year: "CP2",
    section: "A",
    number: "G1",
    speciality: "Networks",
    student_count: 26,
    absence_rate: 9,
  },
  {
    id: 8,
    year: "CP2",
    section: "C",
    number: "G3",
    speciality: "Embedded Systems",
    student_count: 24,
    absence_rate: 13,
  },
  {
    id: 9,
    year: "CS1",
    section: "B",
    number: "G2",
    speciality: "Software Engineering",
    student_count: 31,
    absence_rate: 11,
  },
  {
    id: 10,
    year: "CS1",
    section: "C",
    number: "G4",
    speciality: "Cloud Computing",
    student_count: 29,
    absence_rate: 14,
  },
  {
    id: 11,
    year: "CS2",
    section: "A",
    number: "G1",
    speciality: "AI",
    student_count: 25,
    absence_rate: 6,
  },
  {
    id: 12,
    year: "CS2",
    section: "B",
    number: "G2",
    speciality: "Data Engineering",
    student_count: 27,
    absence_rate: 7,
  },
  {
    id: 13,
    year: "CS3",
    section: "A",
    number: "G1",
    speciality: "Cyber Security",
    student_count: 28,
    absence_rate: 16,
  },
  {
    id: 14,
    year: "CS3",
    section: "C",
    number: "G3",
    speciality: "DevOps",
    student_count: 23,
    absence_rate: 12,
  },
  {
    id: 15,
    year: "CP1",
    section: "C",
    number: "G3",
    speciality: "Mathematics",
    student_count: 21,
    absence_rate: 8,
  },
];
export default function GroupsPage() {
  return (
    <div className="main-page groups-page">
      <div className="main-header">
        <div className="main-header-text">
          <h2 className="main-title">Groups</h2>
          <p className="main-subtitle">View and manage groups</p>
        </div>
      </div>
      <AdminGroupsTable groups={mockGroups} />
    </div>
  );
}
