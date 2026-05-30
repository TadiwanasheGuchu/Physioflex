import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "Our Physiotherapy Team",
  description:
    "Meet the registered physiotherapists at Physioflex Swakopmund. Expert, caring practitioners committed to your recovery.",
  alternates: { canonical: "https://physioflex.na/team" },
  openGraph: { url: "https://physioflex.na/team" },
};

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Team"
          headline="The people behind your recovery"
          subtext="Our registered team brings expertise, care, and a genuine commitment to your wellbeing. Every therapist at Physioflex is registered with the Health Professions Councils of Namibia (HPCNA)."
        />

        <section className="bg-[#f6f9fc] py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {team.map((member) => (
                <article
                  key={member.id}
                  className="bg-white rounded-2xl border border-[#e3e8ee] overflow-hidden"
                  style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
                >
                  {/* Photo */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={member.photo}
                      alt={`${member.name} — ${member.title}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-1">
                      <h2
                        className="text-xl text-[#0d253d]"
                        style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
                      >
                        {member.name}
                      </h2>
                      <p className="text-sm text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>
                        {member.title}
                      </p>
                      <p className="text-xs text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
                        {member.hpcnaNumber} · {member.yearsExperience} years experience
                      </p>
                    </div>

                    <div className="border-t border-[#e3e8ee] my-5" />

                    {/* Specialisations */}
                    <div className="mb-3">
                      <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 400 }}>
                        Specialisations
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.specialisations.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: "#ccfbf1", color: "#0f766e", fontWeight: 400 }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-5">
                      <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 400 }}>
                        Languages
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.languages.map((l) => (
                          <span
                            key={l}
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: "#fdf4f0", color: "#9b6829", fontWeight: 400 }}
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-[#e3e8ee] mb-5" />

                    {/* Bio */}
                    <p
                      className="text-sm text-[#64748d] leading-6 mb-6"
                      style={{ fontWeight: 300 }}
                    >
                      {member.bio}
                    </p>

                    {/* CTA */}
                    <Link
                      href="/#booking"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] transition-colors px-5 py-2.5 rounded-full"
                    >
                      Book with {member.name.split(" ")[0]} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#0d253d] py-16 md:py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2
              className="text-3xl md:text-4xl text-white mb-4"
              style={{ fontWeight: 300, letterSpacing: "-0.64px" }}
            >
              Ready to start your recovery?
            </h2>
            <p className="text-[#64748d] mb-8" style={{ fontWeight: 300 }}>
              Our team is ready to assess your condition and build a treatment plan that gets you back to what you love.
            </p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
            >
              Book an Appointment
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
