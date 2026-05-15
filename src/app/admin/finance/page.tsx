import { createClient } from "@/lib/supabase/server";
import { FinanceDashboard } from "./finance-dashboard";

export default async function AdminFinancePage() {
  const supabase = await createClient();
  const db = supabase as any;

  // Fetch last 6 months of invoices
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [{ data: invoices }, { data: patients }] = await Promise.all([
    db
      .from("invoices")
      .select("id, number, amount_nad, status, created_at, paid_at, patients(first_name, last_name), appointment_id")
      .gte("created_at", sixMonthsAgo.toISOString())
      .order("created_at", { ascending: false }),
    db.from("patients").select("id, first_name, last_name, medical_aid_name"),
  ]);

  const patientMap: Record<string, any> = {};
  for (const p of patients ?? []) patientMap[p.id] = p;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>Finance</h1>
        <p className="text-sm text-[#6b7a99] mt-1">Revenue overview — last 6 months</p>
      </div>
      <FinanceDashboard invoices={invoices ?? []} patientMap={patientMap} />
    </div>
  );
}
