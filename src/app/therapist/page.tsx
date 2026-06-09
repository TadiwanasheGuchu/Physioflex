import { createClient } from "@/lib/supabase/server";
import { Calendar, Users, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-NA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-[#f0fdf9] text-[#0d9488] border-[#0d9488]/20",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
    completed: "bg-[#f6f9fc] text-[#64748d] border-[#e3e8ee]",
  };
  const labels: Record<string, string> = {
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    completed: "Completed",
  };
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full border ${styles[status] ?? "bg-[#f6f9fc] text-[#64748d] border-[#e3e8ee]"}`}
      style={{ fontWeight: 400 }}
    >
      {labels[status] ?? status}
    </span>
  );
}

export default async function TherapistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get therapist record
  const { data: therapistRaw } = await supabase
    .from("therapists")
    .select("id, first_name")
    .eq("user_id", user!.id)
    .maybeSingle();
  const therapist = therapistRaw as { id: string; first_name: string } | null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
  const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7).toISOString();

  let todayAppts: any[] = [];
  let upcomingAppts: any[] = [];
  let completedCount = 0;
  let uniquePatientCount = 0;

  if (therapist) {
    const [todayRes, upcomingRes, completedRes, patientsRes] = await Promise.all([
      // Today's appointments
      supabase
        .from("appointments")
        .select("id, starts_at, status, reference, patients(first_name, last_name), services(name)")
        .eq("therapist_id", therapist.id)
        .gte("starts_at", todayStart)
        .lt("starts_at", todayEnd)
        .neq("status", "cancelled")
        .order("starts_at"),
      // Upcoming this week (excluding today)
      supabase
        .from("appointments")
        .select("id, starts_at, status, patients(first_name, last_name), services(name)")
        .eq("therapist_id", therapist.id)
        .gte("starts_at", todayEnd)
        .lt("starts_at", weekEnd)
        .neq("status", "cancelled")
        .order("starts_at")
        .limit(5),
      // Completed sessions total
      supabase
        .from("appointments")
        .select("id")
        .eq("therapist_id", therapist.id)
        .eq("status", "completed"),
      // Unique patients — inner join so only appointments with a readable patient record are counted
      supabase
        .from("appointments")
        .select("patient_id, patients!inner(id)")
        .eq("therapist_id", therapist.id)
        .neq("status", "cancelled"),
    ]);

    todayAppts = (todayRes.data ?? []) as any[];
    upcomingAppts = (upcomingRes.data ?? []) as any[];
    completedCount = (completedRes.data ?? []).length;

    const allPatients = (patientsRes.data ?? []) as { patient_id: string }[];
    uniquePatientCount = new Set(allPatients.map((r) => r.patient_id)).size;
  }

  const greeting = therapist?.first_name ? `Good day, ${therapist.first_name}` : "Good day";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d] mb-1" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          {greeting}
        </h1>
        <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
          {new Date().toLocaleDateString("en-NA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>Today</p>
          </div>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>{todayAppts.length}</p>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
            {todayAppts.length === 1 ? "appointment" : "appointments"}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>This Week</p>
          </div>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>{todayAppts.length + upcomingAppts.length}</p>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>upcoming</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>Completed</p>
          </div>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>{completedCount}</p>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>sessions total</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-[#0d9488]" />
            <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>Patients</p>
          </div>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>{uniquePatientCount}</p>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>total seen</p>
        </div>
      </div>

      {/* Today's schedule */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-[#0d253d]" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
            Today's Schedule
          </h2>
          <Link href="/therapist/schedule" className="text-xs text-[#0d9488] hover:underline">
            Full schedule →
          </Link>
        </div>

        {todayAppts.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e3e8ee] p-8 text-center" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
            <Calendar className="w-8 h-8 text-[#e3e8ee] mx-auto mb-3" />
            <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppts.map((a: any) => {
              const patient = a.patients as { first_name: string; last_name: string } | null;
              return (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-[#e3e8ee] p-4 flex items-center justify-between gap-4"
                  style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-center shrink-0 w-14">
                      <p className="text-sm text-[#0d9488]" style={{ fontWeight: 400 }}>{formatTime(a.starts_at)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#0d253d] truncate" style={{ fontWeight: 400 }}>
                        {patient ? `${patient.first_name} ${patient.last_name}` : "Guest"}
                      </p>
                      <p className="text-xs text-[#64748d] truncate" style={{ fontWeight: 300 }}>
                        {a.services?.name ?? "Appointment"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Coming up this week */}
      {upcomingAppts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base text-[#0d253d] mb-4" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
            Coming Up This Week
          </h2>
          <div className="space-y-3">
            {upcomingAppts.map((a: any) => {
              const patient = a.patients as { first_name: string; last_name: string } | null;
              return (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-[#e3e8ee] p-4 flex items-center justify-between gap-4"
                  style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0 w-20">
                      <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>{formatDate(a.starts_at)}</p>
                      <p className="text-sm text-[#0d9488]" style={{ fontWeight: 400 }}>{formatTime(a.starts_at)}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#0d253d] truncate" style={{ fontWeight: 400 }}>
                        {patient ? `${patient.first_name} ${patient.last_name}` : "Guest"}
                      </p>
                      <p className="text-xs text-[#64748d] truncate" style={{ fontWeight: 300 }}>
                        {a.services?.name ?? "Appointment"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick links */}
      <section>
        <h2 className="text-base text-[#0d253d] mb-4" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/therapist/schedule", label: "Full Schedule", sub: "View all appointments" },
            { href: "/therapist/patients", label: "My Patients", sub: "View patient list" },
            { href: "/therapist/messages", label: "Messages", sub: "Check patient messages" },
          ].map(({ href, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-xl border border-[#e3e8ee] p-4 flex items-center justify-between hover:border-[#0d9488] transition-colors group"
              style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
            >
              <div>
                <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>{label}</p>
                <p className="text-xs text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>{sub}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#64748d] group-hover:text-[#0d9488] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {!therapist && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800" style={{ fontWeight: 300 }}>
          Your therapist profile hasn't been linked to this account yet. Contact an admin to connect your record.
        </div>
      )}
    </div>
  );
}
