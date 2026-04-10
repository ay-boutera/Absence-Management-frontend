// ============================================
// AMS — ESI Sidi Bel Abbès
// components/layout/Sidebar.jsx
// ============================================

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/services/authService";
import { ROLES } from "@/lib/constants";
import Image from "next/image";

// ── Icons ────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="2"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="11"
        y="2"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="2"
        y="11"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="11"
        y="11"
        width="7"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  students: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M12.3707 2.31706C13.9874 2.31706 15.2874 3.62539 15.2874 5.23372C15.2874 6.80872 14.0374 8.09206 12.4791 8.15039C12.4124 8.14206 12.3374 8.14206 12.2624 8.15039M13.9791 15.6504C14.5791 15.5254 15.1457 15.2837 15.6124 14.9254C16.9124 13.9504 16.9124 12.3421 15.6124 11.3671C15.1541 11.0171 14.5957 10.7837 14.0041 10.6504M6.32907 8.04206C6.24574 8.03372 6.14574 8.03372 6.05407 8.04206C4.07074 7.97539 2.49574 6.35039 2.49574 4.35039C2.49574 2.30872 4.14574 0.650391 6.19574 0.650391C8.2374 0.650391 9.89573 2.30872 9.89573 4.35039C9.8874 6.35039 8.3124 7.97539 6.32907 8.04206ZM2.1624 11.1171C0.145736 12.4671 0.145736 14.6671 2.1624 16.0087C4.45407 17.5421 8.2124 17.5421 10.5041 16.0087C12.5207 14.6587 12.5207 12.4587 10.5041 11.1171C8.22074 9.59206 4.4624 9.59206 2.1624 11.1171Z"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  teachers: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5.3271 9.16667L5.53136 13.8583C5.53544 13.9522 5.5456 14.0462 5.57282 14.1362C5.65696 14.4144 5.81205 14.6672 6.04865 14.837C7.89986 16.1654 12.7404 16.1654 14.5916 14.837C14.8283 14.6672 14.9833 14.4144 15.0674 14.1362C15.0947 14.0462 15.1048 13.9522 15.109 13.8583L15.3132 9.16667M17.3933 7.91667V13.75M17.3933 13.75C16.7333 14.9553 16.4414 15.601 16.145 16.6667C16.0807 17.0459 16.1318 17.2369 16.3931 17.4066C16.4992 17.4755 16.6268 17.5 16.7533 17.5H18.0204C18.1551 17.5 18.291 17.4719 18.4019 17.3954C18.6448 17.2279 18.7074 17.0441 18.6415 16.6667C18.3817 15.6772 18.0507 15.0007 17.3933 13.75ZM1.99878 6.66667C1.99878 7.78482 8.74455 10.8333 10.3205 10.8333C11.8965 10.8333 18.6423 7.78482 18.6423 6.66667C18.6423 5.54852 11.8965 2.5 10.3205 2.5C8.74455 2.5 1.99878 5.54852 1.99878 6.66667Z"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  lessons: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 4h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 8h6M7 11h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  groups: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle
        cx="10"
        cy="5.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M1.5 16c0-2.21 1.119-3.5 2.5-3.5.62 0 1.19.23 1.66.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18.5 16c0-2.21-1.119-3.5-2.5-3.5-.62 0-1.19.23-1.66.62"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 16c0-2.76 1.79-4.5 4-4.5s4 1.74 4 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 8c1.657 0 3 1.343 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 17c0-1.657-.895-3-2-3.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  import: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3v10m0 0-3-3m3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  export: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 13V3m0 0-3 3m3-3 3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 14v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  manageData: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2.75"
        y="3"
        width="14.5"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 8h8M6 12h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  attendance: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="3"
        y="4"
        width="14"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 2v4M13 2v4M3 9h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 13l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  justifications: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 7h6M7 10.5h6M7 14h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  examAbsences: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 9l4 4m0-4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  rattrapages: (
    <svg width="15" height="18" viewBox="0 0 15 18" fill="none">
      <path
        d="M13.3332 10.6545C13.3332 11.0135 13.6242 11.3045 13.9832 11.3045C14.3422 11.3045 14.6332 11.0135 14.6332 10.6545H13.9832H13.3332ZM9.0598 1.56044L8.60008 2.01996V2.01996L9.0598 1.56044ZM13.0069 5.50928L12.5472 5.9688L12.5472 5.9688L13.0069 5.50928ZM8.17866 0.813338L7.89811 1.39967L7.89811 1.39967L8.17866 0.813338ZM8.01422 0.745195L8.23063 0.132277L8.01422 0.745195ZM1.3883 1.89179L0.882198 1.48392L0.882198 1.48392L1.3883 1.89179ZM1.89101 1.38886L1.48292 0.882936L1.48292 0.882936L1.89101 1.38886ZM1.62621 16.3473L2.08593 15.8878H2.08593L1.62621 16.3473ZM13.8564 6.53859L13.2558 6.78724V6.78724L13.8564 6.53859ZM8.7999 1.06699C8.7999 0.708009 8.50889 0.416994 8.1499 0.416994C7.79092 0.416994 7.4999 0.708009 7.4999 1.06699H8.1499H8.7999ZM13.5666 7.13601C13.9256 7.13601 14.2166 6.845 14.2166 6.48601C14.2166 6.12703 13.9256 5.83601 13.5666 5.83601V6.48601V7.13601ZM8.88213 5.75346L9.34185 5.29394H9.34185L8.88213 5.75346ZM5.6405 17.9667C5.99944 17.9719 6.29464 17.6852 6.29983 17.3262C6.30503 16.9673 6.01826 16.6721 5.65931 16.6669L5.6499 17.3168L5.6405 17.9667ZM13.1499 14.8168L13.7313 14.5261C13.6041 14.2718 13.3265 14.1297 13.0458 14.1752C12.7652 14.2207 12.5467 14.4433 12.5065 14.7248L13.1499 14.8168ZM7.31657 13.9835L6.73519 14.2742C6.86234 14.5285 7.13999 14.6706 7.42063 14.6251C7.70127 14.5796 7.91976 14.357 7.96002 14.0755L7.31657 13.9835ZM7.06461 12.0261C6.90407 11.705 6.51363 11.5749 6.19255 11.7354C5.87146 11.896 5.74132 12.2864 5.90186 12.6075L6.48324 12.3168L7.06461 12.0261ZM13.4019 16.7742C13.5624 17.0953 13.9528 17.2254 14.2739 17.0649C14.595 16.9043 14.7252 16.5139 14.5646 16.1928L13.9832 16.4835L13.4019 16.7742ZM12.094 13.1053C12.2994 13.3998 12.7045 13.472 12.999 13.2666C13.2934 13.0612 13.3656 12.6561 13.1602 12.3616L12.6271 12.7335L12.094 13.1053ZM8.37247 15.695C8.16709 15.4005 7.76192 15.3283 7.46748 15.5337C7.17305 15.7391 7.10085 16.1442 7.30623 16.4387L7.83935 16.0668L8.37247 15.695ZM13.9832 7.86733H13.3332V10.6545H13.9832H14.6332V7.86733H13.9832ZM0.649902 10.6545H1.2999V6.86605H0.649902H-9.76324e-05V10.6545H0.649902ZM9.0598 1.56044L8.60008 2.01996L12.5472 5.9688L13.0069 5.50928L13.4666 5.04976L9.51952 1.10092L9.0598 1.56044ZM9.0598 1.56044L9.51952 1.10092C9.13583 0.717067 8.84056 0.40947 8.45922 0.227003L8.17866 0.813338L7.89811 1.39967C8.03184 1.46366 8.1523 1.57198 8.60008 2.01996L9.0598 1.56044ZM6.8631 0.650146V1.30015C7.49638 1.30015 7.65806 1.30877 7.79781 1.35811L8.01422 0.745195L8.23063 0.132277C7.83198 -0.00847709 7.40572 0.000146508 6.8631 0.000146508V0.650146ZM8.17866 0.813338L8.45922 0.227004C8.38476 0.191378 8.30846 0.159757 8.23063 0.132277L8.01422 0.745195L7.79781 1.35811C7.83196 1.37017 7.86544 1.38404 7.89811 1.39967L8.17866 0.813338ZM0.649902 6.86605H1.2999C1.2999 5.49767 1.30094 4.52778 1.38782 3.78334C1.47307 3.05289 1.6334 2.62352 1.8944 2.29967L1.3883 1.89179L0.882198 1.48392C0.404803 2.07628 0.195934 2.78136 0.0965837 3.63264C-0.00113434 4.46994 -9.76324e-05 5.52907 -9.76324e-05 6.86605H0.649902ZM6.8631 0.650146V0.000146508C5.52673 0.000146508 4.468 -0.000891984 3.63101 0.0968754C2.77998 0.196282 2.07509 0.405278 1.48292 0.882936L1.89101 1.38886L2.2991 1.89479C2.62275 1.63373 3.0518 1.47337 3.78183 1.3881C4.52588 1.30118 5.4953 1.30015 6.8631 1.30015V0.650146ZM1.3883 1.89179L1.8944 2.29967C2.01449 2.15066 2.15016 2.01493 2.2991 1.89479L1.89101 1.38886L1.48292 0.882936C1.26183 1.06127 1.06045 1.26274 0.882198 1.48392L1.3883 1.89179ZM0.649902 10.6545H-9.76324e-05C-9.76324e-05 12.2082 -0.00147688 13.4388 0.127732 14.4002C0.259451 15.3804 0.537489 16.1776 1.16649 16.8068L1.62621 16.3473L2.08593 15.8878C1.73863 15.5403 1.52851 15.0632 1.41615 14.2271C1.30128 13.3723 1.2999 12.2449 1.2999 10.6545H0.649902ZM13.9832 7.86733H14.6332C14.6332 7.2388 14.6447 6.74353 14.4569 6.28994L13.8564 6.53859L13.2558 6.78724C13.3217 6.94648 13.3332 7.13276 13.3332 7.86733H13.9832ZM13.0069 5.50928L12.5472 5.9688C13.0664 6.48822 13.1899 6.62803 13.2558 6.78724L13.8564 6.53859L14.4569 6.28994C14.2691 5.83631 13.9109 5.49419 13.4666 5.04976L13.0069 5.50928ZM8.1499 1.06699H7.4999V1.48384H8.1499H8.7999V1.06699H8.1499ZM13.1499 6.48601V7.13601H13.5666V6.48601V5.83601H13.1499V6.48601ZM8.1499 1.48384H7.4999C7.4999 2.6445 7.49852 3.58035 7.59722 4.31479C7.69843 5.06789 7.91545 5.7058 8.42242 6.21298L8.88213 5.75346L9.34185 5.29394C9.11659 5.06858 8.96749 4.75069 8.88564 4.14164C8.80128 3.51392 8.7999 2.68123 8.7999 1.48384H8.1499ZM13.1499 6.48601V5.83601C11.953 5.83601 11.1208 5.83463 10.4934 5.75025C9.88471 5.66838 9.56708 5.51927 9.34185 5.29394L8.88213 5.75346L8.42242 6.21298C8.92942 6.72021 9.56716 6.93737 10.3201 7.03864C11.0543 7.1374 11.9898 7.13601 13.1499 7.13601V6.48601ZM5.6499 17.3168L5.65931 16.6669C3.54787 16.6363 2.65764 16.4598 2.08593 15.8878L1.62621 16.3473L1.16649 16.8068C2.1666 17.8074 3.61932 17.9375 5.6405 17.9667L5.6499 17.3168ZM13.1499 14.8168L12.5065 14.7248C12.3506 15.8146 11.3827 16.6668 10.2332 16.6668V17.3168V17.9668C12.0225 17.9668 13.5449 16.646 13.7934 14.9089L13.1499 14.8168ZM7.31657 13.9835L7.96002 14.0755C8.11591 12.9857 9.08377 12.1335 10.2332 12.1335V11.4835V10.8335C8.44396 10.8335 6.92159 12.1543 6.67312 13.8914L7.31657 13.9835ZM7.31657 13.9835L7.89795 13.6928L7.06461 12.0261L6.48324 12.3168L5.90186 12.6075L6.73519 14.2742L7.31657 13.9835ZM13.9832 16.4835L14.5646 16.1928L13.7313 14.5261L13.1499 14.8168L12.5685 15.1075L13.4019 16.7742L13.9832 16.4835ZM10.2332 11.4835V12.1335C11.0029 12.1335 11.6833 12.5165 12.094 13.1053L12.6271 12.7335L13.1602 12.3616C12.5168 11.4392 11.4458 10.8335 10.2332 10.8335V11.4835ZM10.2332 17.3168V16.6668C9.46352 16.6668 8.78318 16.2838 8.37247 15.695L7.83935 16.0668L7.30623 16.4387C7.94964 17.3611 9.02065 17.9668 10.2332 17.9668V17.3168Z"
        fill="#16151C"
        fillOpacity="0.8"
      />
    </svg>
  ),
  statistics: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 15l4-5 4 3 5-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 17h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  notifications: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5A5.5 5.5 0 0 0 4.5 8v3.5L3 13h14l-1.5-1.5V8A5.5 5.5 0 0 0 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 13v.5a2 2 0 0 0 4 0V13"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M8.98324 11.0161C10.3639 11.0161 11.4832 9.89685 11.4832 8.51614C11.4832 7.13543 10.3639 6.01614 8.98324 6.01614C7.60252 6.01614 6.48324 7.13543 6.48324 8.51614C6.48324 9.89685 7.60252 11.0161 8.98324 11.0161Z"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.649902 9.24947V7.78281C0.649902 6.91614 1.35824 6.19948 2.23324 6.19948C3.74157 6.19948 4.35824 5.13281 3.5999 3.82448C3.16657 3.07448 3.4249 2.09947 4.18324 1.66614L5.6249 0.841142C6.28324 0.449475 7.13324 0.682808 7.5249 1.34114L7.61657 1.49947C8.36657 2.80781 9.5999 2.80781 10.3582 1.49947L10.4499 1.34114C10.8416 0.682808 11.6916 0.449475 12.3499 0.841142L13.7916 1.66614C14.5499 2.09947 14.8082 3.07448 14.3749 3.82448C13.6166 5.13281 14.2332 6.19948 15.7416 6.19948C16.6082 6.19948 17.3249 6.90781 17.3249 7.78281V9.24947C17.3249 10.1161 16.6166 10.8328 15.7416 10.8328C14.2332 10.8328 13.6166 11.8995 14.3749 13.2078C14.8082 13.9661 14.5499 14.9328 13.7916 15.3661L12.3499 16.1911C11.6916 16.5828 10.8416 16.3495 10.4499 15.6911L10.3582 15.5328C9.60824 14.2245 8.3749 14.2245 7.61657 15.5328L7.5249 15.6911C7.13324 16.3495 6.28324 16.5828 5.6249 16.1911L4.18324 15.3661C3.4249 14.9328 3.16657 13.9578 3.5999 13.2078C4.35824 11.8995 3.74157 10.8328 2.23324 10.8328C1.35824 10.8328 0.649902 10.1161 0.649902 9.24947Z"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="1.3"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  help: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7.5 8c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5c0 1.5-1.5 2-2.5 2.5V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14" r="0.75" fill="currentColor" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 10H8m9 0-2.5-2.5M17 10l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  chevron: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// ── Nav data ─────────────────────────────────────────────────────────────────
const ADMIN_SECTIONS = [
  {
    title: "Main",
    links: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Students", href: "/admin/students/", icon: "students" },
      { label: "Teachers", href: "/admin/teachers", icon: "teachers" },
      { label: "Groups", href: "/admin/groups", icon: "groups" },
    ],
  },
  {
    title: "Attendance",
    links: [
      { label: "Attendance", href: "/admin/absences", icon: "attendance" },
      {
        label: "Justifications",
        href: "/admin/justifications",
        icon: "justifications",
      },
      {
        label: "Exam Absences",
        href: "/admin/absences/exam",
        icon: "examAbsences",
      },
      { label: "Rattrapages", href: "/admin/rattrapages", icon: "rattrapages" },
    ],
  },
  {
    title: "System",
    links: [
      {
        label: "Notifications",
        href: "/admin/notifications",
        icon: "notifications",
      },
      { label: "Settings", href: "/admin/settings", icon: "settings" },
      {
        label: "Manage data",
        icon: "manageData",
        children: [
          { label: "Import / Export", href: "/admin/import" },
          { label: "Import history", href: "/admin/import/history" },
          { label: "Salles and Amphis", href: "/admin/salles-amphis" },
        ],
      },
    ],
  },
];

const ADMIN_BOTTOM_LINKS = [
  { label: "Help", href: "/admin/help", icon: "help" },
];

const TEACHER_SECTIONS = [
  {
    title: "Main",
    links: [
      { label: "Dashboard", href: "/teacher", icon: "dashboard" },
      { label: "My Lessons", href: "/teacher/sessions", icon: "lessons" },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { role, clearAuth } = useAuthStore();
  const [expandedMenus, setExpandedMenus] = useState({});

  const sections = role === ROLES.ADMIN ? ADMIN_SECTIONS : TEACHER_SECTIONS;
  const bottomLinks = role === ROLES.ADMIN ? ADMIN_BOTTOM_LINKS : [];

  const normalizePath = useCallback((path = "") => {
    if (!path) return "/";
    const normalized = path.replace(/\/+$/, "");
    return normalized === "" ? "/" : normalized;
  }, []);

  const isActive = useCallback(
    (href) => {
      const [targetPath, targetQuery] = href.split("?");
      const normalizedPathname = normalizePath(pathname);
      const normalizedTargetPath = normalizePath(targetPath);

      if (!targetQuery) {
        return normalizedTargetPath === "/admin" ||
          normalizedTargetPath === "/teacher"
          ? normalizedPathname === normalizedTargetPath
          : normalizedPathname.startsWith(normalizedTargetPath);
      }

      if (normalizedPathname !== normalizedTargetPath) return false;

      const targetParams = new URLSearchParams(targetQuery);
      for (const [key, value] of targetParams.entries()) {
        if (searchParams.get(key) !== value) return false;
      }

      return true;
    },
    [normalizePath, pathname, searchParams],
  );

  useEffect(() => {
    setExpandedMenus((prev) => {
      const next = { ...prev };

      sections.forEach((section) => {
        section.links.forEach((link) => {
          if (!Array.isArray(link.children)) return;

          const menuKey = `${section.title}-${link.label}`;
          const hasActiveChild = link.children.some((child) =>
            isActive(child.href),
          );

          if (typeof next[menuKey] === "undefined") {
            next[menuKey] = hasActiveChild;
          } else if (hasActiveChild) {
            next[menuKey] = true;
          }
        });
      });

      return next;
    });
  }, [isActive, pathname, sections]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo flex items-center justify-center">
        <Image
          width={220}
          height={80}
          src="/sideBarLogo.svg"
          alt="Sidebar Logo"
        />
      </div>

      {/* Nav sections */}
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <p className="sidebar-section-title">{section.title}</p>
            {section.links.map((link) => {
              const menuKey = `${section.title}-${link.label}`;
              const hasChildren =
                Array.isArray(link.children) && link.children.length > 0;

              if (hasChildren) {
                const hasActiveChild = link.children.some((child) =>
                  isActive(child.href),
                );
                const isExpanded = !!expandedMenus[menuKey];

                return (
                  <div key={menuKey} className="sidebar-submenu-group">
                    <button
                      type="button"
                      className={`sidebar-link sidebar-link-button${hasActiveChild ? " active" : ""}`}
                      onClick={() =>
                        setExpandedMenus((prev) => ({
                          ...prev,
                          [menuKey]: !prev[menuKey],
                        }))
                      }
                    >
                      <span className="sidebar-link-icon">
                        {icons[link.icon]}
                      </span>
                      <span className="sidebar-link-label">{link.label}</span>
                      <span
                        className={`sidebar-link-chevron${
                          isExpanded ? " sidebar-link-chevron-rotated" : ""
                        }`}
                      >
                        {icons.chevron}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="sidebar-sublinks">
                        {link.children.map((child) => (
                          <Link
                            key={`${menuKey}-${child.href}`}
                            href={child.href}
                            className={`sidebar-sublink${isActive(child.href) ? " active" : ""}`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const active = isActive(link.href);

              return (
                <Link
                  key={`${section.title}-${link.href}-${link.label}`}
                  href={link.href}
                  className={`sidebar-link${active ? " active" : ""}`}
                >
                  <span className="sidebar-link-icon">{icons[link.icon]}</span>
                  <span className="sidebar-link-label">{link.label}</span>
                  <span className="sidebar-link-chevron">{icons.chevron}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom links (Help, etc.) */}
      {bottomLinks.length > 0 && (
        <div className="sidebar-bottom-links">
          {bottomLinks.map((link) => (
            <Link
              key={`bottom-${link.href}-${link.label}`}
              href={link.href}
              className={`sidebar-link${isActive(link.href) ? " active" : ""}`}
            >
              <span className="sidebar-link-icon">{icons[link.icon]}</span>
              <span className="sidebar-link-label">{link.label}</span>
              <span className="sidebar-link-chevron">{icons.chevron}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout} className="sidebar-logout">
        <span className="sidebar-link-icon">{icons.logout}</span>
        <span className="sidebar-link-label">Logout</span>
      </button>
    </aside>
  );
}
