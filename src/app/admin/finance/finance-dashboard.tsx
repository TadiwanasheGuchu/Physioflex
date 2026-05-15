"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DollarSign, Clock, AlertCircle, ChevronDown, Download } from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  amount_nad: number;
  status: string;
  created_at: string;
  paid_at: string | null;
  patients: { first_name: string; last_name: string } | null;
  appointment_id: string | null;
}

interface Props {
  invoices: Invoice[];
  patientMap: Record<string, any>;
}

type Period = "today" | "week" | "month" | "year";

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

function filterByPeriod(invoices: Invoice[], period: Period) {
  const now = new Date();
  const start = new Date(now);
  if (period === "today") start.setHours(0, 0, 0, 0);
  else if (period === "week") { start.setDate(now.getDate() - now.getDay()); start.setHours(0, 0, 0, 0); }
  else if (period === "month") { start.setDate(1); start.setHours(0, 0, 0, 0); }
  else { start.setMonth(0, 1); start.setHours(0, 0, 0, 0); }
  return invoices.filter((i) => new Date(i.created_at) >= start);
}

function buildChartData(invoices: Invoice[]) {
  const monthMap: Record<string, { month: string; selfPay: number; medicalAid: number }> = {};
  for (const inv of invoices) {
    if (inv.status !== "paid") continue;
    const d = new Date(inv.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-ZA", { month: "short", year: "2-digit" });
    if (!monthMap[key]) monthMap[key] = { month: label, selfPay: 0, medicalAid: 0 };
    // We don't have medical aid info on invoice directly, so use amount as self-pay for now
    monthMap[key].selfPay += inv.amount_nad;
  }
  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
}

const STATUS_OPTIONS = ["all", "paid", "unpaid", "partially_paid", "void"];

export function FinanceDashboard({ invoices, patientMap }: Props) {
  const [period, setPeriod] = useState<Period>("month");
  const [statusFilter, setStatusFilter] = useState("all");

  const periodInvoices = useMemo(() => filterByPeriod(invoices, period), [invoices, period]);

  const totalRevenue = periodInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount_nad, 0);
  const outstanding = invoices.filter((i) => i.status === "unpaid" || i.status === "partially_paid").reduce((s, i) => s + i.amount_nad, 0);
  const outstandingCount = invoices.filter((i) => i.status === "unpaid" || i.status === "partially_paid").length;

  const chartData = useMemo(() => buildChartData(invoices), [invoices]);

  const filteredTable = useMemo(() =>
    invoices.filter((i) => statusFilter === "all" || i.status === statusFilter),
    [invoices, statusFilter]
  );

  function exportCsv() {
    const rows = [
      ["Invoice #", "Patient", "Amount (N$)", "Status", "Date", "Paid At"],
      ...filteredTable.map((i) => [
        i.number,
        i.patients ? `${i.patients.first_name} ${i.patients.last_name}` : "—",
        i.amount_nad.toString(),
        i.status,
        new Date(i.created_at).toLocaleDateString("en-ZA"),
        i.paid_at ? new Date(i.paid_at).toLocaleDateString("en-ZA") : "—",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `invoices-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  return (
    <div className="space-y-6">
      {/* Period selector + KPI cards */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <div className="flex gap-1 bg-white border border-[#e3e8ee] rounded-lg p-1">
          {(["today", "week", "month", "year"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                period === p ? "bg-[#0d9488] text-white font-medium" : "text-[#6b7a99] hover:text-[#0d253d]"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#6b7a99] uppercase tracking-wide font-medium">Revenue ({PERIOD_LABELS[period]})</p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-[#0d253d]">N${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-[#6b7a99] mt-0.5">{periodInvoices.filter((i) => i.status === "paid").length} paid invoices</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#6b7a99] uppercase tracking-wide font-medium">Outstanding</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-[#0d253d]">N${outstanding.toLocaleString()}</p>
          <p className="text-xs text-[#6b7a99] mt-0.5">{outstandingCount} unpaid invoices</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-[#6b7a99] uppercase tracking-wide font-medium">Total Invoices</p>
            <AlertCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-[#0d253d]">{invoices.length}</p>
          <p className="text-xs text-[#6b7a99] mt-0.5">Last 6 months</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
        <h2 className="text-sm font-semibold text-[#0d253d] mb-4">Monthly Revenue</h2>
        {chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-[#6b7a99]">
            No paid invoices to chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ee" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7a99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7a99" }} axisLine={false} tickLine={false} tickFormatter={(v) => `N$${v}`} />
              <Tooltip
                contentStyle={{ border: "1px solid #e3e8ee", borderRadius: 8, fontSize: 12 }}
                formatter={(value) => [`N$${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="selfPay" name="Revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Invoice table */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e8ee]">
          <h2 className="text-sm font-semibold text-[#0d253d]">Invoices</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 text-xs border border-[#e3e8ee] rounded-lg focus:outline-none bg-white text-[#0d253d]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace("_", " ")}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b7a99] pointer-events-none" />
            </div>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#e3e8ee] rounded-lg text-[#0d253d] hover:bg-[#f6f9fc] transition-colors"
            >
              <Download className="w-3 h-3" /> Export CSV
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e8ee]">
                {["Invoice #", "Patient", "Amount", "Status", "Date", "Paid"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6b7a99] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8ee]">
              {filteredTable.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#6b7a99]">No invoices.</td>
                </tr>
              ) : (
                filteredTable.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#f6f9fc] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#0d253d]">{inv.number}</td>
                    <td className="px-4 py-3 text-[#0d253d] whitespace-nowrap">
                      {inv.patients ? `${inv.patients.first_name} ${inv.patients.last_name}` : "—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0d253d]">N${inv.amount_nad.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        inv.status === "paid" ? "bg-green-50 text-green-700 border-green-200" :
                        inv.status === "void" ? "bg-gray-100 text-gray-500 border-gray-200" :
                        "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                        {inv.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6b7a99] whitespace-nowrap text-xs">
                      {new Date(inv.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-[#6b7a99] whitespace-nowrap text-xs">
                      {inv.paid_at ? new Date(inv.paid_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) : "—"}
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
