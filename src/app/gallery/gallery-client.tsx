"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryCategory = "all" | "clinic-space" | "equipment" | "treatment-rooms" | "team-in-action";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "all">;
  caption: string;
}

const images: GalleryImage[] = [
  {
    id: "1",
    src: "https://images.pexels.com/photos/5793651/pexels-photo-5793651.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Physiotherapist assessing patient posture",
    category: "team-in-action",
    caption: "Expert postural assessment",
  },
  {
    id: "2",
    src: "https://images.pexels.com/photos/4506072/pexels-photo-4506072.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Physiotherapy treatment room",
    category: "treatment-rooms",
    caption: "Our clean, modern treatment rooms",
  },
  {
    id: "3",
    src: "https://images.pexels.com/photos/20860577/pexels-photo-20860577.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Rehabilitation equipment setup",
    category: "equipment",
    caption: "Professional rehabilitation equipment",
  },
  {
    id: "4",
    src: "https://images.pexels.com/photos/20860586/pexels-photo-20860586.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Therapist working with patient on exercises",
    category: "team-in-action",
    caption: "Guided exercise rehabilitation",
  },
  {
    id: "5",
    src: "https://images.pexels.com/photos/20860587/pexels-photo-20860587.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Clinic waiting area",
    category: "clinic-space",
    caption: "Our welcoming reception area",
  },
  {
    id: "6",
    src: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Physiotherapist consultation",
    category: "team-in-action",
    caption: "Initial consultation and assessment",
  },
  {
    id: "7",
    src: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Sports rehabilitation session",
    category: "team-in-action",
    caption: "Sports rehabilitation in action",
  },
  {
    id: "8",
    src: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Manual therapy treatment",
    category: "treatment-rooms",
    caption: "Manual therapy and hands-on treatment",
  },
  {
    id: "9",
    src: "https://images.pexels.com/photos/5452274/pexels-photo-5452274.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Neurological rehabilitation exercise",
    category: "team-in-action",
    caption: "Neurological rehabilitation exercises",
  },
];

const categoryLabels: Record<GalleryCategory, string> = {
  all: "All",
  "clinic-space": "Clinic Space",
  equipment: "Equipment",
  "treatment-rooms": "Treatment Rooms",
  "team-in-action": "Team in Action",
};

const categories = Object.keys(categoryLabels) as GalleryCategory[];

export function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = images.filter(
    (img) => activeCategory === "all" || img.category === activeCategory
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="text-sm px-4 py-2 rounded-full border transition-colors"
              style={{
                background: active ? "#0d9488" : "#f0fdfa",
                color: active ? "#ffffff" : "#0d9488",
                borderColor: active ? "#0d9488" : "#99f6e4",
                fontWeight: 400,
              }}
            >
              {categoryLabels[cat]}
            </button>
          );
        })}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {filtered.map((img, index) => (
          <div
            key={img.id}
            className="mb-4 break-inside-avoid cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <span
                  className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 bg-black/40 rounded-full"
                  style={{ fontWeight: 400 }}
                >
                  View
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(13,37,61,0.95)" }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors p-2"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-3"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              width={900}
              height={600}
              className="rounded-xl object-contain max-h-[80vh] w-auto"
            />
            <p
              className="text-center text-white/70 text-sm mt-3"
              style={{ fontWeight: 300 }}
            >
              {filtered[lightboxIndex].caption}
            </p>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-3"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}
