"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useAutoLogout } from "@/hooks/useAutoLogout";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function DashboardLayout({ children }) {
  useAuth();
  useAutoLogout();

  return (
    <RoleGuard allowedRoles={["admin", "teacher"]}>
      <div className="h-screen flex overflow-auto ">
        <div className="w-60 shrink-0 fixed left-0 top-0 h-full">
          <Sidebar />
        </div>

        <div className="flex flex-col flex-1 ml-60 min-w-0">
          <div className="h-16 fixed top-0 left-60 right-0 z-10 bg-white">
            <Navbar />
          </div>

          <main className="pt-16 h-screen overflow-y-auto p-4 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
