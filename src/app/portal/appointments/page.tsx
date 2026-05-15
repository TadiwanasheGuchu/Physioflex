import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-NA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-[#f0fdf9] text-[#0d9488] border-[#0d9488]/20",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
    completed: "bg-[#f6f9fc] text-[#64748d] border-[#e3e8ee]",
  };
  const label =
    status === "confirmed"
      ? "Confirmed"
      : status === "pending"
      ? "Pending"
      : status === "cancelled"
      ? "Cancelled"
      : status === "completed"
      ? "Completed"
      : status;
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full border ${map[status] ?? "bg-[#f6f9fc] text-[#64748d] border-[#e3e8ee]"}`}
      style={{ fontWeight: 400 }}
    >
      {label}
    </span>
  );
}

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: patientRaw } = await supabase
    .from("patients")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();
  const patient = patientRaw as { id: string } | null;

  const now = new Date().toISOString();

  let upcoming: any[] = [];
  let past: any[] = [];

  if (patient) {
    const [upcomingRes, pastRes] = await Promise.all([
      supabase
        .from("appointments")
        .select("id, reference, starts_at, ends_at, status, notes, services(name, duration_min), therapists(first_name, last_name, title)")
        .eq("patient_id", patient.id)
        .gte("starts_at", now)
        .neq("status", "cancelled")
        .order("starts_at"),
      supabase
        .from("appointments")
        .select("id, reference, starts_at, ends_at, status, services(name, duration_min), therapists(first_name, last_name, title)")
        .eq("patient_id", patient.id)
        .lt("starts_at", now)
        .order("starts_at", { ascending: false })
        .limit(20),
    ]);
    upcoming = (upcomingRes.data ?? []) as any[];
    past = (pastRes.data ?? []) as any[];
  }

  const empty = (label: string) => (
    <div className="bg-white rounded-xl border border-[#e3e8ee] p-8 text-center">
      <Calendar className="w-8 h-8 text-[#e3e8ee] mx-auto mb-3" />
      <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
        {label}
      </p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
            My Appointments
          </h1>
          <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
            View and manage your scheduled sessions
          </p>
        </div>
        <Link
          href="/book"
          className="rounded-full bg-[#0d9488] text-white text-sm px-5 py-2.5 hover:bg-[#0b7a6f] transition-colors hidden sm:inline-flex items-center gap-2"
          style={{ fontWeight: 400 }}
        >
          <Calendar className="w-4 h-4" />
          Book New
        </Link>
      </div>

      {/* Upcoming */}
      <section className="mb-10">
        <h2 className="text-base text-[#0d253d] mb-4" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          empty("No upcoming appointments. Book your next session to get started.")
        ) : (
          <div className="space-y-3">
            {upcoming.map((a: any) => (
              <div
                key={a.id}
                className="bg-white rounded-xl border border-[#e3e8ee] p-5"
                style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                        {a.services?.name}
                      </p>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(a.starts_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(a.starts_at)}
                      </span>
                    </div>
                    {a.therapists && (
                      <p className="text-xs text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
                        {a.therapists.title} {a.therapists.first_name} {a.therapists.last_name}
                      </p>
                    )}
                    {a.reference && (
                      <p className="text-xs text-[#64748d] mt-1 font-mono">{a.reference}</p>
                    )}
                  </div>
                  <div className="flex gap-2 sm:flex-col sm:items-end">
                    <Link
                      href={`/book/manage?ref=${a.reference}`}
                      className="text-xs border border-[#e3e8ee] text-[#64748d] rounded-full px-3 py-1.5 hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
                      style={{ fontWeight: 300 }}
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="text-base text-[#0d253d] mb-4" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Past Appointments
        </h2>
        {past.length === 0 ? (
          empty("No past appointments recorded yet.")
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#e3e8ee] bg-white" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc]">
                  {["Date", "Service", "Therapist", "Duration", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-[#64748d]"
                      style={{ fontWeight: 400 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee]">
                {past.map((a: any) => (
                  <tr key={a.id} className="hover:bg-[#f6f9fc] transition-colors">
                    <td className="px-4 py-3 text-[#0d253d] text-xs whitespace-nowrap" style={{ fontWeight: 300 }}>
                      {formatDate(a.starts_at)}
                    </td>
                    <td className="px-4 py-3 text-[#0d253d] text-xs" style={{ fontWeight: 300 }}>
                      {a.services?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#64748d] text-xs whitespace-nowrap" style={{ fontWeight: 300 }}>
                      {a.therapists
                        ? `${a.therapists.first_name} ${a.therapists.last_name}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#64748d] text-xs" style={{ fontWeight: 300 }}>
                      {a.services?.duration_min ? `${a.services.duration_min} min` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
