import { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Upload,
  Users,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StatusBadge from "@/components/StatusBadge";

const students = [
  {
    id: "1",
    name: "Bouhafs Rim",
    email: "r.bouhafs@esi-sba.dz",
    studentId: "202334652314",
    year: "1CP",
    group: "G3",
    absence: "1/12",
    status: "Safe",
  },
  {
    id: "2",
    name: "Ilyes Brahmi",
    email: "i.brahmi@esi-sba.dz",
    studentId: "202334652314",
    year: "1CP",
    group: "G2",
    absence: "3/12",
    status: "Safe",
  },
  {
    id: "3",
    name: "Bouteraa Ahmed Yassine",
    email: "ay.bouteraa@esi-sba.dz",
    studentId: "202334652314",
    year: "3CS",
    group: "G1",
    absence: "7/12",
    status: "Exclu",
  },
  {
    id: "4",
    name: "Meziani Ayla",
    email: "a.meziani@esi-sba.dz",
    studentId: "202334652314",
    year: "1CS",
    group: "G6",
    absence: "8/12",
    status: "warning",
  },
  {
    id: "5",
    name: "Bouhafs Abd El Djalil",
    email: "aed.bouhafs@esi-sba.dz",
    studentId: "202334652314",
    year: "2CS",
    group: "G8",
    absence: "0/12",
    status: "Safe",
  },
  {
    id: "6",
    name: "Trari Foued",
    email: "f.trari@esi-sba.dz",
    studentId: "202334652314",
    year: "2CP",
    group: "G10",
    absence: "2/12",
    status: "warning",
  },
];

const columns = ["Name", "Student ID", "Year", "Group", "Absence", "Status", "Action"];

export default function Students() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.includes(search)
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Students</h1>
          <p className="text-muted-foreground text-sm">
            View and manage students
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            Add new student <Plus className="h-4 w-4" />
          </Button>
          <Button className="gap-2">
            Import csv <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="h-5 w-5 text-muted-foreground" />
            Total Students : <span className="font-bold">1285</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by id or name"
                className="pl-10 bg-secondary border-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <ArrowUpDown className="h-4 w-4" /> Sort
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-foreground">
                    {student.studentId}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {student.year}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {student.group}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {student.absence}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={student.status} />
                  </td>

                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-secondary transition-colors">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              1 to {filtered.length}
            </span>{" "}Å
            of{" "}
            <span className="font-medium text-foreground">120</span> students
          </p>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "border border-primary text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-1 text-muted-foreground">...</span>

            <button
              onClick={() => setCurrentPage(10)}
              className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${
                currentPage === 10
                  ? "border border-primary text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              10
            </button>

            <div className="flex items-center gap-1 ml-4">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}