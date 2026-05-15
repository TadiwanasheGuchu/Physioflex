import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SymptomChecker } from "./symptom-checker";

export const metadata: Metadata = {
  title: "Symptom Checker | Physioflex",
  description: "Describe your symptoms and get guidance on whether physiotherapy can help you.",
  robots: { index: false },
};

export default function SymptomCheckPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f6f9fc]">
        <section className="bg-white border-b border-[#e3e8ee] py-14 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-medium text-[#0d9488] uppercase tracking-widest">AI-Powered</span>
            <h1 className="text-4xl text-[#0d253d] mt-3 mb-3" style={{ fontWeight: 300, letterSpacing: "-0.8px" }}>
              Symptom Checker
            </h1>
            <p className="text-[#64748d] text-sm leading-7" style={{ fontWeight: 300 }}>
              Describe what you&apos;re experiencing and our AI will help you understand whether physiotherapy could help — and what to expect.
            </p>
            <p className="text-xs text-[#6b7a99] mt-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
              ⚠ This is not a medical diagnosis. Always consult a qualified physiotherapist for proper assessment.
            </p>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-6 py-10">
          <SymptomChecker />
        </div>
      </main>
      <Footer />
    </>
  );
}
