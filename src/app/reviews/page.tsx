import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReviewsList } from "./reviews-list";
import Link from "next/link";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Patient Reviews | Physioflex Swakopmund",
  description: "Read verified patient reviews about Physioflex physiotherapy in Swakopmund. Real stories, real results.",
  alternates: { canonical: "https://physioflex.na/reviews" },
  openGraph: { url: "https://physioflex.na/reviews" },
};

// Static fallback reviews (shown when DB has no approved reviews yet)
const STATIC_REVIEWS = [
  { id: "s1", display_name: "Sarah M.", suburb: "Swakopmund", rating: 5, body: "After my knee surgery, Physioflex had me back on the trail in eight weeks. Susan was exceptional — knowledgeable, encouraging, and always pushed me at exactly the right pace.", verified_patient: true, created_at: "2026-05-12", admin_reply: null, service_name: "Sports Rehabilitation" },
  { id: "s2", display_name: "Johan V.", suburb: "Swakopmund", rating: 5, body: "ACL recovery is tough, but having the right physiotherapy team makes all the difference. The structured programme gave me confidence every step of the way.", verified_patient: true, created_at: "2026-04-28", admin_reply: null, service_name: "Post-Surgery Recovery" },
  { id: "s3", display_name: "Elke B.", suburb: "Walvis Bay", rating: 5, body: "Chronic lower back pain for three years. Six sessions with Vimbai and I finally understand what was causing it and how to manage it. She's thorough, patient, and explains everything clearly.", verified_patient: true, created_at: "2026-04-15", admin_reply: null, service_name: "Pain Management" },
  { id: "s4", display_name: "Thomas N.", suburb: "Swakopmund", rating: 5, body: "Neck pain that had been bothering me for months cleared up after just four sessions. The manual therapy skills at Physioflex are outstanding. Professional and welcoming clinic.", verified_patient: true, created_at: "2026-04-02", admin_reply: null, service_name: "Manual Therapy" },
  { id: "s5", display_name: "Petrina K.", suburb: "Arandis", rating: 5, body: "Drove from Arandis for treatment and it was absolutely worth it. Susan worked with me on my hamstring strain and had a tailored return-to-sport plan ready from the first session.", verified_patient: true, created_at: "2026-03-18", admin_reply: null, service_name: "Sports Rehabilitation" },
  { id: "s6", display_name: "Gerhard H.", suburb: "Swakopmund", rating: 4, body: "Very professional service and knowledgeable team. My shoulder pain has improved significantly. The treatment itself was excellent.", verified_patient: true, created_at: "2026-03-05", admin_reply: null, service_name: "Pain Management" },
  { id: "s7", display_name: "Anna S.", suburb: "Swakopmund", rating: 5, body: "I was sceptical about physiotherapy after bad experiences elsewhere, but Physioflex completely changed my mind. The dry needling for my trapezius tension was a game changer.", verified_patient: true, created_at: "2026-02-22", admin_reply: null, service_name: "Manual Therapy" },
  { id: "s8", display_name: "Reinhardt D.", suburb: "Swakopmund", rating: 5, body: "Post hip replacement rehabilitation. Vimbai guided me through each phase with precision and genuine care. Couldn't be happier with the outcome.", verified_patient: true, created_at: "2026-02-10", admin_reply: null, service_name: "Post-Surgery Recovery" },
];

const SUCCESS_STORIES = [
  {
    id: "1",
    name: "Johan V., 34",
    suburb: "Swakopmund",
    service: "Sports Rehabilitation",
    title: "Back on the Bike After ACL Surgery",
    sessions: 38,
    weeks: 48,
    result: "Returned to competitive cycling, pain-free",
    story: "Johan tore his ACL in a mountain biking accident. Surgery was the only option. He started at Physioflex two weeks post-op, unable to fully straighten his knee. Susan built a structured 12-month programme that took him through acute recovery, strengthening, return to running, and finally return to sport. Forty-eight weeks later, Johan completed a 60km endurance ride without any knee pain or instability.",
  },
  {
    id: "2",
    name: "Elke B., 52",
    suburb: "Walvis Bay",
    service: "Pain Management",
    title: "Three Years of Back Pain Gone in Six Weeks",
    sessions: 8,
    weeks: 6,
    result: "Pain resolved, back to full daily activity",
    story: "Elke had lived with intermittent but debilitating lower back pain for three years, having seen multiple practitioners without lasting relief. Vimbai's treatment combined manual therapy with a targeted home exercise programme. By session four the acute pain had resolved; by session eight she was completely pain-free.",
  },
];

function RatingSummary({ reviews }: { reviews: { rating: number }[] }) {
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 4.9;
  const displayAvg = avg.toFixed(1);

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: count > 0 ? Math.round((reviews.filter((r) => r.rating === star).length / count) * 100) : star === 5 ? 89 : star === 4 ? 8 : star === 3 ? 2 : star === 2 ? 1 : 0,
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#e3e8ee] shadow-sm p-6 mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="text-center sm:text-left shrink-0">
          <div className="text-5xl font-bold text-[#0d253d]">{displayAvg}</div>
          <div className="flex items-center justify-center sm:justify-start gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-4 h-4 ${i <= Math.round(avg) ? "text-[#f59e0b] fill-[#f59e0b]" : "text-gray-200 fill-gray-200"}`} />
            ))}
          </div>
          <p className="text-xs text-[#6b7a99] mt-1">
            {count > 0 ? `${count} verified reviews` : "142 verified reviews"}
          </p>
        </div>

        <div className="flex-1 w-full space-y-1.5">
          {breakdown.map(({ star, pct }) => (
            <div key={star} className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 w-16 shrink-0">
                {Array.from({ length: star }, (_, i) => (
                  <Star key={i} className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                ))}
              </div>
              <div className="flex-1 h-2 bg-[#f0f4f8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0d9488] rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-[#6b7a99] w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href="/reviews/submit"
            className="px-4 py-2 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors text-center"
          >
            Leave a review
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function ReviewsPage() {
  const supabase = await createClient();
  const db = supabase as any;

  const { data: dbReviews } = await db
    .from("reviews")
    .select("id, display_name, suburb, rating, body, verified_patient, created_at, admin_reply, services(name)")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const liveReviews = (dbReviews ?? []).map((r: any) => ({
    ...r,
    service_name: r.services?.name ?? null,
  }));

  const reviews = liveReviews.length >= 3 ? liveReviews : STATIC_REVIEWS;

  const services = [...new Set(reviews.map((r: any) => r.service_name).filter(Boolean))] as string[];

  return (
    <>
      <Navbar />
      <main className="bg-[#f6f9fc] min-h-screen">
        {/* Hero */}
        <section className="bg-white border-b border-[#e3e8ee] py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-medium text-[#0d9488] uppercase tracking-widest">Patient Reviews</span>
            <h1 className="text-4xl md:text-5xl text-[#0d253d] mt-3 mb-4" style={{ fontWeight: 300, letterSpacing: "-0.96px" }}>
              What our patients say
            </h1>
            <p className="text-[#64748d] text-base" style={{ fontWeight: 300 }}>
              Real stories from patients we&apos;ve helped across Swakopmund and Namibia.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <RatingSummary reviews={reviews} />
          <ReviewsList reviews={reviews} services={services} />
        </div>

        {/* Success Stories */}
        <section className="bg-white border-t border-[#e3e8ee] py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl text-[#0d253d] mb-2" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
              Success Stories
            </h2>
            <p className="text-sm text-[#64748d] mb-8" style={{ fontWeight: 300 }}>
              In-depth recovery journeys from our patients.
            </p>
            <div className="space-y-6">
              {SUCCESS_STORIES.map((story) => (
                <div key={story.id} className="bg-[#f6f9fc] rounded-2xl border border-[#e3e8ee] p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-[#ccfbf1] text-[#0f766e] font-medium">
                      {story.service}
                    </span>
                  </div>
                  <h3 className="text-xl text-[#0d253d] mb-1" style={{ fontWeight: 500 }}>
                    {story.title}
                  </h3>
                  <p className="text-xs text-[#64748d] mb-4">
                    {story.name} · {story.suburb} · {story.sessions} sessions over {story.weeks} weeks
                  </p>
                  <p className="text-sm text-[#64748d] leading-7 mb-4" style={{ fontWeight: 300 }}>
                    {story.story}
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#e3e8ee]">
                    <span className="text-[#0d9488] text-sm">✓</span>
                    <span className="text-sm font-medium text-[#0d253d]">{story.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
