import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalSidebar } from "./portal-sidebar";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/portal");
  }

  const { data: patientRaw } = await supabase
    .from("patients")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const patient = patientRaw as { first_name: string; last_name: string } | null;

  const name = patient
    ? `${patient.first_name} ${patient.last_name}`
    : user.email ?? "Patient";

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <PortalSidebar name={name} email={user.email ?? ""} />
      {/* Offset for fixed sidebar (desktop) and fixed top bar (mobile) */}
      <div className="lg:ml-64">
        {/* Spacer for mobile fixed top bar — only in the content column */}
        <div className="h-14 lg:hidden" />
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
