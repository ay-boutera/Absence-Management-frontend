"use client";

import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/lib/constants";
import Image from "next/image";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="#6b7280" strokeWidth="1.5" />
    <path
      d="M12.5 12.5L16 16"
      stroke="#6b7280"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2.5A5.5 5.5 0 0 0 4.5 8v3L3 12.5h14L15.5 11V8A5.5 5.5 0 0 0 10 2.5Z"
      stroke="#16151c"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 12.5v.5a2 2 0 0 0 4 0v-.5" stroke="#16151c" strokeWidth="1.5" />
  </svg>
);

export function Navbar() {
  const { user, role } = useAuthStore();
  // console.log("[Navbar] user:", user); // Removed after confirming display

  // Derive initials for the avatar fallback
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <header className="navbar ">
      {/* ── Left: Search + Notification ── */}
      <div className="navbar-left">
        <div className="navbar-search">
          <span className="navbar-search-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.75 15.75L12.495 12.495"
                stroke="#6B7280"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.25 8.25C2.25 11.5615 4.93851 14.25 8.25 14.25C11.5615 14.25 14.25 11.5615 14.25 8.25C14.25 4.93851 11.5615 2.25 8.25 2.25C4.93851 2.25 2.25 4.93851 2.25 8.25V8.25"
                stroke="#6B7280"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            className="font-normal text-[14px] text-gray-500"
            placeholder="Search anything..."
          />
        </div>

        <button className="navbar-notification" aria-label="Notifications">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.1641 5.36663C11.1641 4.95241 10.8283 4.61663 10.4141 4.61663C9.99989 4.61663 9.6641 4.95241 9.6641 5.36663H10.4141H11.1641ZM9.6641 8.14163C9.6641 8.55584 9.99989 8.89163 10.4141 8.89163C10.8283 8.89163 11.1641 8.55584 11.1641 8.14163H10.4141H9.6641ZM4.35577 10.8666L3.71362 10.4791L3.71238 10.4812L4.35577 10.8666ZM3.29743 12.6333L2.65404 12.2479L2.65301 12.2496L3.29743 12.6333ZM4.29743 15.3416L4.06026 16.0531L4.06071 16.0533L4.29743 15.3416ZM16.5724 15.3416L16.8092 16.0533L16.8096 16.0531L16.5724 15.3416ZM17.5724 12.6333L18.216 12.2482L18.2158 12.2479L17.5724 12.6333ZM16.5141 10.8666L17.1575 10.4812L17.1562 10.4791L16.5141 10.8666ZM15.9891 7.21663H16.7391L16.7391 7.21458L15.9891 7.21663ZM10.4141 5.36663H9.6641V8.14163H10.4141H11.1641V5.36663H10.4141ZM10.4308 1.66663V0.916626C6.94989 0.916626 4.13077 3.73575 4.13077 7.21663H4.88077H5.63077C5.63077 4.56417 7.77831 2.41663 10.4308 2.41663V1.66663ZM4.88077 7.21663H4.13077V8.96663H4.88077H5.63077V7.21663H4.88077ZM4.88077 8.96663H4.13077C4.13077 9.16177 4.08805 9.44598 4.00463 9.7485C3.92109 10.0514 3.81263 10.3151 3.71363 10.4791L4.35577 10.8666L4.99791 11.2541C5.19057 10.9349 5.34461 10.5318 5.45065 10.1473C5.55682 9.76227 5.63077 9.33815 5.63077 8.96663H4.88077ZM4.35577 10.8666L3.71238 10.4812L2.65405 12.2479L3.29743 12.6333L3.94082 13.0187L4.99915 11.2521L4.35577 10.8666ZM3.29743 12.6333L2.65301 12.2496C2.22326 12.9714 2.13318 13.7841 2.40016 14.5067C2.66724 15.2297 3.26415 15.7878 4.06026 16.0531L4.29743 15.3416L4.5346 14.6301C4.13071 14.4955 3.90262 14.2452 3.80721 13.9869C3.71168 13.7283 3.7216 13.3869 3.94185 13.017L3.29743 12.6333ZM4.29743 15.3416L4.06071 16.0533C8.19772 17.4294 12.6721 17.4294 16.8092 16.0533L16.5724 15.3416L16.3357 14.63C12.5061 15.9038 8.36381 15.9038 4.53416 14.63L4.29743 15.3416ZM16.5724 15.3416L16.8096 16.0531C18.3922 15.5256 19.069 13.6738 18.216 12.2482L17.5724 12.6333L16.9288 13.0184C17.2925 13.6262 17.0027 14.4077 16.3353 14.6301L16.5724 15.3416ZM17.5724 12.6333L18.2158 12.2479L17.1575 10.4812L16.5141 10.8666L15.8707 11.2521L16.929 13.0187L17.5724 12.6333ZM16.5141 10.8666L17.1562 10.4791C17.0578 10.316 16.9492 10.0509 16.8654 9.74594C16.7817 9.44134 16.7391 9.15718 16.7391 8.96663H15.9891H15.2391C15.2391 9.33441 15.3132 9.75858 15.4191 10.1436C15.5248 10.5282 15.6787 10.9339 15.872 11.2541L16.5141 10.8666ZM15.9891 8.96663H16.7391V7.21663H15.9891H15.2391V8.96663H15.9891ZM15.9891 7.21663L16.7391 7.21458C16.7296 3.75236 13.8954 0.916626 10.4308 0.916626V1.66663V2.41663C13.0662 2.41663 15.2319 4.58089 15.2391 7.21868L15.9891 7.21663ZM13.1891 15.6833H12.4391C12.4391 16.7941 11.5249 17.7083 10.4141 17.7083V18.4583V19.2083C12.3533 19.2083 13.9391 17.6225 13.9391 15.6833H13.1891ZM10.4141 18.4583V17.7083C9.86569 17.7083 9.35342 17.4786 8.9861 17.1113L8.45577 17.6416L7.92544 18.172C8.55811 18.8046 9.44584 19.2083 10.4141 19.2083V18.4583ZM8.45577 17.6416L8.9861 17.1113C8.61877 16.744 8.3891 16.2317 8.3891 15.6833H7.6391H6.8891C6.8891 16.6516 7.29276 17.5393 7.92544 18.172L8.45577 17.6416Z"
              fill="#16151C"
              fill-opacity="0.8"
            />
          </svg>
        </button>
      </div>

      {/* ── Right: User info + Avatar ── */}
      <div className="flex items-center gap-4">
        <div className="w-[129px] flex flex-col gap-[5px]">
          <span className="font-semibold text-[14px] text-[#16151c]">
            {fullName}
          </span>
          <span className="font-light text-[12px]  text-[#a2a1a8]">
            {role === ROLES.ADMIN ? "Admin" : "Teacher"}
          </span>
        </div>
        <div className="navbar-avatar ml-2" aria-hidden="true">
          <Image
            src="/keskes-nabil.png"
            width={47}
            height={47}
            alt={fullName || "Profile"}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <span style={{ display: "none" }}>{initials}</span>
        </div>
      </div>
    </header>
  );
}
