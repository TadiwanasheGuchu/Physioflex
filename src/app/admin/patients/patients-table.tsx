"use client";

import { useState, useMemo } from "react";
import { Search, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  medical_aid_name: string | null;
  created_at: string;
  last_visit: string | null;
  session_count: number;
}

export function PatientsTable({ patients }: { patients: Patient[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "medical_aid" | "self_pay">("all");

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (filter === "medical_aid" && !p.medical_aid_name) return false;
      if (filter === "self_pay" && p.medical_aid_name) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = `${p.first_name} ${p.last_name}`.toLowerCase();
        const phone = (p.phone ?? "").toLowerCase();
        if (!name.includes(q) && !phone.includes(q)) return false;
      }
      return true;
    });
  }, [patients, search, filter]);

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a99]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-[#e3e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488]"
            />
          </div>
          <div className="flex gap-1 bg-[#f6f9fc] rounded-lg p-1">
            {(["all", "medical_aid", "self_pay"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                  filter === f
                    ? "bg-white text-[#0d253d] shadow-sm font-medium"
                    : "text-[#6b7a99] hover:text-[#0d253d]"
                }`}
              >
                {f === "all" ? "All" : f === "medical_aid" ? "Medical Aid" : "Self-pay"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e3e8ee]">
          <p className="text-xs text-[#6b7a99]">{filtered.length} patients</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e8ee]">
                {["Name", "Phone", "Payment", "Sessions", "Last Visit", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6b7a99] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8ee]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6b7a99]">
                    No patients found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f6f9fc] transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-[#0d253d]">{p.first_name} {p.last_name}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6b7a99] whitespace-nowrap">{p.phone ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {p.medical_aid_name ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {p.medical_aid_name}
                        </span>
                      ) : (
                        <span className="text-xs text-[#6b7a99]">Self-pay</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#0d253d]">{p.session_count}</td>
                    <td className="px-4 py-3 text-[#6b7a99] whitespace-nowrap">
                      {p.last_visit
                        ? new Date(p.last_visit).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
                        : "Never"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/patients/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#0d9488] hover:underline"
                      >
                        View <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
