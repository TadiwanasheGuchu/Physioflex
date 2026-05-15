import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { conditions } from "@/lib/conditions-data";
import { ConditionsFilter } from "./conditions-filter";

export const metadata: Metadata = {
  title: "Conditions We Treat",
  description:
    "Physioflex treats a wide range of conditions in Swakopmund, Namibia — from sports injuries and back pain to neurological and post-surgical rehabilitation. Book with our registered physiotherapists.",
  alternates: { canonical: "https://physioflex.na/conditions" },
  openGraph: { url: "https://physioflex.na/conditions" },
};

export default function ConditionsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Conditions We Treat"
          headline="Whatever brings you pain, we have a path forward."
          subtext="Our physiotherapists are experienced across a broad range of musculoskeletal, sports, neurological, post-surgical, and paediatric conditions."
        />
        <ConditionsFilter conditions={conditions} />
      </main>
      <Footer />
    </>
  );
}
