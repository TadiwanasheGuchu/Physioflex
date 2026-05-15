import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Combines recovery check-ins + review requests into one daily cron
// Runs at 10:00 UTC — stays within Vercel Hobby plan (2 cron jobs max)
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const headers = { authorization: `Bearer ${process.env.CRON_SECRET}` };

  const [recovery, reviews] = await Promise.allSettled([
    fetch(`${baseUrl}/api/cron/recovery`, { headers }),
    fetch(`${baseUrl}/api/cron/review-requests`, { headers }),
  ]);

  return NextResponse.json({
    recovery: recovery.status === "fulfilled" ? await recovery.value.json() : { error: "failed" },
    reviews: reviews.status === "fulfilled" ? await reviews.value.json() : { error: "failed" },
  });
}
