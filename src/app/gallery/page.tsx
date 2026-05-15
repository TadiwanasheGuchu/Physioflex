import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { GalleryClient } from "./gallery-client";

export const metadata: Metadata = {
  title: "Clinic Gallery | Physioflex Swakopmund",
  description:
    "Take a virtual tour of Physioflex in Swakopmund. See our modern treatment rooms, rehabilitation equipment, and our team in action.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Our Clinic"
          headline="Inside Physioflex"
          subtext="Our Swakopmund clinic is equipped with modern rehabilitation equipment in a calm, welcoming environment."
        />
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <GalleryClient />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
