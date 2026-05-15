import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmation } from "@/lib/notifications";

function makeReference() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PF-${year}-${rand}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to book an appointment." }, { status: 401 });
  }

  const body = await request.json();
  const { serviceId, therapistId, date, time, patient } = body;

  if (!serviceId || !date || !time || !patient?.firstName) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Get service duration
  const { data: service } = await supabase
    .from("services")
    .select("duration_min, price_nad")
    .eq("id", serviceId)
    .single();

  if (!service) {
    return NextResponse.json({ error: "Service not found." }, { status: 400 });
  }

  // Resolve therapist — pick first active if "any"
  let resolvedTherapistId = therapistId;
  if (!therapistId || therapistId === "any") {
    const { data: therapists } = await supabase
      .from("therapists")
      .select("id")
      .eq("is_active", true)
      .limit(1);
    const therapistList = therapists as { id: string }[] | null;
    if (!therapistList?.length) {
      return NextResponse.json({ error: "No therapists available." }, { status: 400 });
    }
    resolvedTherapistId = therapistList[0].id;
  }

  // Calculate times
  const serviceData = service as { duration_min: number; price_nad: number };
  const startsAt = new Date(`${date}T${time}:00`);
  const endsAt = new Date(startsAt.getTime() + serviceData.duration_min * 60_000);

  // Find or create patient record
  const { data: existingPatient } = await supabase
    .from("patients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let patientId: string;

  if (existingPatient) {
    patientId = (existingPatient as { id: string }).id;
  } else {
    const { data: newPatient, error: patientError } = await supabase
      .from("patients")
      .insert({
        user_id: user.id,
        first_name: patient.firstName,
        last_name: patient.lastName,
        phone: patient.phone || null,
        whatsapp: patient.whatsapp || null,
        medical_aid_name: patient.medicalAidName || null,
        medical_aid_number: patient.medicalAidNumber || null,
      } as any)
      .select("id")
      .single();

    if (patientError) {
      return NextResponse.json({ error: patientError.message }, { status: 400 });
    }
    patientId = (newPatient as { id: string }).id;
  }

  // Create appointment
  const reference = makeReference();
  const { data: appointment, error: apptError } = await supabase
    .from("appointments")
    .insert({
      patient_id: patientId,
      therapist_id: resolvedTherapistId,
      service_id: serviceId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "confirmed",
      notes: patient.notes || null,
      reference,
    } as any)
    .select("id, reference")
    .single();

  if (apptError) {
    return NextResponse.json({ error: apptError.message }, { status: 400 });
  }

  const appt = appointment as { id: string; reference: string };

  // Send confirmation notification (fire-and-forget — don't block response)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physioflex.na";
  const therapistData = therapistId && therapistId !== "any"
    ? await supabase.from("therapists").select("first_name, last_name").eq("id", resolvedTherapistId).maybeSingle()
    : null;
  const therapistName = therapistData?.data
    ? `${(therapistData.data as any).first_name} ${(therapistData.data as any).last_name}`
    : "Your Therapist";

  sendBookingConfirmation({
    patientName: `${patient.firstName} ${patient.lastName}`,
    patientEmail: user.email ?? "",
    patientWhatsapp: patient.whatsapp || null,
    reference: appt.reference,
    serviceName: (service as any)?.name ?? "Physiotherapy Session",
    therapistName,
    date: startsAt.toLocaleDateString("en-NA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    time: startsAt.toLocaleTimeString("en-NA", { hour: "2-digit", minute: "2-digit", hour12: true }),
    siteUrl,
  }).catch((err) => console.error("[booking] notification error:", err));

  return NextResponse.json({
    reference: appt.reference,
    id: appt.id,
    startsAt: startsAt.toISOString(),
  });
}
