import { createClient } from "@/lib/supabase/server";
import { Users } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TherapistPatientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: therapistRaw } = await supabase
    .from("therapists")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();
  const therapist = therapistRaw as { id: string } | null;

  type PatientRow = {
    patient_id: string;
    starts_at: string;
    status: string;
    patients: { first_name: string; last_name: string; phone: string | null; created_at: string } | null;
  };

  let rows: PatientRow[] = [];

  if (therapist) {
    const { data } = await supabase
      .from("appointments")
      .select("patient_id, starts_at, status, patients(first_name, last_name, phone, created_at)")
      .eq("therapist_id", therapist.id)
      .neq("status", "cancelled")
      .order("starts_at", { ascending: false });
    rows = (data ?? []) as PatientRow[];
  }

  // Aggregate by patient_id
  const patientMap = new Map<string, {
    name: string;
    phone: string | null;
    sessions: number;
    lastSeen: string;
  }>();

  for (const row of rows) {
    if (!row.patient_id || !row.patients) continue;
    const existing = patientMap.get(row.patient_id);
    if (!existing) {
      patientMap.set(row.patient_id, {
        name: `${row.patients.first_name} ${row.patients.last_name}`,
        phone: row.patients.phone,
        sessions: 1,
        lastSeen: row.starts_at,
      });
    } else {
      existing.sessions += 1;
      // rows are ordered descending so first seen = most recent
    }
  }

  const patients = Array.from(patientMap.values()).sort((a, b) =>
    b.lastSeen.localeCompare(a.lastSeen)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          My Patients
        </h1>
        <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
          {patients.length} patient{patients.length !== 1 ? "s" : ""} seen
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-12 text-center" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <Users className="w-8 h-8 text-[#e3e8ee] mx-auto mb-3" />
          <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>No patients yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e3e8ee] bg-white" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc]">
                {["Patient", "Contact", "Sessions", "Last Appointment"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-[#64748d]" style={{ fontWeight: 400 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8ee]">
              {patients.map((p, i) => (
                <tr key={i} className="hover:bg-[#f6f9fc] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#e3e8ee] flex items-center justify-center shrink-0">
                        <span className="text-xs text-[#64748d]" style={{ fontWeight: 500 }}>
                          {p.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-[#0d253d]" style={{ fontWeight: 400 }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                    {p.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-[#f0fdf9] text-[#0d9488] border border-[#0d9488]/20 px-2.5 py-0.5 rounded-full" style={{ fontWeight: 400 }}>
                      {p.sessions} session{p.sessions !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                    {formatDate(p.lastSeen)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
