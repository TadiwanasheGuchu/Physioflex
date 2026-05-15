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

  // Fetch patient profile
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
    <div className="min-h-screen bg-[#f6f9fc] flex">
      <PortalSidebar name={name} email={user.email ?? ""} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
