import { createAdminClient } from "@/lib/supabase/admin";
import { Calendar, Users, DollarSign, MessageSquare, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6b7a99] uppercase tracking-wide mb-1" style={{ fontWeight: 500 }}>
            {label}
          </p>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>
            {value}
          </p>
          {sub && <p className="text-xs text-[#6b7a99] mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

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

export default async function AdminPage() {
  const db = createAdminClient() as any;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const [
    { data: todayAppts },
    { data: weekInvoices },
    { data: activePatients },
    { count: unreadMessages },
  ] = await Promise.all([
    db
      .from("appointments")
      .select("id, starts_at, ends_at, status, reference, notes, patients(first_name, last_name), therapists(first_name, last_name), services(name, duration_min)")
      .gte("starts_at", `${todayStr}T00:00:00`)
      .lte("starts_at", `${todayStr}T23:59:59`)
      .order("starts_at"),
    db
      .from("invoices")
      .select("amount_nad, status")
      .gte("created_at", `${weekStartStr}T00:00:00`),
    db
      .from("patients")
      .select("id", { count: "exact" }),
    db
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  const todayList = todayAppts ?? [];
  const remaining = todayList.filter((a: any) =>
    new Date(a.starts_at) > today && a.status !== "cancelled"
  ).length;

  const weekRevenue = (weekInvoices ?? [])
    .filter((i: any) => i.status === "paid")
    .reduce((sum: number, i: any) => sum + (i.amount_nad ?? 0), 0);

  const patientCount = activePatients?.length ?? 0;

  const upcomingToday = todayList
    .filter((a: any) => a.status !== "cancelled")
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>
          Overview
        </h1>
        <p className="text-sm text-[#6b7a99] mt-1">
          {today.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Today's Appointments"
          value={todayList.filter((a: any) => a.status !== "cancelled").length}
          sub={`${remaining} remaining`}
          icon={Calendar}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          label="This Week Revenue"
          value={`N$${weekRevenue.toLocaleString()}`}
          sub="Paid invoices"
          icon={DollarSign}
          color="bg-green-50 text-green-600"
        />
        <KpiCard
          label="Total Patients"
          value={patientCount}
          sub="Registered"
          icon={Users}
          color="bg-purple-50 text-purple-600"
        />
        <KpiCard
          label="Unread Messages"
          value={unreadMessages ?? 0}
          icon={MessageSquare}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e3e8ee] shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e8ee]">
            <h2 className="text-sm font-semibold text-[#0d253d]">Today&apos;s Schedule</h2>
            <Link href="/admin/bookings" className="text-xs text-[#0d9488] hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {upcomingToday.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-[#6b7a99]">
              No appointments scheduled for today.
            </div>
          ) : (
            <div className="divide-y divide-[#e3e8ee]">
              {upcomingToday.map((appt: any) => {
                const start = new Date(appt.starts_at);
                const end = new Date(appt.ends_at);
                const timeStr = `${start.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false })} – ${end.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false })}`;

                return (
                  <div key={appt.id} className="px-5 py-3.5 flex items-center gap-4">
                    <div className="w-16 shrink-0">
                      <p className="text-xs font-medium text-[#0d253d]">
                        {start.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", hour12: false })}
                      </p>
                      <p className="text-[10px] text-[#6b7a99]">
                        {appt.services?.duration_min}min
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0d253d] truncate">
                        {appt.patients?.first_name} {appt.patients?.last_name}
                      </p>
                      <p className="text-xs text-[#6b7a99] truncate">
                        {appt.services?.name} · {appt.therapists?.first_name} {appt.therapists?.last_name}
                      </p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <h2 className="text-sm font-semibold text-[#0d253d] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/book"
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg bg-[#0d9488] text-white text-sm hover:bg-[#0b8276] transition-colors"
                style={{ fontWeight: 500 }}
              >
                <Calendar className="w-4 h-4" />
                New Booking
              </Link>
              <Link
                href="/admin/patients"
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-[#e3e8ee] text-[#0d253d] text-sm hover:bg-[#f6f9fc] transition-colors"
                style={{ fontWeight: 400 }}
              >
                <Users className="w-4 h-4" />
                All Patients
              </Link>
              <Link
                href="/admin/bookings"
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-[#e3e8ee] text-[#0d253d] text-sm hover:bg-[#f6f9fc] transition-colors"
                style={{ fontWeight: 400 }}
              >
                <Clock className="w-4 h-4" />
                All Bookings
              </Link>
              <Link
                href="/admin/finance"
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border border-[#e3e8ee] text-[#0d253d] text-sm hover:bg-[#f6f9fc] transition-colors"
                style={{ fontWeight: 400 }}
              >
                <DollarSign className="w-4 h-4" />
                Finance
              </Link>
            </div>
          </div>

          {/* Recent stats */}
          <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <h2 className="text-sm font-semibold text-[#0d253d] mb-3">Status Breakdown</h2>
            {(["confirmed", "completed", "cancelled"] as const).map((status) => {
              const count = todayList.filter((a: any) => a.status === status).length;
              return (
                <div key={status} className="flex items-center justify-between py-1.5">
                  <StatusBadge status={status} />
                  <span className="text-sm font-medium text-[#0d253d]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
