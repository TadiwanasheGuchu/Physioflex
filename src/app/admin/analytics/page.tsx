import { createAdminClient } from "@/lib/supabase/admin";
import { AnalyticsDashboard } from "./analytics-dashboard";

export default async function AdminAnalyticsPage() {
  const db = createAdminClient() as any;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [{ data: appointments }, { data: services }, { data: therapists }] = await Promise.all([
    db
      .from("appointments")
      .select("id, starts_at, status, service_id, therapist_id, patient_id, services(name)")
      .gte("starts_at", sixMonthsAgo.toISOString())
      .order("starts_at"),
    db.from("services").select("id, name").eq("is_active", true),
    db.from("therapists").select("id, first_name, last_name, is_active").eq("is_active", true),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>Analytics</h1>
        <p className="text-sm text-[#6b7a99] mt-1">Last 6 months — booking patterns and trends</p>
      </div>
      <AnalyticsDashboard
        appointments={appointments ?? []}
        services={services ?? []}
        therapists={therapists ?? []}
      />
    </div>
  );
}
