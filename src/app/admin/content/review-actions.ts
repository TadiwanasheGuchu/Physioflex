"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function approveReview(id: string) {
  const supabase = createAdminClient();
  const db = supabase as any;
  await db.from("reviews").update({ status: "approved" }).eq("id", id);
  revalidatePath("/admin/content");
  revalidatePath("/reviews");
}

export async function rejectReview(id: string) {
  const supabase = createAdminClient();
  const db = supabase as any;
  await db.from("reviews").update({ status: "rejected" }).eq("id", id);
  revalidatePath("/admin/content");
}

export async function replyToReview(id: string, reply: string) {
  const supabase = createAdminClient();
  const db = supabase as any;
  await db.from("reviews").update({
    admin_reply: reply,
    admin_replied_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/content");
  revalidatePath("/reviews");
}
