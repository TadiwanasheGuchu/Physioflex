import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { sendAppointmentReminder } from "@/lib/notifications";

// Vercel Cron: runs every hour
// vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 * * * *" }] }

export async function GET(request: NextRequest) {
  // Verify request is from Vercel Cron (or our secret for local testing)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient() as any;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physioflex.na";

  const now = new Date();

  // Find appointments starting in 23–25 hours (24h reminder window)
  const window24Start = new Date(now.getTime() + 23 * 3600_000).toISOString();
  const window24End = new Date(now.getTime() + 25 * 3600_000).toISOString();

  // Find appointments starting in 1.5–2.5 hours (2h reminder window)
  const window2Start = new Date(now.getTime() + 90 * 60_000).toISOString();
  const window2End = new Date(now.getTime() + 150 * 60_000).toISOString();

  const [res24, res2] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        "id, starts_at, reference, status, " +
        "patients(first_name, last_name, whatsapp, user_id), " +
        "services(name), " +
        "therapists(first_name, last_name)"
      )
      .gte("starts_at", window24Start)
      .lte("starts_at", window24End)
      .in("status", ["confirmed", "pending"]),
    supabase
      .from("appointments")
      .select(
        "id, starts_at, reference, status, " +
        "patients(first_name, last_name, whatsapp, user_id), " +
        "services(name), " +
        "therapists(first_name, last_name)"
      )
      .gte("starts_at", window2Start)
      .lte("starts_at", window2End)
      .in("status", ["confirmed", "pending"]),
  ]);

  const sent = { "24h": 0, "2h": 0, errors: 0 };

  async function processAppointment(appt: any, hoursUntil: 24 | 2) {
    try {
      const patient = appt.patients as any;
      const service = appt.services as any;
      const therapist = appt.therapists as any;

      if (!patient) return;

      // Get patient email from auth
      const { data: authUser } = await supabase.auth.admin.getUserById(patient.user_id);
      const email = authUser?.user?.email;
      if (!email) return;

      const startsAt = new Date(appt.starts_at);

      await sendAppointmentReminder({
        patientName: `${patient.first_name} ${patient.last_name}`,
        patientEmail: email,
        patientWhatsapp: patient.whatsapp || null,
        reference: appt.reference,
        serviceName: service?.name ?? "Physiotherapy Session",
        therapistName: therapist
          ? `${therapist.first_name} ${therapist.last_name}`
          : "Your Therapist",
        date: startsAt.toLocaleDateString("en-NA", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        time: startsAt.toLocaleTimeString("en-NA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        hoursUntil,
        siteUrl,
      });
    } catch (err) {
      console.error(`[cron/reminders] failed for ${appt.reference}:`, err);
      sent.errors++;
    }
  }

  await Promise.all([
    ...(res24.data ?? []).map(async (a: any) => {
      await processAppointment(a, 24);
      sent["24h"]++;
    }),
    ...(res2.data ?? []).map(async (a: any) => {
      await processAppointment(a, 2);
      sent["2h"]++;
    }),
  ]);

  return NextResponse.json({ ok: true, sent });
}
