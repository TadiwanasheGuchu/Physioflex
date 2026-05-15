import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: patient } = await supabase
    .from("patients")
    .select(
      "id, first_name, last_name, phone, whatsapp, medical_aid_name, medical_aid_number"
    )
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          Profile
        </h1>
        <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
          Manage your personal details and preferences
        </p>
      </div>

      <ProfileForm
        email={user?.email ?? ""}
        patient={patient ?? null}
      />
    </div>
  );
}
