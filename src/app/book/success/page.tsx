import { Suspense } from "react";
import type { Metadata } from "next";
import { SuccessContent } from "./success-content";

export const metadata: Metadata = {
  title: "Booking Confirmed | Physioflex",
  robots: { index: false },
};

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4 py-16">
      <Suspense>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
