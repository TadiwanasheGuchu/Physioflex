import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRight,
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Calendar,
  Activity,
  Hand,
  Stethoscope,
  Zap,
  CreditCard,
  Banknote,
  BookOpen,
  Users,
  Brain,
  Bone,
  PersonStanding,
  HeartPulse,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// ── Data ────────────────────────────────────────────────────

const services = [
  {
    icon: Activity,
    title: "Sports Rehabilitation",
    description:
      "Return to peak performance with tailored programs designed for athletes at every level.",
    tags: ["Injury Recovery", "Performance", "Prevention"],
  },
  {
    icon: Zap,
    title: "Pain Management",
    description:
      "Evidence-based approaches to chronic and acute pain, combining manual therapy and exercise.",
    tags: ["Chronic Pain", "Acute Relief", "Holistic"],
  },
  {
    icon: Hand,
    title: "Manual Therapy",
    description:
      "Hands-on techniques to restore joint mobility, release soft tissue restrictions, and improve posture.",
    tags: ["Joint Mobility", "Soft Tissue", "Posture"],
  },
  {
    icon: Stethoscope,
    title: "Post-Surgery Recovery",
    description:
      "Structured rehabilitation programs to safely rebuild strength and mobility after surgery.",
    tags: ["Rehabilitation", "Strength", "Recovery"],
  },
];

const team = [
  {
    name: "Susan Mubatapasango",
    title: "Senior Physiotherapist",
    initials: "SM",
    specialisations: ["Manual Therapy", "Pain Management", "Sports Rehab"],
    languages: ["English"],
    bio: "Over 15 years of clinical experience with a patient-centred approach built on evidence-based techniques and genuine care.",
  },
  {
    name: "Vimbai",
    title: "Senior Physiotherapist",
    initials: "V",
    specialisations: ["Post-Surgical Rehab", "Dry Needling", "Neurological Rehab"],
    languages: ["English"],
    bio: "More than 15 years of hands-on practice spanning sports injuries, chronic pain, and neurological rehabilitation.",
  },
];

const conditions = [
  { icon: Bone, label: "Back & Neck Pain" },
  { icon: Activity, label: "Sports Injuries" },
  { icon: PersonStanding, label: "Post-Surgery Rehab" },
  { icon: Brain, label: "Neurological Conditions" },
  { icon: HeartPulse, label: "Chronic Pain" },
  { icon: Hand, label: "Shoulder & Arm" },
  { icon: Stethoscope, label: "Paediatric Physio" },
  { icon: Users, label: "Elderly Care" },
];

const medicalAids = [
  "NHP",
  "NMC",
  "Named",
  "Prosperity",
  "Napotel",
  "GemHealth",
];

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "2,000+", label: "Patients Treated" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "15+", label: "Treatment Methods" },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "Swakopmund",
    service: "Sports Rehabilitation",
    date: "April 2026",
    rating: 5,
    text: "After my knee surgery, Physioflex had me back on the trail in eight weeks. The team is exceptional — professional, genuinely caring, and incredibly effective.",
  },
  {
    name: "Johan V.",
    location: "Walvis Bay",
    service: "Manual Therapy",
    date: "March 2026",
    rating: 5,
    text: "Years of chronic back pain, resolved in six sessions. The manual therapy approach here is unlike anything I have experienced elsewhere. Truly life-changing.",
  },
  {
    name: "Amara N.",
    location: "Swakopmund",
    service: "Sports Rehabilitation",
    date: "May 2026",
    rating: 5,
    text: "As a competitive cyclist, fast recovery is everything. Physioflex understands athletes. My performance and resilience have never been better.",
  },
];

const blogPosts = [
  {
    title: "5 exercises for lower back pain you can do at home",
    category: "Injury Prevention",
    date: "10 May 2026",
    readTime: "5 min",
    excerpt: "Simple, effective exercises from our physiotherapists that you can do daily to reduce lower back pain.",
    image: "https://images.pexels.com/photos/4506072/pexels-photo-4506072.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    slug: "lower-back-pain-exercises",
  },
  {
    title: "What to expect after ACL surgery: a week-by-week guide",
    category: "Recovery Tips",
    date: "2 May 2026",
    readTime: "7 min",
    excerpt: "Our sports rehabilitation specialists walk you through the recovery timeline after ACL reconstruction.",
    image: "https://images.pexels.com/photos/20860577/pexels-photo-20860577.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    slug: "after-acl-surgery",
  },
  {
    title: "Desk worker's guide to avoiding neck and shoulder pain",
    category: "Lifestyle",
    date: "25 April 2026",
    readTime: "4 min",
    excerpt: "Posture tips, stretches, and workstation adjustments to keep neck and shoulder pain at bay.",
    image: "https://images.pexels.com/photos/20860586/pexels-photo-20860586.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    slug: "desk-posture-guide",
  },
];

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/20860587/pexels-photo-20860587.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop",
    alt: "Physiotherapist working with patient at Physioflex",
    span: "large",
  },
  {
    src: "https://images.pexels.com/photos/4506072/pexels-photo-4506072.jpeg?auto=compress&cs=tinysrgb&w=600&h=340&fit=crop",
    alt: "Physiotherapy arm assessment at Physioflex Swakopmund",
    span: "small",
  },
  {
    src: "https://images.pexels.com/photos/20860577/pexels-photo-20860577.jpeg?auto=compress&cs=tinysrgb&w=600&h=340&fit=crop",
    alt: "Manual therapy session at Physioflex",
    span: "small",
  },
];

const faqLeft = [
  {
    q: "Do I need a doctor's referral to see a physiotherapist?",
    a: "No. Physiotherapists in Namibia are first-contact healthcare practitioners, meaning you can book an appointment directly without a doctor's referral. Physiotherapists are trained to assess, diagnose, and treat a wide range of conditions. If further medical investigation is needed, your physiotherapist will refer you to the appropriate healthcare professional.",
  },
  {
    q: "What should I bring to my first appointment?",
    a: "Please bring: your medical aid card, your ID or passport, the ID of the main medical aid member (if you are a dependent), N$60 administration fee for opening your patient file, and any relevant medical reports, X-rays, MRI scans, or referral letters if available.",
  },
  {
    q: "How long is a session?",
    a: "Initial consultations are 60 minutes and include a full assessment plus your first treatment. Follow-up sessions are typically 30–45 minutes depending on your treatment plan.",
  },
  {
    q: "Is physiotherapy painful?",
    a: "Some techniques may cause temporary discomfort, but treatment should never be excessively painful. Your physiotherapist will always work within your comfort level and explain what to expect.",
  },
  {
    q: "How many sessions will I need?",
    a: "This varies by condition. Acute injuries may resolve in 3–6 sessions; chronic or post-surgical conditions often require 8–12+ sessions. Your physiotherapist will give you a realistic estimate after the initial assessment.",
  },
];

const faqRight = [
  {
    q: "Which medical aids do you accept?",
    a: "We accept NHP, NMC, Named, Prosperity, Napotel, and GemHealth. Contact us to confirm your specific plan. Uninsured patients are always welcome.",
  },
  {
    q: "Do you do direct billing to medical aids?",
    a: "Yes, where the medical aid allows direct billing, we process claims on your behalf. You may be responsible for any co-payments or amounts above your annual physiotherapy benefit limit.",
  },
  {
    q: "What physiotherapy techniques do you use?",
    a: "We use a range of evidence-based techniques including manual therapy, dry needling, exercise prescription, ultrasound therapy, TENS, and taping — tailored to your specific condition and goals.",
  },
  {
    q: "Do you treat children?",
    a: "Yes. Our paediatric physiotherapy services treat children from infancy through adolescence, covering developmental delays, sports injuries, scoliosis, and more.",
  },
  {
    q: "Where are you located and is there parking?",
    a: "We are located at Shop Nr 2, Spar Ocean View Shopping Centre, Eugene Muller Street, Swakopmund. Free parking is available on-site. Call us or check the map below for directions.",
  },
];

const trustBadges = [
  "Registered Physiotherapists",
  "HPCNA Accredited",
  "Wheelchair Accessible",
];

const aboutPoints = [
  "Individualized treatment plans for every patient",
  "Evidence-based, outcome-driven practice",
  "Registered with the Health Professions Council of Namibia",
  "Serving Swakopmund and surrounding coastal areas",
];

const categoryColors: Record<string, string> = {
  "Injury Prevention": "bg-[#ccfbf1] text-[#0f766e]",
  "Recovery Tips": "bg-[#e0e7ff] text-[#3730a3]",
  Lifestyle: "bg-[#fdf4f0] text-[#9b6829]",
  Education: "bg-[#fce7f3] text-[#9d174d]",
};

// ── Page ────────────────────────────────────────────────────

export default async function Home() {
  let featuredReviews: { display_name: string; suburb: string | null; rating: number; body: string; service_name: string | null }[] = [];
  let appointmentCount = 0;
  let patientCount = 100;
  let serviceCount = 0;
  let therapistCount = 0;
  let reviewCount = 0;
  let reviewAvg = 0;
  let reviewBreakdown: { label: string; pct: number }[] = [];

  try {
    const supabase = await createClient();
    const db = supabase as any;

    const [
      { data: reviewData },
      { data: allRatings },
      { count: apptCount },
      { count: ptCount },
      { count: svcCount },
      { count: thrCount },
    ] = await Promise.all([
      db.from("reviews").select("display_name, suburb, rating, body, services(name)")
        .eq("status", "approved").gte("rating", 4)
        .order("rating", { ascending: false }).order("created_at", { ascending: false }).limit(3),
      db.from("reviews").select("rating").eq("status", "approved"),
      db.from("appointments").select("id", { count: "exact", head: true }),
      db.from("patients").select("id", { count: "exact", head: true }),
      db.from("services").select("id", { count: "exact", head: true }).eq("is_active", true),
      db.from("therapists").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

    if (reviewData && reviewData.length >= 3) {
      featuredReviews = reviewData.map((r: any) => ({ ...r, service_name: r.services?.name ?? null }));
    }
    if (allRatings && allRatings.length > 0) {
      reviewCount = allRatings.length;
      reviewAvg = allRatings.reduce((s: number, r: any) => s + r.rating, 0) / reviewCount;
      reviewBreakdown = [5, 4, 3, 2, 1].map((star) => ({
        label: `${star} star${star === 1 ? "" : "s"}`,
        pct: Math.round((allRatings.filter((r: any) => r.rating === star).length / reviewCount) * 100),
      }));
    }
    appointmentCount = apptCount ?? 0;
    patientCount = Math.max(ptCount ?? 0, 100);
    serviceCount = svcCount ?? 0;
    therapistCount = thrCount ?? 0;
  } catch {
    // Fall through to defaults
  }

  const liveStats = [
    { value: `${appointmentCount}+`, label: "Appointments Booked" },
    { value: `${patientCount}+`, label: "Patients Treated" },
    { value: `${serviceCount}`, label: "Treatment Services" },
    { value: `${therapistCount}`, label: "Qualified Therapists" },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 py-20 lg:py-28"
        style={{
          background: `
            radial-gradient(ellipse 80% 65% at 5% 15%, #ccfbf1 0%, transparent 60%),
            radial-gradient(ellipse 60% 55% at 95% 5%, #d1fae5 0%, transparent 50%),
            radial-gradient(ellipse 70% 60% at 45% 85%, #a7f3d0 0%, transparent 60%),
            radial-gradient(ellipse 80% 50% at 88% 80%, #6ee7b7 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 18% 88%, #bfdbfe 0%, transparent 50%),
            #fdf8f3
          `,
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ccfbf1] border border-[#99f6e4]">
              <MapPin size={10} className="text-[#0d9488]" />
              <span className="text-[10px] font-medium text-[#0f766e] uppercase tracking-widest">
                Swakopmund, Namibia
              </span>
            </div>
            <h1
              className="text-5xl lg:text-[3.5rem] text-[#0d253d] leading-[1.06] mb-6"
              style={{ fontWeight: 300, letterSpacing: "-1.4px" }}
            >
              Expert Physiotherapy
              <br />
              <span className="text-[#0d9488]">for Every Body.</span>
            </h1>
            <p className="text-lg text-[#64748d] leading-relaxed mb-10 max-w-md" style={{ fontWeight: 300 }}>
              Physioflex delivers evidence-based physiotherapy in Swakopmund.
              From sports rehabilitation to chronic pain management — we help
              you move better, feel stronger, and live fully.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="#booking" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors">
                Book an Appointment <ArrowRight size={14} />
              </Link>
              <Link href="#services" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0d9488] text-[#0d9488] text-sm font-medium hover:bg-[#f0fdfa] transition-colors">
                Explore Services
              </Link>
            </div>
            <div className="flex flex-wrap gap-5">
              {trustBadges.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#0d9488]" />
                  <span className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative h-135 rounded-2xl overflow-hidden"
              style={{ boxShadow: "rgba(0,55,112,0.12) 0 24px 48px, rgba(0,55,112,0.06) 0 4px 12px" }}
            >
              <Image
                src="https://images.pexels.com/photos/5793651/pexels-photo-5793651.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1400&fit=crop"
                alt="Physiotherapist assessing patient posture at Physioflex Swakopmund"
                fill className="object-cover object-top" priority
                sizes="(max-width: 1024px) 0px, 50vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/20 to-transparent" />
            </div>
            <div className="absolute -bottom-5 -left-6 bg-white rounded-xl px-4 py-3 border border-[#e3e8ee]"
              style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#ccfbf1] flex items-center justify-center shrink-0">
                  <CheckCircle size={15} className="text-[#0d9488]" />
                </div>
                <div>
                  <div className="text-[#0d253d] text-sm font-medium">HPCNA Registered</div>
                  <div className="text-[#64748d] text-xs">Certified Physiotherapists</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-xl px-4 py-3 border border-[#e3e8ee]"
              style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px" }}
            >
              <div className="text-2xl text-[#0d9488] mb-0.5"
                style={{ fontWeight: 300, letterSpacing: "-0.5px", fontFeatureSettings: '"tnum"' }}>
                {patientCount}+
              </div>
              <div className="text-[#64748d] text-xs">Patients Treated</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ───────────────────────────────────────── */}
      <section id="services" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">What We Treat</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 mb-12">
            <h2 className="text-[2.25rem] text-[#0d253d] max-w-sm leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              Services built around your recovery
            </h2>
            <p className="text-[#64748d] text-sm max-w-xs mt-4 md:mt-0" style={{ fontWeight: 300 }}>
              Comprehensive physiotherapy care for all ages and conditions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="p-8 rounded-xl border border-[#e3e8ee] hover:shadow-lg transition-shadow bg-white"
                  style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
                  <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] flex items-center justify-center mb-5">
                    <Icon size={18} className="text-[#0d9488]" />
                  </div>
                  <h3 className="text-[#0d253d] text-[1.1rem] mb-3" style={{ fontWeight: 300, letterSpacing: "-0.22px" }}>
                    {service.title}
                  </h3>
                  <p className="text-[#64748d] text-sm leading-6 mb-5" style={{ fontWeight: 300 }}>
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#0f766e] bg-[#ccfbf1]">{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team Teaser ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#f0fdfa]">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">Our Team</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 mb-12">
            <h2 className="text-[2.25rem] text-[#0d253d] max-w-sm leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              The people behind your recovery
            </h2>
            <Link href="/team" className="inline-flex items-center gap-1.5 text-sm text-[#0d9488] hover:underline mt-4 md:mt-0" style={{ fontWeight: 300 }}>
              Meet the full team <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-[#e3e8ee] p-8"
                style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-white text-lg font-medium"
                    style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" }}>
                    {member.initials}
                  </div>
                  <div>
                    <div className="text-[#0d253d] text-sm font-medium">{member.name}</div>
                    <div className="text-[#64748d] text-xs mt-0.5" style={{ fontWeight: 300 }}>{member.title}</div>
                  </div>
                </div>
                <p className="text-[#64748d] text-sm leading-6 mb-5" style={{ fontWeight: 300 }}>{member.bio}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {member.specialisations.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#0f766e] bg-[#ccfbf1]">{s}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.languages.map((l) => (
                    <span key={l} className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#9b6829] bg-[#fdf4f0]">{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conditions Teaser ──────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">Conditions We Treat</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 mb-12">
            <h2 className="text-[2.25rem] text-[#0d253d] max-w-md leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              Whatever brings you pain, we have a path forward
            </h2>
            <Link href="/conditions" className="inline-flex items-center gap-1.5 text-sm text-[#0d9488] hover:underline mt-4 md:mt-0" style={{ fontWeight: 300 }}>
              See all conditions <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {conditions.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-3 p-6 rounded-xl border border-[#e3e8ee] bg-white hover:border-[#0d9488] hover:bg-[#f0fdfa] transition-colors cursor-pointer group"
                style={{ boxShadow: "rgba(0,55,112,0.06) 0 1px 3px" }}>
                <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] group-hover:bg-white flex items-center justify-center transition-colors">
                  <Icon size={18} className="text-[#0d9488]" />
                </div>
                <span className="text-[#0d253d] text-sm text-center leading-5" style={{ fontWeight: 300 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Medical Aid & Insurance ────────────────────────── */}
      <section className="py-24 px-6 bg-[#f0fdfa]">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">Medical Aid Accepted</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 mb-10">
            <h2 className="text-[2.25rem] text-[#0d253d] max-w-sm leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              We work with most Namibian medical aids
            </h2>
            <p className="text-[#64748d] text-sm max-w-xs mt-4 md:mt-0" style={{ fontWeight: 300 }}>
              Not sure if your plan covers physiotherapy? Call us — we&apos;ll check your benefits before your first visit.
            </p>
          </div>

          {/* Aid badges */}
          <div className="flex flex-wrap gap-2 mb-12">
            {medicalAids.map((aid) => (
              <span key={aid} className="px-4 py-1.5 rounded-full bg-white border border-[#e3e8ee] text-[#0d253d] text-sm"
                style={{ fontWeight: 300 }}>
                {aid}
              </span>
            ))}
            <span className="px-4 py-1.5 rounded-full bg-white border border-[#e3e8ee] text-[#64748d] text-sm" style={{ fontWeight: 300 }}>
              + more
            </span>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#e3e8ee] p-8" style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
              <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] flex items-center justify-center mb-5">
                <CreditCard size={18} className="text-[#0d9488]" />
              </div>
              <h3 className="text-[#0d253d] text-lg mb-2" style={{ fontWeight: 300, letterSpacing: "-0.22px" }}>Direct medical aid billing</h3>
              <p className="text-[#64748d] text-sm leading-6 mb-4" style={{ fontWeight: 300 }}>
                Where your medical aid allows, we submit claims directly on your behalf. You only pay any co-payment or amount above your annual physiotherapy benefit.
              </p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#0f766e] bg-[#ccfbf1]">No paperwork for you</span>
            </div>
            <div className="bg-white rounded-xl border border-[#e3e8ee] p-8" style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
              <div className="w-10 h-10 rounded-lg bg-[#f0fdfa] flex items-center justify-center mb-5">
                <Banknote size={18} className="text-[#0d9488]" />
              </div>
              <h3 className="text-[#0d253d] text-lg mb-2" style={{ fontWeight: 300, letterSpacing: "-0.22px" }}>Transparent self-pay rates</h3>
              <p className="text-[#64748d] text-sm leading-6 mb-4" style={{ fontWeight: 300 }}>
                Not insured? We offer competitive self-pay rates with no hidden fees. Ask about our session packages for better value on ongoing treatment.
              </p>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#0f766e] bg-[#ccfbf1]">No hidden fees</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="tel:+26464000000"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors">
              <Phone size={14} /> Check your cover
            </Link>
            <a href={`https://wa.me/264640000000?text=${encodeURIComponent("Hi, I'd like to check if my medical aid is accepted at Physioflex.")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0d9488] text-[#0d9488] text-sm font-medium hover:bg-[#f0fdfa] transition-colors">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────── */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">About Physioflex</span>
              <h2 className="text-[2.25rem] text-[#0d253d] mt-3 mb-6 leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
                Rooted in Swakopmund, dedicated to your wellbeing
              </h2>
              <p className="text-[#64748d] text-base leading-7 mb-5" style={{ fontWeight: 300 }}>
                Physioflex was founded with a single vision: to bring world-class physiotherapy to the people of Namibia. Based on the Atlantic coast in Swakopmund, we combine evidence-based treatment methods with genuine care for each patient.
              </p>
              <p className="text-[#64748d] text-base leading-7 mb-8" style={{ fontWeight: 300 }}>
                Our registered physiotherapists take time to understand your unique condition and build a treatment plan that delivers lasting results — not just temporary relief.
              </p>
              <div className="space-y-3">
                {aboutPoints.map((point) => (
                  <div key={point} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-[#0d9488] shrink-0" />
                    <span className="text-[#0d253d] text-sm" style={{ fontWeight: 300 }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-[#0d253d] p-8 text-white"
                style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px" }}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#0d9488]" />
                  <span className="text-xs text-[#64748d]">Patient Dashboard</span>
                </div>
                <div className="mb-6">
                  <div className="text-2xl text-white mb-1" style={{ fontWeight: 300, letterSpacing: "-0.26px" }}>
                    Appointment Confirmed
                  </div>
                  <div className="text-[#6ee7b7] text-sm">Tomorrow, 09:00 · Manual Therapy</div>
                </div>
                <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-5">
                  {liveStats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl text-white mb-1"
                        style={{ fontWeight: 300, letterSpacing: "-0.26px", fontFeatureSettings: '"tnum"' }}>
                        {stat.value}
                      </div>
                      <div className="text-[#64748d] text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-4 md:-right-8 bg-white rounded-xl p-4 border border-[#e3e8ee]"
                style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ccfbf1] flex items-center justify-center shrink-0">
                    <Activity size={16} className="text-[#0d9488]" />
                  </div>
                  <div>
                    <div className="text-[#0d253d] text-sm" style={{ fontWeight: 500 }}>Sports Rehab</div>
                    <div className="text-[#64748d] text-xs">8-week program</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews / Testimonials ─────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 bg-[#f0fdfa]">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">Patient Reviews</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 mb-10">
            <h2 className="text-[2.25rem] text-[#0d253d] max-w-sm leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              Hear from our patients
            </h2>
            <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm text-[#0d9488] hover:underline mt-4 md:mt-0" style={{ fontWeight: 300 }}>
              Read all reviews <ArrowRight size={14} />
            </Link>
          </div>

          {/* Rating summary — only shown when real reviews exist */}
          {reviewCount > 0 && (
            <div className="bg-white rounded-xl border border-[#e3e8ee] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
              <div className="text-center shrink-0">
                <div className="text-5xl text-[#0d253d] mb-1" style={{ fontWeight: 300, letterSpacing: "-1px" }}>{reviewAvg.toFixed(1)}</div>
                <div className="flex gap-0.5 justify-center mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className={i <= Math.round(reviewAvg) ? "fill-[#f59e0b] text-[#f59e0b]" : "fill-gray-200 text-gray-200"} />
                  ))}
                </div>
                <div className="text-[#64748d] text-xs">{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</div>
              </div>
              <div className="flex-1 w-full space-y-2">
                {reviewBreakdown.map(({ label, pct }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-[#64748d] w-12 shrink-0" style={{ fontWeight: 300 }}>{label}</span>
                    <div className="flex-1 h-1.5 bg-[#e3e8ee] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0d9488] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-[#64748d] w-8 text-right shrink-0" style={{ fontFeatureSettings: '"tnum"', fontWeight: 300 }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review cards — live DB or static fallback */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(featuredReviews.length >= 3 ? featuredReviews : testimonials.map((t) => ({
              display_name: t.name,
              suburb: t.location,
              rating: t.rating,
              body: t.text,
              service_name: t.service,
            }))).map((t, idx) => (
              <div key={idx} className="p-8 rounded-xl border border-[#e3e8ee] bg-white"
                style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
                    ))}
                  </div>
                  {featuredReviews.length >= 3 && (
                    <span className="text-[10px] font-medium text-[#0f766e] bg-[#ccfbf1] px-2 py-0.5 rounded-full">Verified Patient</span>
                  )}
                </div>
                <p className="text-[#0d253d] text-sm leading-7 mb-6" style={{ fontWeight: 300 }}>
                  &ldquo;{t.body}&rdquo;
                </p>
                <div>
                  <div className="text-[#0d253d] text-sm font-medium">{t.display_name}{t.suburb ? ` · ${t.suburb}` : ""}</div>
                  {t.service_name && <div className="text-[#64748d] text-xs mt-0.5">{t.service_name}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Teaser ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">Health Tips & Insights</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 mb-12">
            <h2 className="text-[2.25rem] text-[#0d253d] max-w-sm leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              Move better with expert advice
            </h2>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[#0d9488] hover:underline mt-4 md:mt-0" style={{ fontWeight: 300 }}>
              Read all articles <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group rounded-xl border border-[#e3e8ee] bg-white overflow-hidden hover:shadow-lg transition-shadow"
                style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
                <div className="relative h-48 overflow-hidden">
                  <Image src={post.image} alt={post.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mb-3 ${categoryColors[post.category] ?? "bg-[#ccfbf1] text-[#0f766e]"}`}>
                    {post.category}
                  </span>
                  <h3 className="text-[#0d253d] text-base leading-6 mb-2" style={{ fontWeight: 300, letterSpacing: "-0.2px" }}>
                    {post.title}
                  </h3>
                  <p className="text-[#64748d] text-sm leading-6 mb-4 line-clamp-2" style={{ fontWeight: 300 }}>{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748d] text-xs" style={{ fontWeight: 300 }}>{post.date} · {post.readTime} read</span>
                    <span className="flex items-center gap-1 text-[#0d9488] text-xs font-medium">
                      <BookOpen size={12} /> Read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Teaser ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#f0fdfa]">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">Our Clinic</span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-3 mb-10">
            <h2 className="text-[2.25rem] text-[#0d253d] max-w-sm leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              A space designed for your recovery
            </h2>
            <Link href="/gallery" className="inline-flex items-center gap-1.5 text-sm text-[#0d9488] hover:underline mt-4 md:mt-0" style={{ fontWeight: 300 }}>
              Take a tour <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-96 md:h-[480px]">
            {/* Large left image */}
            <div className="row-span-2 relative rounded-xl overflow-hidden group cursor-pointer">
              <Image src={galleryImages[0].src} alt={galleryImages[0].alt} fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">View gallery</span>
              </div>
            </div>
            {/* Small top-right */}
            <div className="relative rounded-xl overflow-hidden group cursor-pointer">
              <Image src={galleryImages[1].src} alt={galleryImages[1].alt} fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
            </div>
            {/* Small bottom-right */}
            <div className="relative rounded-xl overflow-hidden group cursor-pointer">
              <Image src={galleryImages[2].src} alt={galleryImages[2].alt} fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <span className="text-[10px] font-medium text-[#0d9488] uppercase tracking-widest">Frequently Asked Questions</span>
          <div className="mt-3 mb-10">
            <h2 className="text-[2.25rem] text-[#0d253d] leading-tight mb-2" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
              Everything you need to know before your first visit
            </h2>
            <p className="text-[#64748d] text-sm" style={{ fontWeight: 300 }}>
              Still have questions?{" "}
              <Link href="tel:+26464000000" className="text-[#0d9488] hover:underline">Call us</Link>{" "}
              or{" "}
              <a href={`https://wa.me/264640000000`} target="_blank" rel="noopener noreferrer" className="text-[#0d9488] hover:underline">
                message us on WhatsApp
              </a>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <Accordion type="single" collapsible className="space-y-0">
              {faqLeft.map((item, i) => (
                <AccordionItem key={i} value={`left-${i}`} className="border-b border-[#e3e8ee]">
                  <AccordionTrigger className="text-[#0d253d] text-sm text-left py-5 hover:no-underline font-normal">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#64748d] text-sm leading-7 pb-5" style={{ fontWeight: 300 }}>
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion type="single" collapsible className="space-y-0">
              {faqRight.map((item, i) => (
                <AccordionItem key={i} value={`right-${i}`} className="border-b border-[#e3e8ee]">
                  <AccordionTrigger className="text-[#0d253d] text-sm text-left py-5 hover:no-underline font-normal">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#64748d] text-sm leading-7 pb-5" style={{ fontWeight: 300 }}>
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── Booking CTA ────────────────────────────────────── */}
      <section id="booking" className="py-24 px-6 bg-[#fdf4f0]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl bg-[#0d253d] p-12 md:p-16 relative overflow-hidden"
            style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px" }}>
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `radial-gradient(ellipse 55% 65% at 95% 50%, #6ee7b7 0%, transparent 60%),
                           radial-gradient(ellipse 35% 40% at 5% 85%, #0d9488 0%, transparent 55%)`,
              opacity: 0.18,
            }} />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div>
                <h2 className="text-[2.25rem] text-white mb-4 leading-tight" style={{ fontWeight: 300, letterSpacing: "-0.64px" }}>
                  Ready to start your recovery?
                </h2>
                <p className="text-[#64748d] text-base max-w-md leading-7" style={{ fontWeight: 300 }}>
                  Book your initial consultation in Swakopmund. Our team will assess your condition and create a personalised treatment plan that fits your lifestyle and goals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="tel:+26464000000"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                  <Phone size={14} /> Call Now
                </Link>
                <Link href="/book"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors">
                  <Calendar size={14} /> Book Online
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
