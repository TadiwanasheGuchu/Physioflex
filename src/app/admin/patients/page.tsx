import { createClient } from "@/lib/supabase/server";
import { PatientsTable } from "./patients-table";

export default async function AdminPatientsPage() {
  const supabase = await createClient();
  const db = supabase as any;

  const { data: patients } = await db
    .from("patients")
    .select("id, first_name, last_name, phone, medical_aid_name, created_at, user_id")
    .order("created_at", { ascending: false });

  // Get last appointment per patient
  const { data: lastAppts } = await db
    .from("appointments")
    .select("patient_id, starts_at, status")
    .in("status", ["completed", "confirmed"])
    .order("starts_at", { ascending: false });

  const lastVisitMap: Record<string, string> = {};
  const sessionCountMap: Record<string, number> = {};
  for (const a of lastAppts ?? []) {
    if (!lastVisitMap[a.patient_id]) lastVisitMap[a.patient_id] = a.starts_at;
    sessionCountMap[a.patient_id] = (sessionCountMap[a.patient_id] ?? 0) + 1;
  }

  const enriched = (patients ?? []).map((p: any) => ({
    ...p,
    last_visit: lastVisitMap[p.id] ?? null,
    session_count: sessionCountMap[p.id] ?? 0,
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>
          Patients
        </h1>
        <p className="text-sm text-[#6b7a99] mt-1">
          {enriched.length} registered patients
        </p>
      </div>
      <PatientsTable patients={enriched} />
    </div>
  );
}
