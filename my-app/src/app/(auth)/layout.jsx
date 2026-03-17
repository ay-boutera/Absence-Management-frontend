"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const isForgetPassWord = pathname.includes("forget-password") || pathname.includes("reset-password");
  return (
    <div
      className={`auth-container ${isForgetPassWord ? "flex-row-reverse" : ""}`}
    >
      {/* {left-side image or illustration can go here if needed} */}
      <div className="login-img-container h-max">
        <Image
          className="m-12 my-24"
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
          {!isForgetPassWord ? (
            <>
              <span className="text-[#143888] font-poppins text-5xl font-semibold">
                Welcom to{" "}
              </span>
              <span className="text-[#143888] font-digital text-5xl font-semibold">
                ESI ATTEND
              </span>
            </>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
}
