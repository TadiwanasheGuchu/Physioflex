import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Phone, Heart, Calendar } from "lucide-react";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    no_show: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function AdminPatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = createAdminClient() as any;

  const [{ data: patient }, { data: appointments }, { data: invoices }, { data: progressLogs }] = await Promise.all([
    db.from("patients").select("*").eq("id", id).single(),
    db
      .from("appointments")
      .select("id, starts_at, ends_at, status, reference, notes, therapists(first_name, last_name), services(name, duration_min, price_nad)")
      .eq("patient_id", id)
      .order("starts_at", { ascending: false }),
    db
      .from("invoices")
      .select("id, number, amount_nad, status, created_at, paid_at")
      .eq("patient_id", id)
      .order("created_at", { ascending: false }),
    db
      .from("progress_logs")
      .select("id, date, pain_score, notes")
      .eq("patient_id", id)
      .order("date", { ascending: false })
      .limit(10),
  ]);

  if (!patient) notFound();

  const totalSessions = (appointments ?? []).filter((a: any) => a.status === "completed").length;
  const totalRevenue = (invoices ?? [])
    .filter((i: any) => i.status === "paid")
    .reduce((s: number, i: any) => s + i.amount_nad, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/patients" className="inline-flex items-center gap-1.5 text-sm text-[#6b7a99] hover:text-[#0d253d] mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Patients
        </Link>
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>
          {patient.first_name} {patient.last_name}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <div className="w-14 h-14 rounded-full bg-[#0d9488]/10 flex items-center justify-center mb-4">
              <User className="w-7 h-7 text-[#0d9488]" />
            </div>
            <h2 className="font-semibold text-[#0d253d]">{patient.first_name} {patient.last_name}</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[#6b7a99]">
                <Phone className="w-4 h-4 shrink-0" />
                {patient.phone ?? "No phone"}
              </div>
              <div className="flex items-center gap-2 text-[#6b7a99]">
                <Heart className="w-4 h-4 shrink-0" />
                {patient.medical_aid_name ?? "Self-pay"}
              </div>
              {patient.date_of_birth && (
                <div className="flex items-center gap-2 text-[#6b7a99]">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {new Date(patient.date_of_birth).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <h3 className="text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-3">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#6b7a99]">Total sessions</span>
                <span className="text-sm font-semibold text-[#0d253d]">{totalSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6b7a99]">Total revenue</span>
                <span className="text-sm font-semibold text-[#0d253d]">N${totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6b7a99]">Member since</span>
                <span className="text-sm text-[#0d253d]">
                  {new Date(patient.created_at).toLocaleDateString("en-ZA", { month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm">
            <div className="px-5 py-4 border-b border-[#e3e8ee]">
              <h2 className="text-sm font-semibold text-[#0d253d]">Appointment History</h2>
            </div>
            {(!appointments || appointments.length === 0) ? (
              <p className="px-5 py-8 text-sm text-[#6b7a99] text-center">No appointments yet.</p>
            ) : (
              <div className="divide-y divide-[#e3e8ee]">
                {appointments.map((a: any) => {
                  const dt = new Date(a.starts_at);
                  return (
                    <div key={a.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#0d253d]">
                          {dt.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })} at {dt.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false })}
                        </p>
                        <p className="text-xs text-[#6b7a99]">
                          {a.services?.name} · {a.therapists?.first_name} {a.therapists?.last_name}
                        </p>
                      </div>
                      <StatusBadge status={a.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm">
            <div className="px-5 py-4 border-b border-[#e3e8ee]">
              <h2 className="text-sm font-semibold text-[#0d253d]">Invoices</h2>
            </div>
            {(!invoices || invoices.length === 0) ? (
              <p className="px-5 py-8 text-sm text-[#6b7a99] text-center">No invoices yet.</p>
            ) : (
              <div className="divide-y divide-[#e3e8ee]">
                {invoices.map((inv: any) => (
                  <div key={inv.id} className="px-5 py-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#0d253d]">Invoice #{inv.number}</p>
                      <p className="text-xs text-[#6b7a99]">
                        {new Date(inv.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#0d253d]">N${inv.amount_nad.toLocaleString()}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        inv.status === "paid"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress notes */}
          {progressLogs && progressLogs.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm">
              <div className="px-5 py-4 border-b border-[#e3e8ee]">
                <h2 className="text-sm font-semibold text-[#0d253d]">Recent Progress Logs</h2>
              </div>
              <div className="divide-y divide-[#e3e8ee]">
                {progressLogs.map((log: any) => (
                  <div key={log.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-[#0d253d]">
                        {new Date(log.date).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                      </p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${i < log.pain_score ? "bg-red-400" : "bg-gray-200"}`}
                          />
                        ))}
                        <span className="text-xs text-[#6b7a99] ml-1">{log.pain_score}/10</span>
                      </div>
                    </div>
                    {log.notes && <p className="text-xs text-[#6b7a99]">{log.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
