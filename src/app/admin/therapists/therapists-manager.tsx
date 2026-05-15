"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Calendar } from "lucide-react";

interface Therapist {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  hpcna_number: string;
  specialisations: string[];
  years_experience: number;
  is_active: boolean;
  bio: string | null;
  upcoming_count: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function AvailabilityGrid() {
  const [slots, setSlots] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    DAYS.forEach((d, di) => {
      HOURS.forEach((h) => {
        // Default: Mon–Fri 08:00–17:00 available, weekends off
        initial[`${d}-${h}`] = di < 5;
      });
    });
    return initial;
  });

  const toggle = (key: string) => setSlots((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-[#6b7a99] uppercase tracking-wide mb-3">Weekly Availability</p>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="w-12" />
              {DAYS.map((d) => (
                <th key={d} className="w-12 pb-2 text-center font-medium text-[#6b7a99]">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((h) => (
              <tr key={h}>
                <td className="pr-2 py-0.5 text-right text-[#6b7a99] w-12">{h}</td>
                {DAYS.map((d) => {
                  const key = `${d}-${h}`;
                  const on = slots[key];
                  return (
                    <td key={d} className="p-0.5">
                      <button
                        onClick={() => toggle(key)}
                        className={`w-10 h-6 rounded transition-colors ${on ? "bg-[#0d9488]" : "bg-[#e3e8ee]"}`}
                        title={`${d} ${h} — ${on ? "available" : "unavailable"}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-[#6b7a99] mt-2">Click a slot to toggle availability. Changes are illustrative — save to persist.</p>
    </div>
  );
}

function TherapistCard({ therapist }: { therapist: Therapist }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0d9488]/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[#0d9488]">
                {therapist.first_name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-[#0d253d] text-sm">
                {therapist.title} {therapist.first_name} {therapist.last_name}
              </h3>
              <p className="text-xs text-[#6b7a99]">HPCNA: {therapist.hpcna_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
              therapist.is_active
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}>
              {therapist.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {therapist.is_active ? "Active" : "Inactive"}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-[#6b7a99] hover:text-[#0d253d] hover:bg-[#f6f9fc] transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-[#6b7a99]">
          <span>{therapist.years_experience} yrs experience</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {therapist.upcoming_count} upcoming
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {therapist.specialisations.map((s) => (
            <span key={s} className="px-2 py-0.5 bg-[#f6f9fc] border border-[#e3e8ee] rounded-full text-[10px] text-[#6b7a99]">
              {s}
            </span>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#e3e8ee] px-5 pb-5">
          {therapist.bio && (
            <p className="text-xs text-[#6b7a99] mt-4 leading-relaxed">{therapist.bio}</p>
          )}
          <AvailabilityGrid />
        </div>
      )}
    </div>
  );
}

export function TherapistsManager({ therapists }: { therapists: Therapist[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {therapists.map((t) => (
        <TherapistCard key={t.id} therapist={t} />
      ))}
      {therapists.length === 0 && (
        <div className="col-span-2 bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-10 text-center text-sm text-[#6b7a99]">
          No therapists found.
        </div>
      )}
    </div>
  );
}
