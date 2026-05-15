import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { sendInvoiceEmail } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("[webhook/payment] signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const appointmentId = pi.metadata?.appointmentId;
    const reference = pi.metadata?.reference;
    const amountNAD = pi.amount / 100;

    if (!appointmentId) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createAdminClient() as any;

    // Fetch appointment details for invoice
    const { data: appt } = await supabase
      .from("appointments")
      .select("id, patient_id, therapist_id, service_id, starts_at, services(name, price_nad), therapists(first_name, last_name), patients(first_name, last_name, whatsapp, user_id)")
      .eq("id", appointmentId)
      .single();

    if (appt) {
      // Create invoice record
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      await supabase.from("invoices").insert({
        patient_id: appt.patients?.id ?? appt.patient_id,
        appointment_id: appointmentId,
        number: invoiceNumber,
        amount_nad: amountNAD,
        status: "paid",
        paid_at: new Date().toISOString(),
      });

      // Update appointment status if needed
      await supabase
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", appointmentId)
        .eq("status", "pending");

      // Send invoice email
      if (appt.patients?.user_id) {
        const { data: authUser } = await supabase.auth.admin.getUserById(appt.patients.user_id);
        const email = authUser?.user?.email;

        if (email) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physioflex.na";
          await sendInvoiceEmail({
            patientName: `${appt.patients.first_name} ${appt.patients.last_name}`,
            patientEmail: email,
            patientWhatsapp: appt.patients.whatsapp ?? null,
            invoiceNumber,
            serviceName: appt.services?.name ?? "Physiotherapy Session",
            therapistName: appt.therapists
              ? `${appt.therapists.first_name} ${appt.therapists.last_name}`
              : "Your Therapist",
            date: new Date(appt.starts_at).toLocaleDateString("en-NA", {
              day: "numeric", month: "long", year: "numeric",
            }),
            amountNAD,
            status: "paid",
          }).catch(console.error);
        }
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object;
    console.error(`[webhook/payment] payment failed for appointment ${pi.metadata?.appointmentId}`);
  }

  return NextResponse.json({ ok: true });
}
