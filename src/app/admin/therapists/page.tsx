import { createClient } from "@/lib/supabase/server";
import { TherapistsManager } from "./therapists-manager";

export default async function AdminTherapistsPage() {
  const supabase = await createClient();
  const db = supabase as any;

  const [{ data: therapists }, { data: appointments }] = await Promise.all([
    db
      .from("therapists")
      .select("id, first_name, last_name, title, hpcna_number, specialisations, years_experience, is_active, bio")
      .order("first_name"),
    db
      .from("appointments")
      .select("therapist_id, status, starts_at")
      .gte("starts_at", new Date().toISOString())
      .in("status", ["confirmed", "pending"]),
  ]);

  const upcomingMap: Record<string, number> = {};
  for (const a of appointments ?? []) {
    upcomingMap[a.therapist_id] = (upcomingMap[a.therapist_id] ?? 0) + 1;
  }

  const enriched = (therapists ?? []).map((t: any) => ({
    ...t,
    upcoming_count: upcomingMap[t.id] ?? 0,
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>
          Therapists
        </h1>
        <p className="text-sm text-[#6b7a99] mt-1">
          {enriched.length} staff members
        </p>
      </div>
      <TherapistsManager therapists={enriched} />
    </div>
  );
}
