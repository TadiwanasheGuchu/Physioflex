"use client";

import { useState } from "react";
import { Search, Calendar, Clock, User, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface AppointmentDetails {
  id: string;
  reference: string;
  starts_at: string;
  ends_at: string;
  status: string;
  services: { name: string; duration_min: number } | null;
  therapists: { first_name: string; last_name: string; title: string } | null;
}

type ViewState = "lookup" | "details" | "cancel-confirm" | "cancelled" | "not-found" | "error";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-NA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "Confirmed", cls: "bg-[#f0fdf9] text-[#0d9488] border-[#0d9488]/20" },
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 border-red-200" },
    completed: { label: "Completed", cls: "bg-[#f6f9fc] text-[#64748d] border-[#e3e8ee]" },
  };
  const s = map[status] ?? { label: status, cls: "bg-[#f6f9fc] text-[#64748d] border-[#e3e8ee]" };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full border ${s.cls}`} style={{ fontWeight: 400 }}>
      {s.label}
    </span>
  );
}

export function ManageBooking() {
  const [reference, setReference] = useState("");
  const [view, setView] = useState<ViewState>("lookup");
  const [appt, setAppt] = useState<AppointmentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!reference.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/manage?ref=${encodeURIComponent(reference.trim())}`);
      if (res.status === 404) {
        setView("not-found");
        return;
      }
      if (!res.ok) {
        setView("error");
        return;
      }
      const data = await res.json();
      setAppt(data.appointment);
      setView("details");
    } catch {
      setView("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!appt) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/manage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appt.id, status: "cancelled" }),
      });
      if (!res.ok) {
        setView("error");
        return;
      }
      setView("cancelled");
    } catch {
      setView("error");
    } finally {
      setCancelling(false);
    }
  }

  const isPast = appt ? new Date(appt.starts_at) < new Date() : false;
  const canCancel = appt?.status === "confirmed" || appt?.status === "pending";

  if (view === "lookup") {
    return (
      <form onSubmit={handleLookup} className="space-y-4">
        <div>
          <label
            htmlFor="ref"
            className="block text-xs text-[#64748d] mb-1.5"
            style={{ fontWeight: 400 }}
          >
            Booking Reference
          </label>
          <input
            id="ref"
            type="text"
            placeholder="PF-2025-XXXX"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            className="w-full rounded-xl border border-[#e3e8ee] bg-white px-4 py-2.5 text-sm text-[#0d253d] placeholder:text-[#b0bec5] outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] transition tracking-widest"
            style={{ fontFamily: "monospace" }}
            required
          />
          <p className="text-xs text-[#64748d] mt-1.5" style={{ fontWeight: 300 }}>
            Your reference was sent in your confirmation email (format: PF-YYYY-XXXX)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !reference.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0d9488] text-white text-sm py-2.5 hover:bg-[#0b7a6f] disabled:opacity-50 transition-colors"
          style={{ fontWeight: 400 }}
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {loading ? "Looking up…" : "Find Booking"}
        </button>
      </form>
    );
  }

  if (view === "not-found") {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <h2 className="text-base text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>
          Booking Not Found
        </h2>
        <p className="text-sm text-[#64748d] mb-5" style={{ fontWeight: 300 }}>
          We couldn't find a booking with reference{" "}
          <span className="font-mono text-[#0d253d]">{reference}</span>. Please check the reference
          and try again.
        </p>
        <button
          onClick={() => { setView("lookup"); setReference(""); }}
          className="rounded-full border border-[#0d9488] text-[#0d9488] text-sm px-6 py-2 hover:bg-[#f0fdf9] transition-colors"
          style={{ fontWeight: 400 }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (view === "error") {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-base text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>
          Something Went Wrong
        </h2>
        <p className="text-sm text-[#64748d] mb-5" style={{ fontWeight: 300 }}>
          Please try again or contact the clinic directly.
        </p>
        <button
          onClick={() => setView("lookup")}
          className="rounded-full border border-[#0d9488] text-[#0d9488] text-sm px-6 py-2 hover:bg-[#f0fdf9] transition-colors"
          style={{ fontWeight: 400 }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (view === "cancelled") {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-[#f0fdf9] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-[#0d9488]" />
        </div>
        <h2 className="text-base text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>
          Booking Cancelled
        </h2>
        <p className="text-sm text-[#64748d] mb-5" style={{ fontWeight: 300 }}>
          Your appointment has been cancelled. We hope to see you again soon.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/book"
            className="rounded-full bg-[#0d9488] text-white text-sm px-6 py-2 hover:bg-[#0b7a6f] transition-colors"
            style={{ fontWeight: 400 }}
          >
            Book Again
          </a>
          <a
            href="/"
            className="rounded-full border border-[#e3e8ee] text-[#64748d] text-sm px-6 py-2 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
            style={{ fontWeight: 400 }}
          >
            Home
          </a>
        </div>
      </div>
    );
  }

  if (view === "cancel-confirm") {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-base text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>
          Cancel Appointment?
        </h2>
        <p className="text-sm text-[#64748d] mb-2" style={{ fontWeight: 300 }}>
          You are about to cancel:
        </p>
        <p className="text-sm text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>
          {appt?.services?.name}
        </p>
        <p className="text-sm text-[#64748d] mb-6" style={{ fontWeight: 300 }}>
          {appt && formatDate(appt.starts_at)} at {appt && formatTime(appt.starts_at)}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-full bg-red-500 text-white text-sm px-6 py-2 hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            style={{ fontWeight: 400 }}
          >
            {cancelling && (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />
            )}
            {cancelling ? "Cancelling…" : "Yes, Cancel"}
          </button>
          <button
            onClick={() => setView("details")}
            className="rounded-full border border-[#e3e8ee] text-[#64748d] text-sm px-6 py-2 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
            style={{ fontWeight: 400 }}
          >
            Keep Booking
          </button>
        </div>
      </div>
    );
  }

  // view === "details"
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-[#0d9488] text-base tracking-widest"
          style={{ fontWeight: 500 }}
        >
          {appt?.reference}
        </span>
        {appt && statusBadge(appt.status)}
      </div>

      <div className="bg-[#f6f9fc] rounded-xl border border-[#e3e8ee] divide-y divide-[#e3e8ee]">
        <div className="flex items-start gap-3 px-4 py-3.5">
          <Calendar className="w-4 h-4 text-[#0d9488] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
              Date
            </p>
            <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
              {appt && formatDate(appt.starts_at)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-4 py-3.5">
          <Clock className="w-4 h-4 text-[#0d9488] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
              Time
            </p>
            <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
              {appt && formatTime(appt.starts_at)} – {appt && formatTime(appt.ends_at)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-4 py-3.5">
          <span className="text-[#0d9488] text-xs font-bold mt-0.5 shrink-0 w-4 text-center">Rx</span>
          <div>
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
              Service
            </p>
            <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
              {appt?.services?.name ?? "—"}
            </p>
          </div>
        </div>
        {appt?.therapists && (
          <div className="flex items-start gap-3 px-4 py-3.5">
            <User className="w-4 h-4 text-[#0d9488] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                Therapist
              </p>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                {appt.therapists.title} {appt.therapists.first_name} {appt.therapists.last_name}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {canCancel && !isPast && (
          <button
            onClick={() => setView("cancel-confirm")}
            className="flex-1 rounded-full border border-red-300 text-red-500 text-sm py-2.5 hover:bg-red-50 transition-colors"
            style={{ fontWeight: 400 }}
          >
            Cancel Booking
          </button>
        )}
        <a
          href="https://wa.me/264811234567"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-[#0d9488] text-white text-sm py-2.5 text-center hover:bg-[#0b7a6f] transition-colors"
          style={{ fontWeight: 400 }}
        >
          Contact Clinic
        </a>
      </div>

      <button
        onClick={() => { setView("lookup"); setReference(""); setAppt(null); }}
        className="w-full text-center text-xs text-[#64748d] hover:text-[#0d9488] transition-colors"
        style={{ fontWeight: 300 }}
      >
        Look up a different booking
      </button>
    </div>
  );
}
