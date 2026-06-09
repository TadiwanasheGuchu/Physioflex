/**
 * Creates test accounts for development and demo purposes.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-test-accounts.mjs
 *
 * Creates:
 *   1. patient@test.physioflex   — patient role, full patient row
 *   2. therapist@test.physioflex — therapist role, linked to Susan Mubatapasango
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function upsertAuthUser({ email, password, role, firstName, lastName }) {
  // Delete existing if present so the script is idempotent
  const { data: existing } = await supabase.auth.admin.listUsers();
  const existingUser = existing?.users?.find((u) => u.email === email);
  if (existingUser) {
    await supabase.auth.admin.deleteUser(existingUser.id);
    console.log(`  Removed existing user: ${email}`);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, first_name: firstName, last_name: lastName },
  });

  if (error) throw new Error(`Auth user creation failed: ${error.message}`);
  return data.user;
}

// ─── 1. Patient ───────────────────────────────────────────────────────────────

console.log("\n── Creating patient test account ──────────────────────────────");

const PATIENT_EMAIL = "patient@test.physioflex";
const PATIENT_PASSWORD = "TestPatient123!";

try {
  const user = await upsertAuthUser({
    email: PATIENT_EMAIL,
    password: PATIENT_PASSWORD,
    role: "patient",
    firstName: "James",
    lastName: "Nakale",
  });

  // Ensure profile has correct role
  await supabase.from("profiles").update({ role: "patient" }).eq("id", user.id);

  // Create patient row (upsert by user_id)
  const { error: patientError } = await supabase.from("patients").upsert(
    {
      user_id: user.id,
      email: PATIENT_EMAIL,
      first_name: "James",
      last_name: "Nakale",
      phone: "+264 81 555 0001",
      whatsapp: "264815550001",
      date_of_birth: "1990-03-15",
      gender: "Male",
      address: "14 Strand Street",
      suburb: "Swakopmund",
      medical_aid_name: "NHP",
      medical_aid_number: "NHP-987654",
    },
    { onConflict: "user_id" }
  );

  if (patientError) throw new Error(`Patient row failed: ${patientError.message}`);

  console.log(`  Email:    ${PATIENT_EMAIL}`);
  console.log(`  Password: ${PATIENT_PASSWORD}`);
  console.log(`  Name:     James Nakale`);
  console.log(`  Role:     patient`);
  console.log(`  Portal:   /portal`);
} catch (err) {
  console.error("  ERROR:", err.message);
}

// ─── 2. Therapist ─────────────────────────────────────────────────────────────

console.log("\n── Creating therapist test account ────────────────────────────");

const THERAPIST_EMAIL = "therapist@test.physioflex";
const THERAPIST_PASSWORD = "TestTherapist123!";

try {
  const user = await upsertAuthUser({
    email: THERAPIST_EMAIL,
    password: THERAPIST_PASSWORD,
    role: "therapist",
    firstName: "Susan",
    lastName: "Mubatapasango",
  });

  // Ensure profile has therapist role
  await supabase.from("profiles").update({ role: "therapist" }).eq("id", user.id);

  // Link to Susan's therapist record (find by name)
  const { data: therapist } = await supabase
    .from("therapists")
    .select("id, first_name, last_name")
    .eq("first_name", "Susan")
    .eq("last_name", "Mubatapasango")
    .maybeSingle();

  if (therapist) {
    const { error: linkError } = await supabase
      .from("therapists")
      .update({ user_id: user.id })
      .eq("id", therapist.id);

    if (linkError) {
      console.warn(`  Warning: could not link therapist row: ${linkError.message}`);
    } else {
      console.log(`  Linked to therapist record: ${therapist.first_name} ${therapist.last_name}`);
    }
  } else {
    console.warn("  Warning: Susan Mubatapasango not found in therapists table — account created but not linked.");
  }

  console.log(`  Email:    ${THERAPIST_EMAIL}`);
  console.log(`  Password: ${THERAPIST_PASSWORD}`);
  console.log(`  Name:     Susan Mubatapasango`);
  console.log(`  Role:     therapist`);
  console.log(`  Portal:   /portal`);
} catch (err) {
  console.error("  ERROR:", err.message);
}

console.log("\n✓ Done. See TEST_ACCOUNTS.md for the full testing guide.\n");
process.exit(0);
