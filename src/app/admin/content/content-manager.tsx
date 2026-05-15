"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Star, FileText, Settings, MessageSquare } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";
import { approveReview, rejectReview, replyToReview } from "./review-actions";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  price_nad: number;
  is_active: boolean;
}

interface Review {
  id: string;
  display_name: string;
  rating: number;
  body: string;
  status: string;
  created_at: string;
}

interface Props {
  services: Service[];
  reviews: Review[];
  blogPosts: BlogPost[];
}

type Tab = "services" | "blog" | "reviews";

function ServicesTab({ services }: { services: Service[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e8ee]">
        <h2 className="text-sm font-semibold text-[#0d253d]">Services ({services.length})</h2>
        <p className="text-xs text-[#6b7a99]">Edit prices and durations in Supabase dashboard</p>
      </div>
      <div className="divide-y divide-[#e3e8ee]">
        {services.map((s) => (
          <div key={s.id} className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm text-[#0d253d]">{s.name}</p>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                  s.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                  {s.is_active ? <CheckCircle className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                  {s.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              {s.description && <p className="text-xs text-[#6b7a99] mt-0.5 line-clamp-2">{s.description}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-[#0d253d]">N${s.price_nad}</p>
              <p className="text-xs text-[#6b7a99]">{s.duration_min} min</p>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-[#6b7a99]">No services found.</p>
        )}
      </div>
    </div>
  );
}

function BlogTab({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e8ee]">
        <h2 className="text-sm font-semibold text-[#0d253d]">Blog Posts ({posts.length})</h2>
        <p className="text-xs text-[#6b7a99]">Posts are managed in <code className="bg-gray-100 px-1 rounded">src/lib/blog-data.ts</code></p>
      </div>
      <div className="divide-y divide-[#e3e8ee]">
        {posts.map((post) => (
          <div key={post.slug} className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#0d253d] line-clamp-1">{post.title}</p>
              <p className="text-xs text-[#6b7a99] mt-0.5">
                {post.category} · {post.author} · {post.readTime}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                Published
              </span>
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0d9488] hover:underline"
              >
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [isPending, startTransition] = useTransition();
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-medium text-sm text-[#0d253d]">{review.display_name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${statusColor[review.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
            {review.status}
          </span>
          <span className="text-[10px] text-[#6b7a99]">
            {new Date(review.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
          </span>
        </div>
      </div>

      <p className="text-xs text-[#6b7a99] leading-relaxed">{review.body}</p>

      {/* Moderation actions */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {review.status !== "approved" && (
          <button
            onClick={() => startTransition(() => approveReview(review.id))}
            disabled={isPending}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <CheckCircle className="w-3 h-3" /> Approve
          </button>
        )}
        {review.status !== "rejected" && (
          <button
            onClick={() => startTransition(() => rejectReview(review.id))}
            disabled={isPending}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-3 h-3" /> Reject
          </button>
        )}
        <button
          onClick={() => setReplyOpen(!replyOpen)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-[#e3e8ee] text-[#6b7a99] hover:text-[#0d253d] hover:bg-[#f6f9fc] transition-colors"
        >
          <MessageSquare className="w-3 h-3" /> {replyOpen ? "Cancel" : "Reply"}
        </button>
      </div>

      {replyOpen && (
        <div className="mt-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            placeholder="Type your clinic response…"
            className="w-full px-3 py-2 text-xs border border-[#e3e8ee] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] resize-none"
          />
          <button
            onClick={() => {
              if (!replyText.trim()) return;
              startTransition(async () => {
                await replyToReview(review.id, replyText.trim());
                setReplyOpen(false);
                setReplyText("");
              });
            }}
            disabled={isPending || !replyText.trim()}
            className="mt-1.5 px-3 py-1.5 text-xs font-medium bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-colors disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save Reply"}
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const filtered = reviews.filter((r) => filter === "all" || r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e8ee]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#0d253d]">Reviews ({reviews.length})</h2>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-800">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex gap-1 bg-[#f6f9fc] rounded-lg p-1">
          {(["pending", "all", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors capitalize ${
                filter === f ? "bg-white text-[#0d253d] shadow-sm font-medium" : "text-[#6b7a99] hover:text-[#0d253d]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-[#e3e8ee]">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#6b7a99]">No {filter === "all" ? "" : filter} reviews.</p>
        ) : (
          filtered.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </div>
  );
}

export function ContentManager({ services, reviews, blogPosts }: Props) {
  const [tab, setTab] = useState<Tab>("services");

  const tabs = [
    { id: "services" as Tab, label: "Services", icon: Settings, count: services.length },
    { id: "blog" as Tab, label: "Blog Posts", icon: FileText, count: blogPosts.length },
    { id: "reviews" as Tab, label: "Reviews", icon: MessageSquare, count: reviews.length },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-[#e3e8ee] rounded-xl p-1 mb-5 shadow-sm">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 flex-1 justify-center px-4 py-2.5 rounded-lg text-sm transition-colors ${
              tab === id
                ? "bg-[#0d253d] text-white font-medium"
                : "text-[#6b7a99] hover:text-[#0d253d] hover:bg-[#f6f9fc]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              tab === id ? "bg-white/20 text-white" : "bg-[#f6f9fc] text-[#6b7a99]"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {tab === "services" && <ServicesTab services={services} />}
      {tab === "blog" && <BlogTab posts={blogPosts} />}
      {tab === "reviews" && <ReviewsTab reviews={reviews} />}
    </div>
  );
}
