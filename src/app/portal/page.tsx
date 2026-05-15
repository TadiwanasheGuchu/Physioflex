import { createClient } from "@/lib/supabase/server";
import { Calendar, CheckCircle2, FileText, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-NA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: patientRaw } = await supabase
    .from("patients")
    .select("id, first_name")
    .eq("user_id", user!.id)
    .maybeSingle();
  const patient = patientRaw as { id: string; first_name: string } | null;

  const patientId = patient?.id;

  let nextAppt: any | undefined;
  let completedCount = 0;

  if (patientId) {
    const [upcomingRes, pastRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("id, starts_at, reference, status, services(name), therapists(first_name, last_name)")
        .eq("patient_id", patientId)
        .gte("starts_at", new Date().toISOString())
        .in("status", ["pending", "confirmed"])
        .order("starts_at")
        .limit(1),
      supabase
        .from("appointments")
        .select("id")
        .eq("patient_id", patientId)
        .in("status", ["completed"]),
    ]);
    nextAppt = (upcomingRes.data ?? [])[0] as any;
    completedCount = (pastRes.data ?? []).length;
  }

  const greeting = patient?.first_name
    ? `Welcome back, ${patient.first_name}`
    : "Welcome back";

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-2xl text-[#0d253d] mb-1"
          style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
        >
          {greeting}
        </h1>
        <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
          Your Physioflex patient dashboard
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* Next appointment */}
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>Next Appointment</p>
          </div>
          {nextAppt ? (
            <>
              <p className="text-base text-[#0d253d] leading-tight" style={{ fontWeight: 400 }}>
                {formatDate(nextAppt.starts_at)}, {formatTime(nextAppt.starts_at)}
              </p>
              <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
                {nextAppt.services?.name}
              </p>
            </>
          ) : (
            <>
              <p className="text-base text-[#64748d]" style={{ fontWeight: 300 }}>None scheduled</p>
              <Link href="/book" className="text-xs text-[#0d9488] hover:underline mt-1 inline-block">
                Book now →
              </Link>
            </>
          )}
        </div>

        {/* Sessions completed */}
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>Sessions Completed</p>
          </div>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>{completedCount}</p>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
            {completedCount === 1 ? "session" : "sessions"}
          </p>
        </div>

        {/* Exercise plans */}
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>Exercise Plans</p>
          </div>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>0</p>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>assigned plans</p>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>Messages</p>
          </div>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>0</p>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>unread</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2
          className="text-base text-[#0d253d] mb-4"
          style={{ fontWeight: 400, letterSpacing: "-0.2px" }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/book"
            className="bg-white rounded-xl border border-[#e3e8ee] p-4 flex items-center justify-between hover:border-[#0d9488] transition-colors group"
            style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
          >
            <div>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>Book Appointment</p>
              <p className="text-xs text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>Schedule your next session</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#64748d] group-hover:text-[#0d9488] transition-colors" />
          </Link>

          <Link
            href="/portal/resources"
            className="bg-white rounded-xl border border-[#e3e8ee] p-4 flex items-center justify-between hover:border-[#0d9488] transition-colors group"
            style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
          >
            <div>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>Exercise Plans</p>
              <p className="text-xs text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>View assigned programmes</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#64748d] group-hover:text-[#0d9488] transition-colors" />
          </Link>

          <Link
            href="/portal/messages"
            className="bg-white rounded-xl border border-[#e3e8ee] p-4 flex items-center justify-between hover:border-[#0d9488] transition-colors group"
            style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
          >
            <div>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>Message Therapist</p>
              <p className="text-xs text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>Send a question or update</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#64748d] group-hover:text-[#0d9488] transition-colors" />
          </Link>
        </div>
      </div>

      {/* Upcoming appointments preview */}
      {nextAppt && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base text-[#0d253d]" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
              Upcoming
            </h2>
            <Link href="/portal/appointments" className="text-xs text-[#0d9488] hover:underline">
              View all →
            </Link>
          </div>
          <div
            className="bg-white rounded-xl border border-[#e3e8ee] p-5"
            style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                  {nextAppt.services?.name}
                </p>
                <p className="text-xs text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
                  {formatDate(nextAppt.starts_at)} at {formatTime(nextAppt.starts_at)}
                </p>
                {nextAppt.therapists && (
                  <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                    with {nextAppt.therapists.first_name} {nextAppt.therapists.last_name}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-[#0d9488]/20 bg-[#f0fdf9] text-[#0d9488]" style={{ fontWeight: 400 }}>
                  {nextAppt.status === "confirmed" ? "Confirmed" : "Pending"}
                </span>
                <Link
                  href={`/book/manage`}
                  className="text-xs text-[#64748d] hover:text-[#0d9488] transition-colors"
                  style={{ fontWeight: 300 }}
                >
                  Manage →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {!patientId && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800" style={{ fontWeight: 300 }}>
          Your patient profile has not been created yet. It will be set up automatically when you make your first booking.
        </div>
      )}
    </div>
  );
}
