"use client";

import { useState } from "react";
import { Loader2, ChevronRight, RefreshCw } from "lucide-react";
import Link from "next/link";

const BODY_AREAS = [
  "Neck", "Shoulder", "Elbow / Wrist / Hand", "Upper back",
  "Lower back", "Hip", "Knee", "Ankle / Foot", "Head / Jaw", "Multiple areas",
];

const DURATIONS = [
  "Just started (today)", "A few days", "1–4 weeks", "1–3 months", "More than 3 months",
];

const ONSET = ["Sudden injury / accident", "Gradually got worse over time", "Came back after previous injury", "No obvious cause"];

interface Result {
  severity: "low" | "medium" | "high";
  summary: string;
  recommendation: string;
  services: string[];
}

export function SymptomChecker() {
  const [area, setArea] = useState("");
  const [duration, setDuration] = useState("");
  const [onset, setOnset] = useState("");
  const [description, setDescription] = useState("");
  const [painScore, setPainScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [rawAdvice, setRawAdvice] = useState("");

  async function analyse() {
    if (!area || !duration || !description) return;
    setLoading(true);
    setResult(null);
    setRawAdvice("");

    const prompt = `A patient is asking about their symptoms. Here is what they described:

- Body area affected: ${area}
- How long they've had it: ${duration}
- How it started: ${onset || "Not specified"}
- Pain score: ${painScore}/10
- Their description: "${description}"

Please provide:
1. A brief assessment (2-3 sentences) of whether physiotherapy is likely to help
2. What type of physiotherapy service would be most appropriate (choose from: Manual Therapy, Sports Rehabilitation, Pain Management, Post-Surgery Recovery, Dry Needling)
3. Whether they should seek urgent medical attention first (yes/no and brief reason)
4. One practical self-management tip they can try right now

Keep the response warm and reassuring. Format as plain paragraphs, no bullet points or headers.`;

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok || !res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setRawAdvice(full);
      }
    } catch {
      setRawAdvice("Sorry, I couldn't analyse your symptoms right now. Please call us or book an assessment directly.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setArea(""); setDuration(""); setOnset(""); setDescription("");
    setPainScore(0); setResult(null); setRawAdvice("");
  }

  const canSubmit = area && duration && description.length >= 20 && !loading;

  return (
    <div className="space-y-5">
      {!rawAdvice ? (
        <>
          {/* Body area */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <label className="block text-sm font-semibold text-[#0d253d] mb-3">
              Which area of your body is affected? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BODY_AREAS.map((a) => (
                <button
                  key={a}
                  onClick={() => setArea(a)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    area === a
                      ? "bg-[#0d9488] text-white border-[#0d9488]"
                      : "border-[#e3e8ee] text-[#0d253d] hover:border-[#0d9488] hover:text-[#0d9488]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <label className="block text-sm font-semibold text-[#0d253d] mb-3">
              How long have you had this? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    duration === d
                      ? "bg-[#0d9488] text-white border-[#0d9488]"
                      : "border-[#e3e8ee] text-[#0d253d] hover:border-[#0d9488] hover:text-[#0d9488]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Onset */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <label className="block text-sm font-semibold text-[#0d253d] mb-3">How did it start?</label>
            <div className="flex flex-wrap gap-2">
              {ONSET.map((o) => (
                <button
                  key={o}
                  onClick={() => setOnset(onset === o ? "" : o)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    onset === o
                      ? "bg-[#0d9488] text-white border-[#0d9488]"
                      : "border-[#e3e8ee] text-[#0d253d] hover:border-[#0d9488] hover:text-[#0d9488]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Pain score */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <label className="block text-sm font-semibold text-[#0d253d] mb-3">
              Pain level: <span className="text-[#0d9488]">{painScore}/10</span>
            </label>
            <input
              type="range" min={0} max={10} value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              className="w-full accent-[#0d9488]"
            />
            <div className="flex justify-between text-xs text-[#6b7a99] mt-1">
              <span>0 — No pain</span>
              <span>10 — Worst imaginable</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <label className="block text-sm font-semibold text-[#0d253d] mb-1.5">
              Describe your symptoms <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-[#6b7a99] mb-2">What does it feel like? When is it worse? What makes it better?</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              minLength={20}
              placeholder="e.g. Sharp pain in my lower back when I bend forward, especially in the morning. Sitting for long periods makes it worse. Started after moving furniture last week."
              className="w-full px-3 py-2.5 text-sm border border-[#e3e8ee] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] resize-none"
            />
            <p className="text-right text-xs text-[#6b7a99] mt-1">{description.length} chars (min 20)</p>
          </div>

          <button
            onClick={analyse}
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-full bg-[#0d9488] text-white font-medium text-sm hover:bg-[#0f766e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</> : <>Analyse my symptoms <ChevronRight className="w-4 h-4" /></>}
          </button>
        </>
      ) : (
        /* Result */
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0d9488]/10 flex items-center justify-center">
                <span className="text-lg">🩺</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0d253d]">AI Assessment</p>
                <p className="text-xs text-[#6b7a99]">{area} · {duration} · Pain {painScore}/10</p>
              </div>
            </div>
            <div className="text-sm text-[#64748d] leading-7 whitespace-pre-wrap" style={{ fontWeight: 300 }}>
              {rawAdvice || <span className="flex items-center gap-2 text-[#6b7a99]"><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</span>}
            </div>
          </div>

          {rawAdvice && (
            <div className="bg-[#0d253d] rounded-xl p-6 text-center">
              <p className="text-white text-sm mb-4" style={{ fontWeight: 300 }}>
                Ready to get a proper assessment from one of our physiotherapists?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/book"
                  className="px-5 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
                >
                  Book an Appointment
                </Link>
                <button
                  onClick={reset}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white/70 text-sm hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Check another symptom
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
