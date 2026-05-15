import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In | Physioflex",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
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
            Welcome back
          </h1>
          <p className="text-sm text-[#64748d] mb-7" style={{ fontWeight: 300 }}>
            Sign in to your Physioflex account
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-[#64748d] mt-5" style={{ fontWeight: 300 }}>
          Don&apos;t have an account?{" "}
          <a href="/auth/register" className="text-[#0d9488] hover:underline">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
