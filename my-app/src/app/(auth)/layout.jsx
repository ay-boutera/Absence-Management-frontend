"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isForgetPassWord =
    pathname.includes("forget-password") || pathname.includes("reset-password");

  return (
    <div
      className={`auth-container ${isForgetPassWord ? "flex-row-reverse" : ""}`}
    >
      {/* Left side illustration container */}
      <div className="login-img-container h-max">
        <Image
          className="mx-12 my-36"
          src={
            isForgetPassWord
              ? "/forgetPassword-illustration.png"
              : "/login-illustration.png"
          }
          alt={
            isForgetPassWord
              ? "Forget Password Illustration"
              : "Login Illustration"
          }
          width={isForgetPassWord ? 380 : 480}
          height={isForgetPassWord ? 380 : 480}
        />
        <div className="mb-12">
          {!isForgetPassWord && (
            <p className="text-center inline-flex flex-wrap justify-center items-center gap-6">
              <span className="text-[#143888] font-inter text-5xl font-semibold whitespace-nowrap">
                Welcome to{"  "}
              </span>
              <span className="text-[#143888] font-digital text-3xl font-semibold whitespace-nowrap">
                ESI:ATTEND
              </span>
            </p>
          )}
        </div>
      </div>

     
      {children}
    </div>
  );
}
