"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, DollarSign } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  price_nad: number;
}

interface Therapist {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  specialisations: string[];
}

interface BookingState {
  service: Service | null;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  hasMedicalAid: boolean;
  medicalAidName: string;
  medicalAidNumber: string;
  notes: string;
  acceptTerms: boolean;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ["Service", "Therapist", "Date & Time", "Details"];
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors"
                style={{
                  background: done || active ? "#0d9488" : "#e3e8ee",
                  color: done || active ? "#fff" : "#64748d",
                  fontWeight: 500,
                }}
              >
                {done ? <CheckCircle2 size={16} /> : num}
              </div>
              <span
                className="text-xs hidden md:block"
                style={{ color: active ? "#0d253d" : "#64748d", fontWeight: active ? 400 : 300 }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-12 md:w-20 h-px mx-1 mb-4"
                style={{ background: current > num ? "#0d9488" : "#e3e8ee" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (date: string) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function pad(n: number) { return String(n).padStart(2, "0"); }
  function toDateStr(day: number) {
    return `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
  }
  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const dow = d.getDay();
    return d < today || dow === 0; // past or Sunday
  }

  function prev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function next() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] p-4 w-full max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1 text-[#64748d] hover:text-[#0d253d] transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={next} className="p-1 text-[#64748d] hover:text-[#0d253d] transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-[#64748d] py-1" style={{ fontWeight: 400 }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const dateStr = toDateStr(day);
          const disabled = isDisabled(day);
          const isSelected = selected === dateStr;
          const isSat = new Date(viewYear, viewMonth, day).getDay() === 6;
          return (
            <button
              key={dateStr}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className="h-8 w-full rounded-full text-xs transition-colors"
              style={{
                background: isSelected ? "#0d9488" : "transparent",
                color: isSelected ? "#fff" : disabled ? "#c0c0c0" : isSat ? "#0d9488" : "#0d253d",
                fontWeight: isSelected ? 500 : 300,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1 — Service ─────────────────────────────────────────────────────────

function StepService({
  services,
  selected,
  onSelect,
  onNext,
}: {
  services: Service[];
  selected: Service | null;
  onSelect: (s: Service) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl text-[#0d253d] mb-2" style={{ fontWeight: 300, letterSpacing: "-0.26px" }}>
        Select a service
      </h2>
      <p className="text-sm text-[#64748d] mb-8" style={{ fontWeight: 300 }}>
        Choose the type of treatment you need.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {services.map((s) => {
          const active = selected?.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="text-left p-5 rounded-xl border-2 transition-all"
              style={{
                borderColor: active ? "#0d9488" : "#e3e8ee",
                background: active ? "#f0fdfa" : "#fff",
              }}
            >
              <p className="text-base text-[#0d253d] mb-1" style={{ fontWeight: active ? 400 : 300 }}>
                {s.name}
              </p>
              {s.description && (
                <p className="text-xs text-[#64748d] mb-3" style={{ fontWeight: 300 }}>
                  {s.description}
                </p>
              )}
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1 text-xs text-[#64748d]">
                  <Clock size={12} />
                  {s.duration_min} min
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#0d9488]" style={{ fontWeight: 400 }}>
                  N$ {Number(s.price_nad).toFixed(0)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!selected}
          className="px-6 py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 2 — Therapist ──────────────────────────────────────────────────────

function StepTherapist({
  therapists,
  selectedId,
  onSelect,
  onNext,
  onBack,
}: {
  therapists: Therapist[];
  selectedId: string;
  onSelect: (id: string, name: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const options = [
    { id: "any", name: "Any available therapist", title: "We'll match you with the best available", specialisations: [] },
    ...therapists.map((t) => ({
      id: t.id,
      name: `${t.first_name} ${t.last_name}`,
      title: t.title,
      specialisations: t.specialisations,
    })),
  ];

  return (
    <div>
      <h2 className="text-2xl text-[#0d253d] mb-2" style={{ fontWeight: 300, letterSpacing: "-0.26px" }}>
        Choose a therapist
      </h2>
      <p className="text-sm text-[#64748d] mb-8" style={{ fontWeight: 300 }}>
        Select a specific therapist or let us match you.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {options.map((t) => {
          const active = selectedId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id, t.name)}
              className="text-left p-5 rounded-xl border-2 transition-all"
              style={{
                borderColor: active ? "#0d9488" : "#e3e8ee",
                background: active ? "#f0fdfa" : "#fff",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-3 text-sm font-medium text-white"
                style={{ background: "#0d9488" }}
              >
                {t.name === "Any available therapist" ? "★" : t.name.split(" ").map(n => n[0]).join("")}
              </div>
              <p className="text-base text-[#0d253d] mb-0.5" style={{ fontWeight: active ? 400 : 300 }}>
                {t.name}
              </p>
              <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 300 }}>
                {t.title}
              </p>
              {t.specialisations.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {t.specialisations.slice(0, 2).map((s) => (
                    <span
                      key={s}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "#ccfbf1", color: "#0f766e" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 rounded-full border border-[#e3e8ee] text-[#64748d] text-sm hover:border-[#0d9488] hover:text-[#0d9488] transition-colors">
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 — Date & Time ────────────────────────────────────────────────────

function StepDateTime({
  booking,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack,
}: {
  booking: BookingState;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchSlots = useCallback(async (date: string) => {
    if (!date || !booking.service) return;
    setLoadingSlots(true);
    const params = new URLSearchParams({
      date,
      duration: String(booking.service.duration_min),
      ...(booking.therapistId !== "any" ? { therapistId: booking.therapistId } : {}),
    });
    const res = await fetch(`/api/availability?${params}`);
    const data = await res.json();
    setSlots(data.slots ?? []);
    setLoadingSlots(false);
  }, [booking.service, booking.therapistId]);

  useEffect(() => {
    if (booking.date) fetchSlots(booking.date);
  }, [booking.date, fetchSlots]);

  function formatDate(d: string) {
    if (!d) return "";
    const date = new Date(d + "T12:00:00");
    return date.toLocaleDateString("en-NA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div>
      <h2 className="text-2xl text-[#0d253d] mb-2" style={{ fontWeight: 300, letterSpacing: "-0.26px" }}>
        Pick a date & time
      </h2>
      <p className="text-sm text-[#64748d] mb-8" style={{ fontWeight: 300 }}>
        Clinic hours: Mon–Fri 08:00–17:00, Saturday 08:00–13:00.
      </p>

      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <MiniCalendar selected={booking.date} onSelect={(d) => { onDateSelect(d); onTimeSelect(""); }} />

        <div className="flex-1">
          {!booking.date ? (
            <div className="h-full flex items-center justify-center text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
              Select a date to see available times.
            </div>
          ) : loadingSlots ? (
            <div className="text-sm text-[#64748d] py-4" style={{ fontWeight: 300 }}>
              Loading slots…
            </div>
          ) : slots.length === 0 ? (
            <div className="text-sm text-[#64748d] py-4" style={{ fontWeight: 300 }}>
              No availability on {formatDate(booking.date)}. Try another day.
            </div>
          ) : (
            <div>
              <p className="text-xs text-[#64748d] mb-3" style={{ fontWeight: 400 }}>
                {formatDate(booking.date)}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const active = booking.time === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => onTimeSelect(slot)}
                      className="py-2 px-3 rounded-lg border text-sm transition-all"
                      style={{
                        borderColor: active ? "#0d9488" : "#e3e8ee",
                        background: active ? "#0d9488" : "#fff",
                        color: active ? "#fff" : "#0d253d",
                        fontWeight: active ? 400 : 300,
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 rounded-full border border-[#e3e8ee] text-[#64748d] text-sm hover:border-[#0d9488] hover:text-[#0d9488] transition-colors">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!booking.date || !booking.time}
          className="px-6 py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4 — Details ────────────────────────────────────────────────────────

function StepDetails({
  booking,
  onChange,
  onNext,
  onBack,
  submitting,
  error,
  isGuest,
}: {
  booking: BookingState;
  onChange: (field: keyof BookingState, value: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string;
  isGuest: boolean;
}) {
  const input = "w-full px-4 py-3 text-sm text-[#0d253d] placeholder:text-[#64748d] bg-white border border-[#a8c3de] rounded-lg focus:outline-none focus:border-[#0d9488] transition-colors";

  return (
    <div>
      <h2 className="text-2xl text-[#0d253d] mb-2" style={{ fontWeight: 300, letterSpacing: "-0.26px" }}>
        Your details
      </h2>
      <p className="text-sm text-[#64748d] mb-8" style={{ fontWeight: 300 }}>
        We'll use these to confirm your appointment.
      </p>

      <div className="space-y-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>First name *</label>
            <input className={input} style={{ fontWeight: 300 }} type="text" required value={booking.firstName}
              onChange={e => onChange("firstName", e.target.value)} placeholder="Sarah" />
          </div>
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>Last name *</label>
            <input className={input} style={{ fontWeight: 300 }} type="text" required value={booking.lastName}
              onChange={e => onChange("lastName", e.target.value)} placeholder="Müller" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>Phone *</label>
            <input className={input} style={{ fontWeight: 300 }} type="tel" required value={booking.phone}
              onChange={e => onChange("phone", e.target.value)} placeholder="+264 81 000 0000" />
          </div>
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>WhatsApp number</label>
            <input className={input} style={{ fontWeight: 300 }} type="tel" value={booking.whatsapp}
              onChange={e => onChange("whatsapp", e.target.value)} placeholder="Same as phone" />
          </div>
        </div>

        {isGuest && (
          <div>
            <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>Email address *</label>
            <input className={input} style={{ fontWeight: 300 }} type="email" required value={booking.email}
              onChange={e => onChange("email", e.target.value)} placeholder="you@example.com" />
            <p className="text-xs text-[#6b7a99] mt-1" style={{ fontWeight: 300 }}>
              Your confirmation will be sent here.{" "}
              <a href="/auth/login?redirect=/book" className="text-[#0d9488] hover:underline">Have an account? Log in</a>
            </p>
          </div>
        )}

        {/* Medical aid toggle */}
        <div className="p-4 rounded-xl border border-[#e3e8ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#0d253d]" style={{ fontWeight: 300 }}>Do you have medical aid?</p>
              <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>PSEMAS, Namflex, NHP, and others accepted</p>
            </div>
            <button
              type="button"
              onClick={() => onChange("hasMedicalAid", !booking.hasMedicalAid)}
              className="w-11 h-6 rounded-full transition-colors relative"
              style={{ background: booking.hasMedicalAid ? "#0d9488" : "#e3e8ee" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                style={{ transform: booking.hasMedicalAid ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          </div>
          {booking.hasMedicalAid && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>Scheme name</label>
                <input className={input} style={{ fontWeight: 300 }} type="text" value={booking.medicalAidName}
                  onChange={e => onChange("medicalAidName", e.target.value)} placeholder="e.g. PSEMAS" />
              </div>
              <div>
                <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>Member number</label>
                <input className={input} style={{ fontWeight: 300 }} type="text" value={booking.medicalAidNumber}
                  onChange={e => onChange("medicalAidNumber", e.target.value)} placeholder="e.g. 12345678" />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>Notes (optional)</label>
          <textarea
            className={`${input} resize-none`}
            style={{ fontWeight: 300 }}
            rows={3}
            maxLength={200}
            value={booking.notes}
            onChange={e => onChange("notes", e.target.value)}
            placeholder="Briefly describe your main complaint or any information we should know…"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={booking.acceptTerms}
            onChange={e => onChange("acceptTerms", e.target.checked)}
            className="mt-0.5 accent-[#0d9488]"
          />
          <span className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
            I agree to the{" "}
            <a href="/privacy" target="_blank" className="text-[#0d9488] hover:underline">
              privacy policy
            </a>{" "}
            and consent to Physioflex storing my information for treatment purposes.
          </span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 rounded-full border border-[#e3e8ee] text-[#64748d] text-sm hover:border-[#0d9488] hover:text-[#0d9488] transition-colors">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={submitting || !booking.firstName || !booking.lastName || !booking.phone || !booking.acceptTerms || (isGuest && !booking.email)}
          className="px-6 py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Booking…" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export function BookingWizard({
  services,
  therapists,
  userEmail,
  isGuest,
}: {
  services: Service[];
  therapists: Therapist[];
  userEmail: string;
  isGuest: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [booking, setBooking] = useState<BookingState>({
    service: null,
    therapistId: "any",
    therapistName: "Any available therapist",
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    email: userEmail,
    phone: "",
    whatsapp: "",
    hasMedicalAid: false,
    medicalAidName: "",
    medicalAidNumber: "",
    notes: "",
    acceptTerms: false,
  });

  function update(field: keyof BookingState, value: string | boolean | Service | null) {
    setBooking(prev => ({ ...prev, [field]: value }));
  }

  async function submit() {
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: booking.service?.id,
        therapistId: booking.therapistId,
        date: booking.date,
        time: booking.time,
        isGuest,
        patient: {
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
          phone: booking.phone,
          whatsapp: booking.whatsapp,
          medicalAidName: booking.medicalAidName,
          medicalAidNumber: booking.medicalAidNumber,
          notes: booking.notes,
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push(
      `/book/success?ref=${data.reference}` +
      `&date=${encodeURIComponent(booking.date)}` +
      `&time=${encodeURIComponent(booking.time)}` +
      `&service=${encodeURIComponent(booking.service?.name ?? "")}` +
      `&therapist=${encodeURIComponent(booking.therapistName)}`
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      {step === 1 && (
        <StepService
          services={services}
          selected={booking.service}
          onSelect={s => update("service", s)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepTherapist
          therapists={therapists}
          selectedId={booking.therapistId}
          onSelect={(id, name) => { update("therapistId", id); update("therapistName", name); }}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepDateTime
          booking={booking}
          onDateSelect={d => update("date", d)}
          onTimeSelect={t => update("time", t)}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <StepDetails
          booking={booking}
          onChange={(field, value) => update(field, value)}
          onNext={submit}
          onBack={() => setStep(3)}
          submitting={submitting}
          error={error}
          isGuest={isGuest}
        />
      )}
    </div>
  );
}
