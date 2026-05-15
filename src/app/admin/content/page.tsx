import { createClient } from "@/lib/supabase/server";
import { ContentManager } from "./content-manager";
import { blogPosts } from "@/lib/blog-data";

export default async function AdminContentPage() {
  const supabase = await createClient();
  const db = supabase as any;

  const [{ data: services }, { data: reviews }] = await Promise.all([
    db
      .from("services")
      .select("id, name, description, duration_min, price_nad, is_active")
      .order("name"),
    db
      .from("reviews")
      .select("id, display_name, rating, body, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 700 }}>Content</h1>
        <p className="text-sm text-[#6b7a99] mt-1">Manage services, blog posts, and reviews</p>
      </div>
      <ContentManager
        services={services ?? []}
        reviews={reviews ?? []}
        blogPosts={blogPosts}
      />
    </div>
  );
}
