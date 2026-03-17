"use client";

import { API_ENDPOINTS } from "@/lib/constants";
import api from "@/services/api";
import Image from "next/image";

export function GoogleOAuthButton() {
  const handleGoogleLogin = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GOOGLE_AUTH);
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error("Google OAuth initiation failed:", error);
      alert("Failed to initiate Google login. Please try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center text-lg w-full bg-[#f9f9f9] border border-gray-200 rounded-lg py-2 mt-4 hover:bg-gray-200 h-14 transition"
    >
      <Image
        width={24}
        height={24}
        src="/google.svg"
        alt="Google"
        className="inline-block mr-2"
      />
      <span className="text-gray-700 font-semibold">
        Sign in with Google Auth
      </span>
    </button>
  );
}
