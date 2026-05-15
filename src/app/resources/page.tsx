import type { Metadata } from "next";
import { FileText, Play, BookOpen, Download } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Patient Resources | Physioflex Swakopmund",
  description:
    "Free physiotherapy exercises, recovery guides, and educational resources from Physioflex Swakopmund. Support your recovery at home.",
};

type ResourceType = "pdf" | "video" | "guide";

interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  category: string;
  bodyArea: string[];
  difficulty?: string;
  duration?: string;
  fileSize?: string;
  featured?: boolean;
}

const resources: Resource[] = [
  { id: "1", type: "pdf", title: "Lower back strengthening programme", description: "A 6-week progressive home exercise programme for lumbar stability.", category: "Exercise Sheet", bodyArea: ["Lower Back"], fileSize: "1.1 MB", featured: true },
  { id: "2", type: "pdf", title: "Post-knee replacement: weeks 1–6 guide", description: "Step-by-step rehabilitation guide for the first six weeks after knee replacement.", category: "Post-Surgery", bodyArea: ["Knee"], fileSize: "1.4 MB" },
  { id: "3", type: "pdf", title: "Cervical spine stretches for desk workers", description: "Daily stretching routine to prevent neck and shoulder tension at the office.", category: "Exercise Sheet", bodyArea: ["Neck", "Shoulder"], fileSize: "0.8 MB", featured: true },
  { id: "4", type: "pdf", title: "Rotator cuff rehabilitation phase 1", description: "Early-stage rotator cuff exercises for the first 6 weeks post-surgery or injury.", category: "Post-Surgery", bodyArea: ["Shoulder"], fileSize: "0.9 MB" },
  { id: "5", type: "video", title: "7-minute morning mobility routine", description: "Start your day with this gentle full-body mobility flow — suitable for all fitness levels.", category: "Exercise Video", bodyArea: ["Full Body"], difficulty: "Beginner", duration: "7 min", featured: true },
  { id: "6", type: "video", title: "Hip flexor release — 3 exercises", description: "Three targeted exercises to release tight hip flexors common in desk workers and cyclists.", category: "Exercise Video", bodyArea: ["Hip"], difficulty: "Beginner", duration: "5 min" },
  { id: "7", type: "video", title: "Scapular stabilisation exercises", description: "Strengthen the muscles around your shoulder blade to improve posture and prevent shoulder injuries.", category: "Exercise Video", bodyArea: ["Shoulder", "Upper Back"], difficulty: "Intermediate", duration: "8 min" },
  { id: "8", type: "guide", title: "Understanding your physiotherapy report", description: "A plain-language guide to decoding the clinical language in your physio report.", category: "Education", bodyArea: ["General"] },
  { id: "9", type: "guide", title: "What is dry needling?", description: "Everything you need to know about dry needling — how it works, who it helps, and what to expect.", category: "Education", bodyArea: ["General"] },
  { id: "10", type: "guide", title: "Ice vs heat: when to use which", description: "The definitive guide on when to apply ice and when to apply heat to manage pain and swelling.", category: "Education", bodyArea: ["General"], featured: true },
  { id: "11", type: "guide", title: "Returning to sport after injury", description: "Key principles for safely progressing back to sport after musculoskeletal injury.", category: "Recovery", bodyArea: ["Sports"] },
  { id: "12", type: "guide", title: "Managing pain at home between sessions", description: "Practical strategies to stay on top of pain management between your physiotherapy appointments.", category: "Recovery", bodyArea: ["General"] },
];

const typeMeta: Record<ResourceType, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  pdf: { label: "PDF", bg: "#fce7f3", text: "#9d174d", icon: <FileText size={14} /> },
  video: { label: "Video", bg: "#e0e7ff", text: "#3730a3", icon: <Play size={14} /> },
  guide: { label: "Guide", bg: "#fdf4f0", text: "#9b6829", icon: <BookOpen size={14} /> },
};

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Patient Resources"
          headline="Your recovery doesn't stop at the clinic door"
          subtext="Free exercises, guides, and tools to support your recovery at home. Created by our registered physiotherapists."
        />

        <section className="bg-[#f6f9fc] py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            {/* Featured */}
            <h2
              className="text-xl text-[#0d253d] mb-6"
              style={{ fontWeight: 300, letterSpacing: "-0.22px" }}
            >
              Featured resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
              {resources.filter((r) => r.featured).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {/* All */}
            <h2
              className="text-xl text-[#0d253d] mb-6"
              style={{ fontWeight: 300, letterSpacing: "-0.22px" }}
            >
              All resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.filter((r) => !r.featured).map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const meta = typeMeta[resource.type];
  return (
    <article
      className="bg-white rounded-xl border border-[#e3e8ee] p-6 flex flex-col"
      style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
    >
      {/* Icon block */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ background: "#f0fdfa", color: "#0d9488" }}
      >
        {meta.icon}
      </div>

      {/* Type tag */}
      <span
        className="self-start text-xs px-2.5 py-1 rounded-full mb-3"
        style={{ background: meta.bg, color: meta.text, fontWeight: 400 }}
      >
        {resource.category}
      </span>

      <h3
        className="text-base text-[#0d253d] mb-2"
        style={{ fontWeight: 300, letterSpacing: "-0.2px" }}
      >
        {resource.title}
      </h3>

      <p
        className="text-sm text-[#64748d] leading-6 flex-1 mb-4"
        style={{ fontWeight: 300 }}
      >
        {resource.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.bodyArea.map((area) => (
          <span
            key={area}
            className="text-xs px-2 py-0.5 rounded bg-[#f6f9fc] text-[#64748d]"
            style={{ fontWeight: 300 }}
          >
            {area}
          </span>
        ))}
        {resource.duration && (
          <span className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
            · {resource.duration}
          </span>
        )}
        {resource.difficulty && (
          <span className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
            · {resource.difficulty}
          </span>
        )}
        {resource.fileSize && (
          <span className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
            · {resource.fileSize}
          </span>
        )}
      </div>

      {/* Action */}
      <button
        className="inline-flex items-center gap-2 text-sm border border-[#0d9488] text-[#0d9488] hover:bg-[#f0fdfa] transition-colors px-4 py-2 rounded-full self-start"
        style={{ fontWeight: 400 }}
      >
        {resource.type === "pdf" ? (
          <>
            <Download size={14} />
            Download PDF
          </>
        ) : resource.type === "video" ? (
          <>
            <Play size={14} />
            Watch
          </>
        ) : (
          <>
            <BookOpen size={14} />
            Read guide
          </>
        )}
      </button>
    </article>
  );
}
