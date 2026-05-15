import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Clinic working hours
const HOURS = {
  weekday: { open: "08:00", close: "17:00" }, // Mon–Fri
  saturday: { open: "08:00", close: "13:00" },
};

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}

function generateSlots(openTime: string, closeTime: string, durationMin: number): string[] {
  const open = timeToMinutes(openTime);
  const close = timeToMinutes(closeTime);
  const slots: string[] = [];
  for (let t = open; t + durationMin <= close; t += 30) {
    slots.push(minutesToTime(t));
  }
  return slots;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const therapistId = searchParams.get("therapistId");
  const date = searchParams.get("date"); // "YYYY-MM-DD"
  const duration = parseInt(searchParams.get("duration") ?? "60", 10);

  if (!date) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const dayOfWeek = new Date(date + "T12:00:00").getDay(); // 0=Sun

  if (dayOfWeek === 0) {
    return NextResponse.json({ slots: [] }); // Closed Sunday
  }

  const hours = dayOfWeek === 6 ? HOURS.saturday : HOURS.weekday;
  const allSlots = generateSlots(hours.open, hours.close, duration);

  // Fetch existing appointments to remove booked slots
  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select("starts_at, ends_at")
    .gte("starts_at", `${date}T00:00:00`)
    .lt("starts_at", `${date}T23:59:59`)
    .in("status", ["pending", "confirmed"]);

  if (therapistId && therapistId !== "any") {
    query = query.eq("therapist_id", therapistId);
  }

  const { data: bookedRaw } = await query;
  const booked = (bookedRaw ?? []) as { starts_at: string; ends_at: string }[];

  const bookedMinutes = booked.map((a) => ({
    start: timeToMinutes(a.starts_at.slice(11, 16)),
    end: timeToMinutes(a.ends_at.slice(11, 16)),
  }));

  const available = allSlots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + duration;
    return !bookedMinutes.some((b) => slotStart < b.end && slotEnd > b.start);
  });

  return NextResponse.json({ slots: available });
}
