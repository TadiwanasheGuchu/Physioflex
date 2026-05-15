import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { conditions, categoryMeta } from "@/lib/conditions-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const condition = conditions.find((c) => c.id === slug);
  if (!condition) return {};
  return {
    title: `${condition.name} Treatment in Swakopmund`,
    description: `Physioflex treats ${condition.name} in Swakopmund, Namibia. ${condition.description} Book with our registered physiotherapists today.`,
    alternates: { canonical: `https://physioflex.na/conditions/${condition.id}` },
    openGraph: {
      title: `${condition.name} Treatment in Swakopmund | Physioflex`,
      description: `Physioflex treats ${condition.name} in Swakopmund, Namibia. ${condition.description}`,
      url: `https://physioflex.na/conditions/${condition.id}`,
    },
  };
}

export default async function ConditionPage({ params }: Props) {
  const { slug } = await params;
  const condition = conditions.find((c) => c.id === slug);
  if (!condition) notFound();

  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: condition.name,
    description: condition.description,
    possibleTreatment: {
      "@type": "MedicalTherapy",
      name: "Physiotherapy",
      provider: {
        "@type": "PhysicalTherapist",
        name: "Physioflex",
        url: "https://physioflex.na",
      },
    },
    relevantSpecialty: {
      "@type": "MedicalSpecialty",
      name: "Physical Therapy",
    },
  };

  const meta = categoryMeta[condition.category];
  const related = conditions.filter((c) => c.category === condition.category && c.id !== condition.id).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-white pt-24 pb-12 md:pt-32 md:pb-16">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
            aria-hidden
            style={{
              background: "linear-gradient(135deg, #f5e9d4 0%, #ccfbf1 25%, #e0e7ff 50%, #0d9488 75%, #fce7f3 100%)",
              filter: "blur(48px)",
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6">
            <Link
              href="/conditions"
              className="inline-flex items-center gap-1.5 text-sm text-[#64748d] hover:text-[#0d253d] transition-colors mb-8"
              style={{ fontWeight: 300 }}
            >
              <ArrowLeft size={14} />
              All conditions
            </Link>

            <span
              className="inline-block text-xs px-2.5 py-1 rounded-full mb-4"
              style={{ background: meta.bg, color: meta.text, fontWeight: 400 }}
            >
              {meta.label}
            </span>

            <h1
              className="text-4xl md:text-5xl text-[#0d253d] mb-4"
              style={{ fontWeight: 300, letterSpacing: "-0.96px" }}
            >
              {condition.name}
            </h1>
            <p
              className="text-base text-[#64748d] leading-7"
              style={{ fontWeight: 300 }}
            >
              {condition.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-[#f6f9fc] py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-6 space-y-10">

            {/* Symptoms */}
            <div className="bg-white rounded-xl border border-[#e3e8ee] p-8" style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
              <h2
                className="text-xl text-[#0d253d] mb-5"
                style={{ fontWeight: 300, letterSpacing: "-0.22px" }}
              >
                Common symptoms
              </h2>
              <ul className="space-y-3">
                {condition.symptoms.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0d9488]" />
                    <span
                      className="text-sm text-[#64748d] leading-6"
                      style={{ fontWeight: 300 }}
                    >
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment */}
            <div className="bg-white rounded-xl border border-[#e3e8ee] p-8" style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
              <h2
                className="text-xl text-[#0d253d] mb-4"
                style={{ fontWeight: 300, letterSpacing: "-0.22px" }}
              >
                Our treatment approach
              </h2>
              <p
                className="text-sm text-[#64748d] leading-7"
                style={{ fontWeight: 300 }}
              >
                {condition.treatmentApproach}
              </p>
            </div>

            {/* CTA */}
            <div className="bg-[#0d253d] rounded-2xl p-8 text-center">
              <h2
                className="text-2xl text-white mb-3"
                style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
              >
                Ready to start treatment?
              </h2>
              <p
                className="text-[#64748d] text-sm mb-6"
                style={{ fontWeight: 300 }}
              >
                Our registered physiotherapists in Swakopmund are experienced in treating {condition.name}. Book an assessment today.
              </p>
              <Link
                href="/#booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
              >
                Book an Appointment
              </Link>
            </div>

            {/* Related conditions */}
            {related.length > 0 && (
              <div>
                <h2
                  className="text-xl text-[#0d253d] mb-5"
                  style={{ fontWeight: 300, letterSpacing: "-0.22px" }}
                >
                  Related conditions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/conditions/${r.id}`}
                      className="bg-white rounded-xl border border-[#e3e8ee] p-5 hover:border-[#0d9488] transition-colors group"
                      style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
                    >
                      <p
                        className="text-sm text-[#0d253d] group-hover:text-[#0d9488] transition-colors"
                        style={{ fontWeight: 300 }}
                      >
                        {r.name}
                      </p>
                      <p
                        className="text-xs text-[#64748d] mt-1"
                        style={{ fontWeight: 300 }}
                      >
                        {r.description.slice(0, 60)}…
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
