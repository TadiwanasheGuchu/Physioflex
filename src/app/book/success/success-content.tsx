"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, MessageCircle, Home, RefreshCw } from "lucide-react";

function buildICS(ref: string, date: string, time: string, serviceName: string): string {
  const [h, m] = time.split(":").map(Number);
  const start = new Date(`${date}T${time}:00`);
  const end = new Date(start.getTime() + 60 * 60_000); // default 60min

  function fmt(d: Date) {
    return d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Physioflex//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${ref}@physioflex.na`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Physioflex Appointment – ${serviceName}`,
    "LOCATION:Swakopmund, Namibia",
    `DESCRIPTION:Booking reference: ${ref}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadICS(ref: string, date: string, time: string, serviceName: string) {
  const content = buildICS(ref, date, time, serviceName);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `physioflex-${ref}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-NA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timeStr: string) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export function SuccessContent() {
  const params = useSearchParams();
  const ref = params.get("ref") ?? "";
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";
  const service = params.get("service") ?? "Physiotherapy Session";
  const therapist = params.get("therapist") ?? "Your Therapist";

  const waText = encodeURIComponent(
    `Hi Physioflex! My booking reference is ${ref} for ${service} on ${formatDate(date)} at ${formatTime(time)}.`
  );
  const waUrl = `https://wa.me/264811234567?text=${waText}`;

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center gap-2.5 justify-center mb-8">
        <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        <span
          className="text-[#0d253d] text-xl"
          style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
        >
          Physioflex
        </span>
      </div>

      <div
        className="bg-white rounded-2xl border border-[#e3e8ee] p-8 text-center"
        style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px" }}
      >
        {/* Success icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-[#f0fdf9] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#0d9488]" />
          </div>
        </div>

        <h1
          className="text-2xl text-[#0d253d] mb-1"
          style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
        >
          Booking Confirmed
        </h1>
        <p className="text-sm text-[#64748d] mb-6" style={{ fontWeight: 300 }}>
          We look forward to seeing you soon.
        </p>

        {/* Reference badge */}
        <div className="bg-[#f6f9fc] rounded-xl border border-[#e3e8ee] px-5 py-4 mb-6 text-left">
          <p className="text-xs text-[#64748d] mb-1" style={{ fontWeight: 300 }}>
            Booking Reference
          </p>
          <p
            className="text-xl text-[#0d9488] tracking-widest"
            style={{ fontWeight: 500, fontFamily: "monospace" }}
          >
            {ref || "PF-2025-XXXX"}
          </p>
        </div>

        {/* Appointment details */}
        <div className="space-y-3 mb-7 text-left">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f0fdf9] flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-[#0d9488]" />
            </div>
            <div>
              <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                Date &amp; Time
              </p>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                {date ? formatDate(date) : "—"}
              </p>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                {time ? formatTime(time) : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f0fdf9] flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#0d9488] text-xs font-bold">Rx</span>
            </div>
            <div>
              <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                Service
              </p>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                {service}
              </p>
              {therapist && therapist !== "Any Available Therapist" && (
                <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                  with {therapist}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {date && time && (
            <button
              onClick={() => downloadICS(ref, date, time, service)}
              className="w-full flex items-center justify-center gap-2 rounded-full border border-[#0d9488] text-[#0d9488] text-sm py-2.5 hover:bg-[#f0fdf9] transition-colors"
              style={{ fontWeight: 400 }}
            >
              <Calendar className="w-4 h-4" />
              Add to Calendar
            </button>
          )}

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#25d366] text-white text-sm py-2.5 hover:bg-[#1db954] transition-colors"
            style={{ fontWeight: 400 }}
          >
            <MessageCircle className="w-4 h-4" />
            Share via WhatsApp
          </a>
        </div>
      </div>

      {/* Footer links */}
      <div className="flex gap-4 justify-center mt-6">
        <a
          href="/book"
          className="flex items-center gap-1.5 text-sm text-[#64748d] hover:text-[#0d9488] transition-colors"
          style={{ fontWeight: 300 }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Book Another
        </a>
        <span className="text-[#e3e8ee]">|</span>
        <a
          href="/"
          className="flex items-center gap-1.5 text-sm text-[#64748d] hover:text-[#0d9488] transition-colors"
          style={{ fontWeight: 300 }}
        >
          <Home className="w-3.5 h-3.5" />
          Go to Homepage
        </a>
      </div>
    </div>
  );
}
