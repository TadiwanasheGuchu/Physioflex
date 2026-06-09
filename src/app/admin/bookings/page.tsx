import { createAdminClient } from "@/lib/supabase/admin";
import { BookingsTable } from "./bookings-table";

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; therapist?: string; date?: string }>;
}) {
  const params = await searchParams;
  const db = createAdminClient() as any;

  const [{ data: appointments }, { data: therapists }, { data: services }] = await Promise.all([
    db
      .from("appointments")
      .select("id, starts_at, ends_at, status, reference, notes, patients(id, first_name, last_name, phone), therapists(id, first_name, last_name), services(name, duration_min, price_nad)")
      .order("starts_at", { ascending: false })
      .limit(200),
    db.from("therapists").select("id, first_name, last_name").eq("is_active", true).order("first_name"),
    db.from("services").select("id, name").eq("is_active", true).order("name"),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>
          Bookings
        </h1>
        <p className="text-sm text-[#6b7a99] mt-1">
          Manage all appointments
        </p>
      </div>
      <BookingsTable
        appointments={appointments ?? []}
        therapists={therapists ?? []}
        services={services ?? []}
        defaultStatus={params.status}
        defaultTherapist={params.therapist}
        defaultDate={params.date}
      />
    </div>
  );
}
