import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BookingWizard } from "./booking-wizard";

export const metadata: Metadata = {
  title: "Book an Appointment | Physioflex",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: services }, { data: therapists }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, description, duration_min")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("therapists")
      .select("id, first_name, last_name, title, specialisations")
      .eq("is_active", true)
      .order("first_name"),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f9fc] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <a href="/" className="inline-flex items-center gap-2.5 justify-center mb-6">
            <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span
              className="text-[#0d253d] text-xl"
              style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
            >
              Physioflex
            </span>
          </a>
          <h1
            className="text-3xl text-[#0d253d] mb-2"
            style={{ fontWeight: 300, letterSpacing: "-0.5px" }}
          >
            Book an Appointment
          </h1>
          <p className="text-[#64748d] text-sm" style={{ fontWeight: 300 }}>
            Expert physiotherapy in Swakopmund, Namibia
          </p>
        </div>

        <BookingWizard
          services={services ?? []}
          therapists={therapists ?? []}
          userEmail={user?.email ?? ""}
          isGuest={!user}
        />
      </div>
    </main>
  );
}
