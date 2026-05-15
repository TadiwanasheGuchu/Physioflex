"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripeClient } from "@/lib/stripe";
import {
  CreditCard,
  Smartphone,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  Copy,
} from "lucide-react";

type PaymentMethod = "card" | "eft" | "medical_aid";

interface Props {
  appointmentId: string;
  reference: string;
  service: string;
  date: string;
  time: string;
  therapist: string;
}

// ─── Inner Stripe card form ───────────────────────────────────────────────────

function StripeCardForm({
  reference,
  service,
  date,
  time,
  therapist,
  amountNAD,
}: Props & { amountNAD: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setError("");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const successUrl =
      `${siteUrl}/book/success?ref=${reference}` +
      `&service=${encodeURIComponent(service)}` +
      `&date=${encodeURIComponent(date)}` +
      `&time=${encodeURIComponent(time)}` +
      `&therapist=${encodeURIComponent(therapist)}` +
      `&paid=true`;

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: successUrl },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setPaying(false);
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: { billingDetails: { name: "auto" } },
        }}
      />

      {error && (
        <p className="text-sm text-red-500" style={{ fontWeight: 300 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={paying || !stripe}
        className="w-full rounded-full bg-[#0d9488] text-white text-sm py-3 hover:bg-[#0b7a6f] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        style={{ fontWeight: 400 }}
      >
        {paying ? (
          <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        {paying ? "Processing…" : `Pay N$${amountNAD.toLocaleString()}`}
      </button>

      <p className="text-center text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
        🔒 Secured by Stripe · PCI DSS compliant
      </p>
    </form>
  );
}

// ─── EFT / Bank transfer form ─────────────────────────────────────────────────

function EFTDetails({
  reference,
  amountNAD,
  onDone,
}: {
  reference: string;
  amountNAD: number;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const details = [
    { label: "Bank", value: "Bank Windhoek" },
    { label: "Account Name", value: "Physioflex Clinic" },
    { label: "Account Number", value: "000 000 0000" },
    { label: "Branch Code", value: "483 872" },
    { label: "Reference", value: reference },
    { label: "Amount", value: `N$${amountNAD.toLocaleString()}` },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-[#f6f9fc] rounded-xl border border-[#e3e8ee] divide-y divide-[#e3e8ee]">
        {details.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                {label}
              </p>
              <p
                className={`text-sm text-[#0d253d] ${label === "Reference" ? "font-mono tracking-wider" : ""}`}
                style={{ fontWeight: label === "Amount" || label === "Reference" ? 500 : 400 }}
              >
                {value}
              </p>
            </div>
            {(label === "Reference" || label === "Account Number") && (
              <button
                onClick={() => copy(value, label)}
                className="text-[#64748d] hover:text-[#0d9488] transition-colors p-1"
                title={`Copy ${label}`}
              >
                {copied === label ? (
                  <CheckCircle2 className="w-4 h-4 text-[#0d9488]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-[#64748d] text-center" style={{ fontWeight: 300 }}>
        Your booking is confirmed. Please pay before your appointment using the reference above.
      </p>

      <button
        onClick={onDone}
        className="w-full rounded-full bg-[#0d9488] text-white text-sm py-3 hover:bg-[#0b7a6f] transition-colors flex items-center justify-center gap-2"
        style={{ fontWeight: 400 }}
      >
        <CheckCircle2 className="w-4 h-4" />
        Done — View Booking
      </button>
    </div>
  );
}

// ─── Medical Aid form ─────────────────────────────────────────────────────────

function MedicalAidForm({ onDone }: { onDone: () => void }) {
  const [scheme, setScheme] = useState("");
  const [memberNumber, setMemberNumber] = useState("");

  const inputCls =
    "w-full rounded-xl border border-[#e3e8ee] bg-white px-4 py-2.5 text-sm text-[#0d253d] placeholder:text-[#b0bec5] outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] transition";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
          Medical Aid Scheme
        </label>
        <input
          type="text"
          value={scheme}
          onChange={(e) => setScheme(e.target.value)}
          placeholder="e.g. PSEMAS, NHP, Namibian Health Plan"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
          Member Number
        </label>
        <input
          type="text"
          value={memberNumber}
          onChange={(e) => setMemberNumber(e.target.value)}
          placeholder="Your member / policy number"
          className={inputCls}
        />
      </div>

      <div className="bg-[#f0fdf9] border border-[#0d9488]/20 rounded-xl p-4">
        <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
          No payment is required now. The clinic will submit the claim directly to your medical
          aid. You may be responsible for any co-payment or amount exceeding your annual benefit.
        </p>
      </div>

      <button
        onClick={onDone}
        disabled={!scheme || !memberNumber}
        className="w-full rounded-full bg-[#0d9488] text-white text-sm py-3 hover:bg-[#0b7a6f] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        style={{ fontWeight: 400 }}
      >
        <CheckCircle2 className="w-4 h-4" />
        Confirm — No Payment Required
      </button>
    </div>
  );
}

// ─── Main PaymentForm ─────────────────────────────────────────────────────────

export function PaymentForm({
  appointmentId,
  reference,
  service,
  date,
  time,
  therapist,
}: Props) {
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amountNAD, setAmountNAD] = useState<number>(0);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [intentError, setIntentError] = useState("");

  const stripePromise = getStripeClient();

  useEffect(() => {
    if (method === "card" && appointmentId && !clientSecret) {
      setLoadingIntent(true);
      setIntentError("");
      fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setAmountNAD(data.amountNAD);
          } else {
            setIntentError(data.error ?? "Could not load payment details.");
          }
        })
        .catch(() => setIntentError("Network error. Please try again."))
        .finally(() => setLoadingIntent(false));
    }
  }, [method, appointmentId]);

  function goToSuccess() {
    const url =
      `/book/success?ref=${reference}` +
      `&service=${encodeURIComponent(service)}` +
      `&date=${encodeURIComponent(date)}` +
      `&time=${encodeURIComponent(time)}` +
      `&therapist=${encodeURIComponent(therapist)}`;
    router.push(url);
  }

  const tabs: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: "card", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
    { id: "eft", label: "Bank EFT", icon: <Smartphone className="w-4 h-4" /> },
    { id: "medical_aid", label: "Medical Aid", icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <div
      className="bg-white rounded-2xl border border-[#e3e8ee] p-8"
      style={{ boxShadow: "rgba(0,55,112,0.08) 0 8px 24px" }}
    >
      <h1
        className="text-2xl text-[#0d253d] mb-1"
        style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
      >
        Payment
      </h1>
      <p className="text-sm text-[#64748d] mb-6" style={{ fontWeight: 300 }}>
        Complete your booking payment
      </p>

      {/* Booking summary */}
      <div className="bg-[#f6f9fc] rounded-xl border border-[#e3e8ee] p-4 mb-6">
        <p className="text-sm text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>
          {service}
        </p>
        <div className="flex items-center gap-4 text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
          {date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {date}
            </span>
          )}
          {time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {time}
            </span>
          )}
        </div>
        {therapist && (
          <p className="text-xs text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
            with {therapist}
          </p>
        )}
        <p className="text-xs font-mono text-[#64748d] mt-1">{reference}</p>
      </div>

      {/* Payment method tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMethod(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm border transition-colors ${
              method === tab.id
                ? "bg-[#0d9488] text-white border-[#0d9488]"
                : "bg-white text-[#64748d] border-[#e3e8ee] hover:border-[#0d9488] hover:text-[#0d9488]"
            }`}
            style={{ fontWeight: method === tab.id ? 400 : 300 }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Card payment via Stripe */}
      {method === "card" && (
        <>
          {loadingIntent && (
            <div className="flex items-center justify-center py-8">
              <span className="animate-spin w-6 h-6 border-2 border-[#e3e8ee] border-t-[#0d9488] rounded-full" />
            </div>
          )}
          {intentError && (
            <p className="text-sm text-red-500 text-center py-4" style={{ fontWeight: 300 }}>
              {intentError}
            </p>
          )}
          {clientSecret && !loadingIntent && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#0d9488",
                    colorBackground: "#ffffff",
                    colorText: "#0d253d",
                    colorDanger: "#ef4444",
                    fontFamily: "Inter, system-ui, sans-serif",
                    borderRadius: "12px",
                  },
                },
              }}
            >
              <StripeCardForm
                appointmentId={appointmentId}
                reference={reference}
                service={service}
                date={date}
                time={time}
                therapist={therapist}
                amountNAD={amountNAD}
              />
            </Elements>
          )}
        </>
      )}

      {/* EFT */}
      {method === "eft" && (
        <EFTDetails reference={reference} amountNAD={amountNAD || 0} onDone={goToSuccess} />
      )}

      {/* Medical Aid */}
      {method === "medical_aid" && <MedicalAidForm onDone={goToSuccess} />}
    </div>
  );
}
