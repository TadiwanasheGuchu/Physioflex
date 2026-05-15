import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = await request.json();
  const { appointmentId } = body;

  if (!appointmentId) {
    return NextResponse.json({ error: "appointmentId required." }, { status: 400 });
  }

  // Fetch appointment + service price
  const { data: appt } = await supabase
    .from("appointments")
    .select("id, reference, service_id, patient_id, services(name, price_nad)")
    .eq("id", appointmentId)
    .single();

  if (!appt) {
    return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
  }

  const apptData = appt as any;
  const amountNAD: number = apptData.services?.price_nad ?? 0;

  if (amountNAD <= 0) {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
  }

  // Stripe amounts are in smallest currency unit
  // NAD is pegged to ZAR — Stripe uses ZAR (no NAD support)
  // We charge in ZAR (1:1 with NAD)
  const amountCents = Math.round(amountNAD * 100);

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "zar",
    metadata: {
      appointmentId,
      reference: apptData.reference,
      patientUserId: user.id,
    },
    description: `Physioflex — ${apptData.services?.name ?? "Session"} (${apptData.reference})`,
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret, amountNAD });
}
