import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "ref required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: appointmentRaw, error } = await supabase
    .from("appointments")
    .select(
      "id, reference, starts_at, ends_at, status, services(name, duration_min), therapists(first_name, last_name, title)"
    )
    .eq("reference", ref.toUpperCase())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!appointmentRaw) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ appointment: appointmentRaw });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }

  if (status !== "cancelled") {
    return NextResponse.json({ error: "Only cancellation is supported." }, { status: 400 });
  }

  // Verify the appointment belongs to this user's patient record (if logged in)
  let patientId: string | null = null;
  if (user) {
    const { data: patient } = await supabase
      .from("patients")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (patient) {
      patientId = (patient as { id: string }).id;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  let updateQuery = db
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", id)
    .in("status", ["pending", "confirmed"]);

  if (patientId) {
    updateQuery = updateQuery.eq("patient_id", patientId);
  }

  const { error } = await updateQuery;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
