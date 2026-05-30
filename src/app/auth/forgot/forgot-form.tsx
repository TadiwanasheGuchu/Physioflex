"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/reset`,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#f0fdfa] flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-sm text-[#0d253d]" style={{ fontWeight: 300 }}>
          Reset link sent.
        </p>
        <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
          Check <strong>{email}</strong> for the password reset link.
        </p>
      </div>
    );
  }

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
          className="w-full px-4 py-3 text-sm text-[#0d253d] placeholder:text-[#64748d] bg-white border border-[#a8c3de] rounded-lg focus:outline-none focus:border-[#0d9488] transition-colors"
          style={{ fontWeight: 300 }}
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
