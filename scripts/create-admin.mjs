/**
 * One-time script to create an admin user in Supabase.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-admin.mjs <email> <password> [display-name]
 *
 * Example:
 *   node --env-file=.env.local scripts/create-admin.mjs admin@physioflex.com MySecurePass123 "Admin User"
 */

import { createClient } from "@supabase/supabase-js";

const [, , email, password, displayName = "Admin"] = process.argv;

if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/create-admin.mjs <email> <password> [display-name]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log(`Creating admin user: ${email}...`);

// Create the auth user with role=admin in metadata.
// The handle_new_user() trigger will read this and create the profile with role='admin'.
const { data: authData, error: authError } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: { role: "admin", full_name: displayName },
});

if (authError) {
  console.error("Failed to create auth user:", authError.message);
  process.exit(1);
}

const userId = authData.user.id;
console.log(`Auth user created: ${userId}`);

// Ensure the profile role is admin (belt-and-suspenders in case the trigger ran first with wrong role).
const { error: profileError } = await supabase
  .from("profiles")
  .update({ role: "admin" })
  .eq("id", userId);

if (profileError) {
  console.error("Warning: could not verify profile role:", profileError.message);
} else {
  console.log("Profile role confirmed as admin.");
}

console.log("\nAdmin user created successfully:");
console.log(`  Email:   ${email}`);
console.log(`  Name:    ${displayName}`);
console.log(`  User ID: ${userId}`);
console.log("\nLog in at /auth/login and access the admin panel at /admin");

process.exit(0);
