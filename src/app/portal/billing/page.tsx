import { createClient } from "@/lib/supabase/server";
import { Receipt, Download } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatNAD(cents: number) {
  return `N$${(cents / 100).toFixed(2)}`;
}

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: patientRaw } = await supabase
    .from("patients")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();
  const patient = patientRaw as { id: string } | null;

  // Fetch invoices via appointments for now (invoices table added later in Phase 8)
  let appts: any[] = [];

  if (patient) {
    const { data: appointments } = await supabase
      .from("appointments")
      .select("id, starts_at, status, reference, services(name, price_nad)")
      .eq("patient_id", patient.id)
      .in("status", ["completed", "confirmed", "pending"])
      .order("starts_at", { ascending: false })
      .limit(20);
    appts = (appointments ?? []) as any[];
  }

  const totalPaid = appts
    .filter((a) => a.status === "completed")
    .reduce((sum: number, a: any) => sum + (a.services?.price_nad ?? 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          Billing
        </h1>
        <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
          Your invoices and payment history
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 300 }}>Total Invoices</p>
          <p className="text-3xl text-[#0d253d]" style={{ fontWeight: 300 }}>{appts.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 300 }}>Amount Paid</p>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>
            N${totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#e3e8ee] p-5 col-span-2 sm:col-span-1" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
          <p className="text-xs text-[#64748d] mb-2" style={{ fontWeight: 300 }}>Outstanding</p>
          <p className="text-2xl text-[#0d253d]" style={{ fontWeight: 300 }}>N$0</p>
        </div>
      </div>

      {/* Invoices table */}
      <div className="mb-8">
        <h2 className="text-base text-[#0d253d] mb-4" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Invoices
        </h2>

        {appts.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e3e8ee] p-8 text-center" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
            <Receipt className="w-8 h-8 text-[#e3e8ee] mx-auto mb-3" />
            <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
              No invoices yet. Invoices are generated after each session.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#e3e8ee] bg-white" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc]">
                  {["Reference", "Date", "Service", "Amount", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-[#64748d]"
                      style={{ fontWeight: 400 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee]">
                {appts.map((a: any) => (
                  <tr key={a.id} className="hover:bg-[#f6f9fc] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                      {a.reference}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#0d253d] whitespace-nowrap" style={{ fontWeight: 300 }}>
                      {formatDate(a.starts_at)}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#0d253d]" style={{ fontWeight: 300 }}>
                      {a.services?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#0d253d] whitespace-nowrap" style={{ fontWeight: 300 }}>
                      {a.services?.price_nad ? `N$${a.services.price_nad}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          a.status === "completed"
                            ? "bg-[#f0fdf9] text-[#0d9488] border-[#0d9488]/20"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                        style={{ fontWeight: 400 }}
                      >
                        {a.status === "completed" ? "Paid" : "Upcoming"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a.status === "completed" && (
                        <button
                          disabled
                          title="PDF invoices available in a future update"
                          className="flex items-center gap-1 text-xs text-[#64748d] opacity-50 cursor-not-allowed"
                          style={{ fontWeight: 300 }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Medical aid info */}
      <div className="bg-[#f0fdf9] border border-[#0d9488]/20 rounded-xl p-5">
        <p className="text-sm text-[#0d253d] mb-1" style={{ fontWeight: 400 }}>
          Medical Aid Claims
        </p>
        <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
          Physioflex is registered with PSEMAS, NHP, and most major medical aids. To submit a claim,
          contact the clinic with your booking reference and medical aid details.
        </p>
        <a
          href="https://wa.me/264811234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-[#0d9488] hover:underline"
          style={{ fontWeight: 400 }}
        >
          WhatsApp us to claim →
        </a>
      </div>
    </div>
  );
}
