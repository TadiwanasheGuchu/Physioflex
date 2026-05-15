import type { Metadata } from "next";
import { Star, BadgeCheck } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Patient Reviews",
  description:
    "Read what patients say about Physioflex in Swakopmund. 4.9 stars from 142 verified patient reviews.",
  alternates: { canonical: "https://physioflex.na/reviews" },
  openGraph: { url: "https://physioflex.na/reviews" },
};

const reviews = [
  {
    id: "1",
    displayName: "Sarah M.",
    suburb: "Swakopmund",
    service: "Sports Rehabilitation",
    rating: 5,
    date: "12 May 2026",
    body: "After my knee surgery, Physioflex had me back on the trail in eight weeks. Marco was exceptional — knowledgeable, encouraging, and always pushed me at exactly the right pace. I was genuinely surprised by how quickly I progressed compared to my previous experience at another clinic.",
    verified: true,
  },
  {
    id: "2",
    displayName: "Johan V.",
    suburb: "Swakopmund",
    service: "Post-Surgery Recovery",
    rating: 5,
    date: "28 Apr 2026",
    body: "ACL recovery is tough, but having the right physiotherapy team makes all the difference. The structured programme gave me confidence every step of the way. Twelve months later I'm back competing in cycling — pain free. Worth every session.",
    verified: true,
  },
  {
    id: "3",
    displayName: "Elke B.",
    suburb: "Walvis Bay",
    service: "Pain Management",
    rating: 5,
    date: "15 Apr 2026",
    body: "Chronic lower back pain for three years. I'd resigned myself to living with it. Six sessions with Anri and I finally understand what was causing it and how to manage it. She's thorough, patient, and explains everything clearly. Highly recommend.",
    verified: true,
  },
  {
    id: "4",
    displayName: "Thomas N.",
    suburb: "Swakopmund",
    service: "Manual Therapy",
    rating: 5,
    date: "02 Apr 2026",
    body: "Neck pain that had been bothering me for months cleared up after just four sessions. Liesl's manual therapy skills are outstanding. She also gave me practical desk setup advice that has stopped it coming back. Professional and welcoming clinic.",
    verified: true,
  },
  {
    id: "5",
    displayName: "Petrina K.",
    suburb: "Arandis",
    service: "Sports Rehabilitation",
    rating: 5,
    date: "18 Mar 2026",
    body: "Drove from Arandis for treatment and it was absolutely worth it. Marco worked with me on my hamstring strain and had a tailored return-to-sport plan ready from the first session. The staff are friendly and the clinic is immaculate.",
    verified: true,
  },
  {
    id: "6",
    displayName: "Gerhard H.",
    suburb: "Swakopmund",
    service: "Pain Management",
    rating: 4,
    date: "05 Mar 2026",
    body: "Very professional service and knowledgeable team. My shoulder pain has improved significantly. Only reason I haven't given 5 stars is that parking can be tricky during peak hours. The treatment itself was excellent.",
    verified: true,
  },
  {
    id: "7",
    displayName: "Anna S.",
    suburb: "Swakopmund",
    service: "Manual Therapy",
    rating: 5,
    date: "22 Feb 2026",
    body: "I was sceptical about physiotherapy after bad experiences elsewhere, but Physioflex completely changed my mind. Liesl took time to actually understand my history before treating me. The dry needling for my trapezius tension was a game changer.",
    verified: true,
  },
  {
    id: "8",
    displayName: "Reinhardt D.",
    suburb: "Swakopmund",
    service: "Post-Surgery Recovery",
    rating: 5,
    date: "10 Feb 2026",
    body: "Post hip replacement rehabilitation. David guided me through each phase with precision and genuine care. I hit every milestone ahead of schedule. Couldn't be happier with the outcome — back to gardening and long walks.",
    verified: true,
  },
];

const successStories = [
  {
    id: "1",
    name: "Johan V., 34",
    suburb: "Swakopmund",
    service: "Sports Rehabilitation",
    title: "Back on the Bike After ACL Surgery",
    sessions: 38,
    weeks: 48,
    result: "Returned to competitive cycling, pain-free",
    story:
      "Johan tore his ACL in a mountain biking accident on the Swakopmund trails. Surgery was the only option. He started at Physioflex two weeks post-op, unable to fully straighten his knee and walking with crutches. Marco built a structured 12-month programme that took him through acute recovery, strengthening, return to running, and finally return to sport. Forty-eight weeks later, Johan completed a 60km endurance ride without any knee pain or instability. His return-to-sport test scores were symmetrical to his unaffected leg.",
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
    story:
      "Elke had lived with intermittent but debilitating lower back pain for three years, having seen multiple practitioners without lasting relief. Her initial assessment at Physioflex revealed a combination of lumbar joint restriction, weak deep core muscles, and poor sitting posture from her office work. Anri's treatment combined manual therapy for the joint restriction with a targeted home exercise programme. By session four the acute pain had resolved; by session eight she was completely pain-free and had the tools to manage any recurrence independently.",
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "fill-amber-400 text-amber-400" : "text-[#e3e8ee]"}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Patient Reviews"
          headline="What our patients say"
          subtext="Real feedback from verified patients across Swakopmund and the Erongo Region."
        />

        {/* Rating summary */}
        <section className="bg-white py-12 border-b border-[#e3e8ee]">
          <div className="max-w-3xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={24} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p
                  className="text-5xl text-[#0d253d] mt-2"
                  style={{ fontWeight: 300, letterSpacing: "-0.96px" }}
                >
                  4.9
                </p>
                <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
                  Based on 142 patient reviews
                </p>
              </div>

              <div className="flex-1 w-full space-y-2">
                {[
                  { stars: 5, pct: 89 },
                  { stars: 4, pct: 8 },
                  { stars: 3, pct: 2 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 0 },
                ].map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-xs text-[#64748d] w-4 shrink-0" style={{ fontWeight: 300 }}>
                      {stars}★
                    </span>
                    <div className="flex-1 h-2 bg-[#f0fdfa] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0d9488] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#64748d] w-8 text-right" style={{ fontWeight: 300 }}>
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/#booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
              >
                Book an Appointment
              </Link>
              <a
                href="https://g.page/r/physioflex-swakopmund/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0d9488] text-[#0d9488] text-sm font-medium hover:bg-[#f0fdfa] transition-colors"
              >
                Leave a Google Review
              </a>
            </div>
          </div>
        </section>

        {/* Reviews list */}
        <section className="bg-[#f6f9fc] py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-6 space-y-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-xl border border-[#e3e8ee] p-6"
                style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <StarRow rating={review.rating} />
                    <p
                      className="text-sm text-[#0d253d] mt-1.5"
                      style={{ fontWeight: 400 }}
                    >
                      {review.displayName}
                      <span className="text-[#64748d] font-normal"> — {review.suburb}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {review.verified && (
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "#ccfbf1", color: "#0f766e" }}
                      >
                        <BadgeCheck size={11} />
                        Verified
                      </span>
                    )}
                    <p className="text-xs text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
                      {review.date}
                    </p>
                  </div>
                </div>

                <span
                  className="inline-block text-xs px-2 py-0.5 rounded-full mb-3"
                  style={{ background: "#f0fdfa", color: "#0d9488" }}
                >
                  {review.service}
                </span>

                <p
                  className="text-sm text-[#64748d] leading-6"
                  style={{ fontWeight: 300 }}
                >
                  {review.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-xs font-medium tracking-widest text-[#0d9488] uppercase mb-3">
              Success Stories
            </p>
            <h2
              className="text-3xl md:text-4xl text-[#0d253d] mb-12"
              style={{ fontWeight: 300, letterSpacing: "-0.64px" }}
            >
              Recovery journeys from our patients
            </h2>

            <div className="space-y-8">
              {successStories.map((story) => (
                <article
                  key={story.id}
                  className="bg-[#f6f9fc] rounded-2xl border border-[#e3e8ee] p-8"
                >
                  <span
                    className="inline-block text-xs px-2.5 py-1 rounded-full mb-4"
                    style={{ background: "#ccfbf1", color: "#0f766e" }}
                  >
                    {story.service}
                  </span>
                  <h3
                    className="text-2xl text-[#0d253d] mb-2"
                    style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
                  >
                    {story.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748d] mb-5" style={{ fontWeight: 300 }}>
                    <span>{story.name}</span>
                    <span>{story.sessions} sessions · {story.weeks} weeks</span>
                    <span className="text-[#0d9488]">{story.result}</span>
                  </div>
                  <p
                    className="text-sm text-[#64748d] leading-7"
                    style={{ fontWeight: 300 }}
                  >
                    {story.story}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
