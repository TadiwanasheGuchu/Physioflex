"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Appointment {
  id: string;
  starts_at: string;
  status: string;
  service_id: string;
  therapist_id: string;
  patient_id: string;
  services: { name: string } | null;
}

interface Props {
  appointments: Appointment[];
  services: { id: string; name: string }[];
  therapists: { id: string; first_name: string; last_name: string; is_active: boolean }[];
}

const COLORS = ["#0d9488", "#0d253d", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#10b981", "#f97316"];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

export function AnalyticsDashboard({ appointments, services, therapists }: Props) {
  const completed = useMemo(() => appointments.filter((a) => a.status !== "cancelled"), [appointments]);

  // Heatmap: day × hour count
  const heatmap = useMemo(() => {
    const grid: number[][] = Array.from({ length: 7 }, () => Array(10).fill(0));
    for (const a of completed) {
      const d = new Date(a.starts_at);
      const day = d.getDay(); // 0=Sun
      const hour = d.getHours() - 8; // 8=0 index
      if (hour >= 0 && hour < 10) grid[day][hour]++;
    }
    return grid;
  }, [completed]);

  const heatMax = useMemo(() => Math.max(...heatmap.flat(), 1), [heatmap]);

  // Service popularity
  const serviceData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of completed) {
      const name = a.services?.name ?? "Unknown";
      counts[name] = (counts[name] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [completed]);

  // Status breakdown (pie)
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of appointments) {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace("_", " "), value }));
  }, [appointments]);

  // Monthly bookings trend
  const monthlyData = useMemo(() => {
    const map: Record<string, { month: string; bookings: number; cancelled: number }> = {};
    for (const a of appointments) {
      const d = new Date(a.starts_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-ZA", { month: "short" });
      if (!map[key]) map[key] = { month: label, bookings: 0, cancelled: 0 };
      if (a.status === "cancelled") map[key].cancelled++;
      else map[key].bookings++;
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [appointments]);

  // Cancellation rate
  const totalBookings = appointments.length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;
  const cancellationRate = totalBookings > 0 ? ((cancelled / totalBookings) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: totalBookings },
          { label: "Completed", value: appointments.filter((a) => a.status === "completed").length },
          { label: "Cancellation Rate", value: `${cancellationRate}%` },
          { label: "Services Offered", value: services.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
            <p className="text-xs text-[#6b7a99] uppercase tracking-wide font-medium mb-1">{label}</p>
            <p className="text-2xl font-bold text-[#0d253d]">{value}</p>
          </div>
        ))}
      </div>

      {/* Monthly bookings + Service breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#0d253d] mb-4">Monthly Bookings</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ee" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7a99" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7a99" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ border: "1px solid #e3e8ee", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="bookings" name="Bookings" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#0d253d] mb-4">Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                paddingAngle={3}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ border: "1px solid #e3e8ee", borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service popularity */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
        <h2 className="text-sm font-semibold text-[#0d253d] mb-4">Most Popular Services</h2>
        {serviceData.length === 0 ? (
          <p className="text-sm text-[#6b7a99] text-center py-8">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e8ee" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7a99" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6b7a99" }} axisLine={false} tickLine={false} width={140} />
              <Tooltip contentStyle={{ border: "1px solid #e3e8ee", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" name="Bookings" fill="#0d9488" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Peak times heatmap */}
      <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5">
        <h2 className="text-sm font-semibold text-[#0d253d] mb-4">Peak Booking Times</h2>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="w-10" />
                {HOURS.map((h) => (
                  <th key={h} className="px-1 pb-2 font-normal text-[#6b7a99] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, di) => (
                <tr key={day}>
                  <td className="pr-2 py-1 font-medium text-[#6b7a99] w-10">{day}</td>
                  {heatmap[di].map((count, hi) => {
                    const intensity = Math.round((count / heatMax) * 9);
                    return (
                      <td key={hi} className="p-0.5">
                        <div
                          title={`${day} ${HOURS[hi]}: ${count} bookings`}
                          className="w-7 h-7 rounded"
                          style={{
                            backgroundColor: count === 0 ? "#f6f9fc" : `rgba(13, 148, 136, ${0.1 + intensity * 0.09})`,
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[#6b7a99] mt-3">Darker = more bookings at that time</p>
      </div>
    </div>
  );
}
