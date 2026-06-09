import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TherapistSidebar } from "./therapist-sidebar";

export default async function TherapistLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/therapist");
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  if (profile?.role !== "therapist") {
    redirect(profile?.role === "admin" ? "/admin" : "/portal");
  }

  // Fetch therapist record linked to this user
  const { data: therapistRaw } = await supabase
    .from("therapists")
    .select("first_name, last_name, title")
    .eq("user_id", user.id)
    .maybeSingle();

  const therapist = therapistRaw as { first_name: string; last_name: string; title: string } | null;
  const name = therapist
    ? `${therapist.first_name} ${therapist.last_name}`
    : user.email ?? "Therapist";

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <TherapistSidebar
        name={name}
        title={therapist?.title ?? ""}
        email={user.email ?? ""}
      />
      <div className="lg:ml-64">
        <div className="h-14 lg:hidden" />
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
