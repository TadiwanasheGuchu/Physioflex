import { createAdminClient } from "@/lib/supabase/admin";
import { SubmitForm } from "./submit-form";

export const dynamic = "force-dynamic";

function decodeToken(token: string): string | null {
  try {
    return Buffer.from(token, "base64url").toString("utf-8");
  } catch {
    return null;
  }
}

export default async function ReviewSubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const supabase = createAdminClient();
  const db = supabase as any;

  // Fetch active services for the open-review dropdown
  const { data: servicesData } = await db
    .from("services")
    .select("id, name")
    .eq("is_active", true)
    .order("name");
  const services: { id: string; name: string }[] = servicesData ?? [];

  // ── Open review (no token) ──────────────────────────────────────────────────
  if (!token) {
    return (
      <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0d9488]/10 mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0d253d] mb-1">Share your experience</h1>
            <p className="text-sm text-[#6b7a99]">
              Your feedback helps us improve and helps others find the right care.
            </p>
          </div>
          <SubmitForm services={services} />
          <div className="mt-4 text-center">
            <p className="text-xs text-[#6b7a99]">
              You can also{" "}
              <a
                href="https://g.page/r/physioflex/review"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0d9488] hover:underline"
              >
                leave a Google review
              </a>
              {" "}to help other patients find us.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── Token-based review (post-appointment) ──────────────────────────────────
  const appointmentId = decodeToken(token);
  if (!appointmentId) {
    return (
      <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#e3e8ee] p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[#0d253d] mb-2">Link not recognised</h1>
          <p className="text-sm text-[#6b7a99]">This review link is invalid or has expired.</p>
        </div>
      </main>
    );
  }

  const { data: appointment } = await db
    .from("appointments")
    .select("id, status, starts_at, services(name), therapists(first_name, last_name), patients(first_name)")
    .eq("id", appointmentId)
    .single();

  if (!appointment || appointment.status !== "completed") {
    return (
      <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#e3e8ee] p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[#0d253d] mb-2">Not eligible yet</h1>
          <p className="text-sm text-[#6b7a99]">
            Reviews can only be submitted after your appointment is marked complete. If you think this is a mistake, please contact us.
          </p>
        </div>
      </main>
    );
  }

  const { data: existing } = await db
    .from("reviews")
    .select("id")
    .eq("appointment_id", appointmentId)
    .single();

  if (existing) {
    return (
      <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#e3e8ee] p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-xl">✓</span>
          </div>
          <h1 className="text-lg font-semibold text-[#0d253d] mb-2">Review already submitted</h1>
          <p className="text-sm text-[#6b7a99]">Thank you — your review has already been received. We appreciate your feedback!</p>
        </div>
      </main>
    );
  }

  const patientFirstName = appointment.patients?.first_name ?? "";
  const serviceName = appointment.services?.name ?? "";
  const therapistName = appointment.therapists
    ? `${appointment.therapists.first_name} ${appointment.therapists.last_name}`
    : "";

  return (
    <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0d9488]/10 mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0d253d] mb-1">
            How was your session{patientFirstName ? `, ${patientFirstName}` : ""}?
          </h1>
          {serviceName && (
            <p className="text-sm text-[#6b7a99]">
              {serviceName}{therapistName ? ` · ${therapistName}` : ""}
            </p>
          )}
        </div>
        <SubmitForm token={token} serviceName={serviceName} services={[]} />
        <div className="mt-4 text-center">
          <p className="text-xs text-[#6b7a99]">
            You can also{" "}
            <a
              href="https://g.page/r/physioflex/review"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0d9488] hover:underline"
            >
              leave a Google review
            </a>
            {" "}to help other patients find us.
          </p>
        </div>
      </div>
    </main>
  );
}
