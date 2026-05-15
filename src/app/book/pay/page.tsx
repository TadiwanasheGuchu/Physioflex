import { Suspense } from "react";
import type { Metadata } from "next";
import { PaymentContent } from "./payment-content";

export const metadata: Metadata = {
  title: "Payment | Physioflex",
  robots: { index: false },
};

export default function PayPage() {
  return (
    <main className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-4 py-16">
      <Suspense>
        <PaymentContent />
      </Suspense>
    </main>
  );
}
