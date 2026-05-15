import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { sendRecoveryCheckIn } from "@/lib/notifications";

// Vercel Cron: runs daily at 10:00 AM UTC
// vercel.json: { "crons": [{ "path": "/api/cron/recovery", "schedule": "0 10 * * *" }] }

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient() as any;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physioflex.na";
  const now = new Date();

  // Find appointments completed 3 days ago (72h ± 6h window)
  const windowStart = new Date(now.getTime() - 78 * 3600_000).toISOString();
  const windowEnd = new Date(now.getTime() - 66 * 3600_000).toISOString();

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      "id, starts_at, reference, " +
      "patients(first_name, whatsapp, user_id), " +
      "therapists(first_name, last_name)"
    )
    .gte("starts_at", windowStart)
    .lte("starts_at", windowEnd)
    .eq("status", "completed");

  let sent = 0;
  let errors = 0;

  await Promise.all(
    (appointments ?? []).map(async (appt: any) => {
      try {
        const patient = appt.patients as any;
        const therapist = appt.therapists as any;
        if (!patient?.whatsapp) return;

        await sendRecoveryCheckIn({
          patientName: patient.first_name,
          patientWhatsapp: patient.whatsapp,
          therapistName: therapist
            ? `${therapist.first_name} ${therapist.last_name}`
            : "your therapist",
          portalUrl: siteUrl,
        });
        sent++;
      } catch (err) {
        console.error(`[cron/recovery] failed for ${appt.reference}:`, err);
        errors++;
      }
    })
  );

  return NextResponse.json({ ok: true, sent, errors });
}
