import { createClient } from "@/lib/supabase/server";
import { Activity } from "lucide-react";
import { RecoverySuggestions } from "./recovery-suggestions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ProgressPage() {
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

  let sessions: any[] = [];

  if (patient) {
    const { data: appointments } = await supabase
      .from("appointments")
      .select("id, starts_at, ends_at, status, notes, services(name, duration_min), therapists(first_name, last_name, title)")
      .eq("patient_id", patient.id)
      .order("starts_at", { ascending: false })
      .limit(10);
    sessions = (appointments ?? []) as any[];
  }
  const completed = sessions.filter((s) => s.status === "completed");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          Progress
        </h1>
        <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
          Your treatment timeline and session history
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 300 }}>Sessions Completed</p>
          <p className="text-3xl text-[#0d253d]" style={{ fontWeight: 300 }}>{completed.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 300 }}>Total Sessions</p>
          <p className="text-3xl text-[#0d253d]" style={{ fontWeight: 300 }}>{sessions.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5 col-span-2 sm:col-span-1" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 300 }}>Total Time</p>
          <p className="text-3xl text-[#0d253d]" style={{ fontWeight: 300 }}>
            {Math.round(
              completed.reduce((acc: number, s: any) => acc + (s.services?.duration_min ?? 0), 0) / 60
            )}
            <span className="text-base text-[#64748d] ml-1" style={{ fontWeight: 300 }}>hrs</span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8">
        <h2 className="text-base text-[#0d253d] mb-5" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Session Timeline
        </h2>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e3e8ee] p-8 text-center">
            <Activity className="w-8 h-8 text-[#e3e8ee] mx-auto mb-3" />
            <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
              No sessions recorded yet. Your treatment history will appear here.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[#e3e8ee]" />
            <div className="space-y-4">
              {sessions.map((s: any, i: number) => (
                <div key={s.id} className="relative pl-10">
                  <div
                    className={`absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 ${
                      s.status === "completed"
                        ? "bg-[#0d9488] border-[#0d9488]"
                        : s.status === "cancelled"
                        ? "bg-red-300 border-red-300"
                        : "bg-white border-[#0d9488]"
                    }`}
                  />
                  <div
                    className="bg-white rounded-xl border border-[#e3e8ee] p-4"
                    style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
                          {s.services?.name ?? "Session"}
                        </p>
                        <p className="text-xs text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>
                          {formatDate(s.starts_at)}
                          {s.services?.duration_min ? ` · ${s.services.duration_min} min` : ""}
                        </p>
                        {s.therapists && (
                          <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                            {s.therapists.title} {s.therapists.first_name} {s.therapists.last_name}
                          </p>
                        )}
                        {s.notes && (
                          <p className="text-xs text-[#64748d] mt-2 italic" style={{ fontWeight: 300 }}>
                            &ldquo;{s.notes}&rdquo;
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                          s.status === "completed"
                            ? "bg-[#f0fdf9] text-[#0d9488] border-[#0d9488]/20"
                            : s.status === "cancelled"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                        style={{ fontWeight: 400 }}
                      >
                        {s.status === "completed"
                          ? "Done"
                          : s.status === "cancelled"
                          ? "Cancelled"
                          : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Recovery Suggestions */}
      <RecoverySuggestions
        sessionCount={completed.length}
        recentServices={[...new Set(completed.slice(0, 5).map((s: any) => s.services?.name).filter(Boolean))]}
      />
    </div>
  );
}
