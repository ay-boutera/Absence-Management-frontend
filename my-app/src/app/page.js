"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else {
      if (role === "admin") {
        router.replace("/admin");
      } else if (role === "teacher") {
        router.replace("/teacher");
      }
    }
  }, [isAuthenticated, role, router]);

  // Optionally, show nothing or a loading spinner while redirecting
  return null;
}
