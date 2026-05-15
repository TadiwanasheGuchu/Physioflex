import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmation } from "@/lib/notifications";

function makeReference() {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PF-${year}-${rand}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { serviceId, therapistId, date, time, patient, isGuest } = body;

  // Guests must provide email; logged-in users use their account email
  if (isGuest && !patient?.email) {
    return NextResponse.json({ error: "Email is required for guest bookings." }, { status: 400 });
  }
  if (!isGuest && !user) {
    return NextResponse.json({ error: "Sign in to book an appointment." }, { status: 401 });
  }

  if (!serviceId || !date || !time || !patient?.firstName) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Get service duration
  const { data: service } = await admin
    .from("services")
    .select("duration_min, price_nad, name")
    .eq("id", serviceId)
    .single();

  if (!service) {
    return NextResponse.json({ error: "Service not found." }, { status: 400 });
  }

  // Resolve therapist — pick first active if "any"
  let resolvedTherapistId = therapistId;
  if (!therapistId || therapistId === "any") {
    const { data: therapists } = await admin
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
  const serviceData = service as { duration_min: number; price_nad: number; name: string };
  const startsAt = new Date(`${date}T${time}:00`);
  const endsAt = new Date(startsAt.getTime() + serviceData.duration_min * 60_000);

  // Find or create patient record
  let patientId: string;

  if (isGuest) {
    // Guest: always create a new patient row (no user_id)
    const { data: newPatient, error: patientError } = await admin
      .from("patients")
      .insert({
        user_id: null,
        first_name: patient.firstName,
        last_name: patient.lastName,
        email: patient.email,
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
  } else {
    // Logged-in: find or create by user_id
    const { data: existingPatient } = await admin
      .from("patients")
      .select("id")
      .eq("user_id", user!.id)
      .maybeSingle();

    if (existingPatient) {
      patientId = (existingPatient as { id: string }).id;
    } else {
      const { data: newPatient, error: patientError } = await admin
        .from("patients")
        .insert({
          user_id: user!.id,
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
  }

  // Create appointment
  const reference = makeReference();
  const { data: appointment, error: apptError } = await admin
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

  // Send confirmation notification (fire-and-forget)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://physioflex.na";
  const therapistData = resolvedTherapistId
    ? await admin.from("therapists").select("first_name, last_name").eq("id", resolvedTherapistId).maybeSingle()
    : null;
  const therapistName = therapistData?.data
    ? `${(therapistData.data as any).first_name} ${(therapistData.data as any).last_name}`
    : "Your Therapist";

  const confirmationEmail = isGuest ? patient.email : (user?.email ?? "");

  sendBookingConfirmation({
    patientName: `${patient.firstName} ${patient.lastName}`,
    patientEmail: confirmationEmail,
    patientWhatsapp: patient.whatsapp || null,
    reference: appt.reference,
    serviceName: serviceData.name,
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
