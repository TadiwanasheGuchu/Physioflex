import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Missing CAPTCHA token." }, { status: 400 });
  }

  const ok = await verifyTurnstile(token);
  if (!ok) {
    return NextResponse.json({ error: "CAPTCHA verification failed. Please try again." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
