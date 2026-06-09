"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const turnstileRef = useRef<TurnstileInstance>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!captchaToken) {
      setError("Please complete the security check.");
      setLoading(false);
      return;
    }

    // Verify CAPTCHA server-side before auth
    const captchaRes = await fetch("/api/auth/captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: captchaToken }),
    });

    if (!captchaRes.ok) {
      const { error: captchaError } = await captchaRes.json();
      setError(captchaError ?? "Security check failed. Please try again.");
      setCaptchaToken("");
      turnstileRef.current?.reset();
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setCaptchaToken("");
      turnstileRef.current?.reset();
      setLoading(false);
      return;
    }

    if (redirectParam) {
      router.push(redirectParam);
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single<{ role: string }>();
      const dest =
        profile?.role === "admin"
          ? "/admin"
          : profile?.role === "therapist"
          ? "/therapist"
          : "/portal";
      router.push(dest);
    }
    router.refresh();
  }

  const inputClass =
    "w-full px-4 py-3 text-sm text-[#0d253d] placeholder:text-[#64748d] bg-white border border-[#a8c3de] rounded-lg focus:outline-none focus:border-[#0d9488] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
          Email address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
          style={{ fontWeight: 300 }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-[#64748d]" style={{ fontWeight: 400 }}>
            Password
          </label>
          <a
            href="/auth/forgot"
            className="text-xs text-[#0d9488] hover:underline"
            style={{ fontWeight: 300 }}
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`${inputClass} pr-10`}
            style={{ fontWeight: 300 }}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748d] hover:text-[#0d253d] transition-colors"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {SITE_KEY && (
        <div className="flex justify-center">
          <Turnstile
            ref={turnstileRef}
            siteKey={SITE_KEY}
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken("")}
            onError={() => {
              setCaptchaToken("");
              setError("Security check failed. Please refresh and try again.");
            }}
            options={{ theme: "light" }}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || (!!SITE_KEY && !captchaToken)}
        className="w-full py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
