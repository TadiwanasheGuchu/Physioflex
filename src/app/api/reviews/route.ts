import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function decodeToken(token: string): string | null {
  try {
    return Buffer.from(token, "base64url").toString("utf-8");
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, rating, review_body, display_name, suburb, consent, service_id } = body;

    if (!rating || !review_body || !display_name || !consent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (review_body.length < 20 || review_body.length > 500) {
      return NextResponse.json({ error: "Review must be between 20 and 500 characters" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const db = supabase as any;

    // Token-based flow: verified post-appointment review
    if (token) {
      const appointmentId = decodeToken(token);
      if (!appointmentId) {
        return NextResponse.json({ error: "Invalid review link" }, { status: 400 });
      }

      const { data: appointment } = await db
        .from("appointments")
        .select("id, patient_id, service_id, status")
        .eq("id", appointmentId)
        .single();

      if (!appointment || appointment.status !== "completed") {
        return NextResponse.json({ error: "Invalid or ineligible appointment" }, { status: 400 });
      }

      const { data: existing } = await db
        .from("reviews")
        .select("id")
        .eq("appointment_id", appointmentId)
        .single();

      if (existing) {
        return NextResponse.json({ error: "A review has already been submitted for this appointment" }, { status: 409 });
      }

      const { error } = await db.from("reviews").insert({
        patient_id: appointment.patient_id ?? null,
        appointment_id: appointmentId,
        service_id: appointment.service_id ?? null,
        display_name: display_name.trim(),
        suburb: suburb?.trim() ?? null,
        rating,
        body: review_body.trim(),
        status: "pending",
        verified_patient: true,
        admin_reply: null,
        admin_replied_at: null,
      });

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Open flow: general review without appointment token
    const { error } = await db.from("reviews").insert({
      patient_id: null,
      appointment_id: null,
      service_id: service_id ?? null,
      display_name: display_name.trim(),
      suburb: suburb?.trim() ?? null,
      rating,
      body: review_body.trim(),
      status: "pending",
      verified_patient: false,
      admin_reply: null,
      admin_replied_at: null,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Review submission error:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
