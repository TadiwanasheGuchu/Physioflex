"use client";

import { useState } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";

interface Props {
  sessionCount: number;
  recentServices: string[];
}

export function RecoverySuggestions({ sessionCount, recentServices }: Props) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setLoading(true);
    setAdvice("");

    try {
      const res = await fetch("/api/ai/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionCount, recentServices }),
      });

      if (!res.ok || !res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setAdvice(full);
      }
      setLoaded(true);
    } catch {
      setAdvice("Unable to generate suggestions right now. Please try again later.");
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base text-[#0d253d]" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          AI Recovery Tips
        </h2>
        {loaded && (
          <button
            onClick={() => { setLoaded(false); setAdvice(""); load(); }}
            className="text-xs text-[#6b7a99] hover:text-[#0d9488] flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        )}
      </div>

      {!loaded ? (
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-[#0d9488]/10 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-[#0d9488]" />
          </div>
          <p className="text-sm text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>Personalised recovery tips</p>
          <p className="text-xs text-[#6b7a99] mb-4">
            Get AI-generated home exercises and recovery advice based on your treatment history.
          </p>
          <button
            onClick={load}
            disabled={loading || sessionCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</> : <><Sparkles className="w-3.5 h-3.5" /> Get my tips</>}
          </button>
          {sessionCount === 0 && (
            <p className="text-xs text-[#6b7a99] mt-2">Complete your first session to unlock personalised tips.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#0d9488]" />
            <span className="text-xs font-medium text-[#0d9488]">Personalised for your treatment</span>
          </div>
          <div className="text-sm text-[#64748d] leading-7 whitespace-pre-wrap" style={{ fontWeight: 300 }}>
            {advice || <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Generating…</span>}
          </div>
          <p className="text-xs text-[#6b7a99] mt-4 pt-4 border-t border-[#e3e8ee]">
            ⚠ These are general suggestions. Always follow your physiotherapist&apos;s specific instructions.
          </p>
        </div>
      )}
    </div>
  );
}
