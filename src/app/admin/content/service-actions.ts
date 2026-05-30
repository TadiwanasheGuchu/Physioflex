"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createService(data: {
  name: string;
  description: string;
  duration_min: number;
  price_nad: number;
}) {
  const supabase = createAdminClient();
  const db = supabase as any;
  const { error } = await db.from("services").insert({ ...data, is_active: true });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/content");
  revalidatePath("/book");
}

export async function updateService(
  id: string,
  data: {
    name: string;
    description: string;
    duration_min: number;
    price_nad: number;
    is_active: boolean;
  }
) {
  const supabase = createAdminClient();
  const db = supabase as any;
  const { error } = await db.from("services").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/content");
  revalidatePath("/book");
}

export async function deleteService(id: string) {
  const supabase = createAdminClient();
  const db = supabase as any;
  const { error } = await db.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/content");
  revalidatePath("/book");
}
