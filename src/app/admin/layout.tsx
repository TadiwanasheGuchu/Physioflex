import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "./admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const db = supabase as any;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/admin");

  const { data: profile } = await db
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/portal");

  const { data: patient } = await db
    .from("patients")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .single();

  const name = patient
    ? `${patient.first_name} ${patient.last_name}`
    : user.email?.split("@")[0] ?? "Admin";

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <AdminSidebar name={name} email={user.email ?? ""} />
      <div className="lg:ml-64">
        <div className="h-14 lg:hidden" />
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
