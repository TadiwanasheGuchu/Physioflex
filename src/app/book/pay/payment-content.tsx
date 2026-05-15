"use client";

import { useSearchParams } from "next/navigation";
import { PaymentForm } from "./payment-form";

export function PaymentContent() {
  const params = useSearchParams();
  const appointmentId = params.get("appointmentId") ?? "";
  const reference = params.get("ref") ?? "";
  const service = params.get("service") ?? "Physiotherapy Session";
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";
  const therapist = params.get("therapist") ?? "";

  return (
    <div className="w-full max-w-lg">
      {/* Logo */}
      <div className="flex items-center gap-2.5 justify-center mb-8">
        <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        <span className="text-[#0d253d] text-xl" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          Physioflex
        </span>
      </div>

      <PaymentForm
        appointmentId={appointmentId}
        reference={reference}
        service={service}
        date={date}
        time={time}
        therapist={therapist}
      />
    </div>
  );
}
