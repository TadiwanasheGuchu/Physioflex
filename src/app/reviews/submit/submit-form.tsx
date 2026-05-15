"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  token: string;
  serviceName: string;
}

export function SubmitForm({ token, serviceName }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [body, setBody] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setErrorMsg("Please select a star rating."); return; }
    if (!consent) { setErrorMsg("Please confirm consent to display your review."); return; }

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, rating, review_body: body, display_name: displayName, suburb, consent }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="bg-white rounded-2xl border border-[#e3e8ee] p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-lg font-semibold text-[#0d253d] mb-2">Thank you for your review!</h2>
        <p className="text-sm text-[#6b7a99] mb-4">
          Your feedback has been received and will appear on our website once reviewed by our team.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
        >
          Back to Physioflex
        </a>
      </div>
    );
  }

  const displayStars = hovered || rating;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e3e8ee] p-6 sm:p-8 shadow-sm space-y-5">
      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-[#0d253d] mb-3">
          Your rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`w-9 h-9 transition-colors ${n <= displayStars ? "text-[#f59e0b] fill-[#f59e0b]" : "text-gray-300 fill-gray-200"}`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-xs text-[#6b7a99] mt-1.5">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </p>
        )}
      </div>

      {/* Review text */}
      <div>
        <label className="block text-sm font-medium text-[#0d253d] mb-1.5">
          Your review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={20}
          maxLength={500}
          rows={4}
          placeholder="Tell us about your experience — what helped you most, how you felt throughout treatment…"
          className="w-full px-3 py-2.5 text-sm border border-[#e3e8ee] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] resize-none"
        />
        <p className="text-right text-xs text-[#6b7a99] mt-1">{body.length}/500</p>
      </div>

      {/* Name + suburb */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#0d253d] mb-1.5">
            Display name <span className="text-red-500">*</span>
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="e.g. Sarah M."
            className="w-full px-3 py-2.5 text-sm border border-[#e3e8ee] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0d253d] mb-1.5">Suburb (optional)</label>
          <input
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            placeholder="e.g. Swakopmund"
            className="w-full px-3 py-2.5 text-sm border border-[#e3e8ee] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
          />
        </div>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-[#0d9488] shrink-0"
        />
        <span className="text-xs text-[#6b7a99] leading-relaxed">
          I agree my review may be displayed on the Physioflex website. My full name will not be shown — only the display name I entered above.
        </span>
      </label>

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "loading" ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
