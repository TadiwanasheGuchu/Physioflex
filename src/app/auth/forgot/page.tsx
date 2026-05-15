import type { Metadata } from "next";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = {
  title: "Forgot Password | Physioflex",
  robots: { index: false },
};

export default function ForgotPage() {
  return (
    <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <span className="text-[#0d253d] text-xl" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
            Physioflex
          </span>
        </div>

        <div
          className="bg-white rounded-2xl border border-[#e3e8ee] p-8"
          style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px" }}
        >
          <h1
            className="text-2xl text-[#0d253d] mb-1"
            style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
          >
            Reset your password
          </h1>
          <p className="text-sm text-[#64748d] mb-7" style={{ fontWeight: 300 }}>
            Enter your email and we&apos;ll send a reset link.
          </p>
          <ForgotForm />
        </div>

        <p className="text-center text-xs text-[#64748d] mt-5" style={{ fontWeight: 300 }}>
          <a href="/auth/login" className="text-[#0d9488] hover:underline">
            Back to sign in
          </a>
        </p>
      </div>
    </main>
  );
}
