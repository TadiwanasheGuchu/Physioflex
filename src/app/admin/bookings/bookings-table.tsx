"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";

interface Appointment {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  reference: string;
  notes: string | null;
  patients: { id: string; first_name: string; last_name: string; phone: string | null } | null;
  therapists: { id: string; first_name: string; last_name: string } | null;
  services: { name: string; duration_min: number; price_nad: number } | null;
}

interface Props {
  appointments: Appointment[];
  therapists: { id: string; first_name: string; last_name: string }[];
  services: { id: string; name: string }[];
  defaultStatus?: string;
  defaultTherapist?: string;
  defaultDate?: string;
}

const STATUS_OPTIONS = ["all", "confirmed", "completed", "cancelled", "pending", "no_show"];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    no_show: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${map[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function BookingsTable({ appointments, therapists, services, defaultStatus, defaultTherapist, defaultDate }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(defaultStatus ?? "all");
  const [therapistId, setTherapistId] = useState(defaultTherapist ?? "all");
  const [date, setDate] = useState(defaultDate ?? "");

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (therapistId !== "all" && a.therapists?.id !== therapistId) return false;
      if (date && !a.starts_at.startsWith(date)) return false;
      if (search) {
        const q = search.toLowerCase();
        const patientName = `${a.patients?.first_name} ${a.patients?.last_name}`.toLowerCase();
        const ref = a.reference.toLowerCase();
        if (!patientName.includes(q) && !ref.includes(q)) return false;
      }
      return true;
    });
  }, [appointments, search, status, therapistId, date]);

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a99]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient or reference…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e3e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
            />
          </div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-[#e3e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
          />

          <div className="relative">
            <select
              value={therapistId}
              onChange={(e) => setTherapistId(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#e3e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] bg-white"
            >
              <option value="all">All Therapists</option>
              {therapists.map((t) => (
                <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a99] pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-[#e3e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace("_", " ")}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a99] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e3e8ee]">
          <p className="text-xs text-[#6b7a99]">{filtered.length} appointments</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e8ee]">
                {["Date / Time", "Patient", "Service", "Therapist", "Duration", "Status", "Ref"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6b7a99] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8ee]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-[#6b7a99]">
                    No appointments match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const dt = new Date(a.starts_at);
                  return (
                    <tr key={a.id} className="hover:bg-[#f6f9fc] transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-[#0d253d]">
                          {dt.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                        </p>
                        <p className="text-xs text-[#6b7a99]">
                          {dt.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false })}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-[#0d253d]">
                          {a.patients?.first_name} {a.patients?.last_name}
                        </p>
                        <p className="text-xs text-[#6b7a99]">{a.patients?.phone ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 text-[#0d253d] whitespace-nowrap">
                        {a.services?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[#0d253d] whitespace-nowrap">
                        {a.therapists ? `${a.therapists.first_name} ${a.therapists.last_name}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-[#6b7a99] whitespace-nowrap">
                        {a.services?.duration_min}min
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#6b7a99]">{a.reference}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
