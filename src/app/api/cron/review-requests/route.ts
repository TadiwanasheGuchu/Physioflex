import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReviewRequest } from "@/lib/notifications";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const db = supabase as any;

  // Find appointments completed ~48h ago (between 47h and 49h ago)
  const now = new Date();
  const from = new Date(now.getTime() - 49 * 60 * 60 * 1000);
  const to = new Date(now.getTime() - 47 * 60 * 60 * 1000);

  const { data: appointments } = await db
    .from("appointments")
    .select("id, patient_id, service_id, ends_at, patients(first_name, last_name, phone, whatsapp), therapists(first_name, last_name), services(name)")
    .eq("status", "completed")
    .gte("ends_at", from.toISOString())
    .lte("ends_at", to.toISOString());

  if (!appointments || appointments.length === 0) {
    return NextResponse.json({ sent: 0, message: "No appointments in window" });
  }

  // Filter out appointments that already have a review
  const apptIds = appointments.map((a: any) => a.id);
  const { data: existingReviews } = await db
    .from("reviews")
    .select("appointment_id")
    .in("appointment_id", apptIds);

  const reviewedIds = new Set((existingReviews ?? []).map((r: any) => r.appointment_id));

  // Get patient emails from auth
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physioflex.na";
  let sent = 0;

  for (const appt of appointments) {
    if (reviewedIds.has(appt.id)) continue;
    if (!appt.patients) continue;

    // Get email from profiles table via patient user_id
    const { data: patient } = await db
      .from("patients")
      .select("user_id")
      .eq("id", appt.patient_id)
      .single();

    let email = "";
    if (patient?.user_id) {
      const { data: profile } = await db
        .from("profiles")
        .select("email")
        .eq("id", patient.user_id)
        .single();
      email = profile?.email ?? "";
    }

    if (!email) continue;

    try {
      await sendReviewRequest({
        patientName: `${appt.patients.first_name}`,
        patientEmail: email,
        patientWhatsapp: appt.patients.whatsapp ?? appt.patients.phone ?? null,
        appointmentId: appt.id,
        serviceName: appt.services?.name ?? "physiotherapy",
        therapistName: appt.therapists
          ? `${appt.therapists.first_name} ${appt.therapists.last_name}`
          : "your therapist",
        siteUrl,
      });
      sent++;
    } catch (err) {
      console.error(`[cron/review-requests] Failed for appt ${appt.id}:`, err);
    }
  }

  return NextResponse.json({ sent, total: appointments.length });
}
