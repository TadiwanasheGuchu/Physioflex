"use client";

import { useState, useMemo } from "react";
import { Star, BadgeCheck, ChevronDown } from "lucide-react";

interface Review {
  id: string;
  display_name: string;
  suburb: string | null;
  rating: number;
  body: string;
  verified_patient: boolean;
  created_at: string;
  admin_reply: string | null;
  service_name: string | null;
}

interface Props {
  reviews: Review[];
  services: string[];
}

type Sort = "recent" | "highest" | "helpful";

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.body.length > 200;
  const displayBody = isLong && !expanded ? `${review.body.slice(0, 200)}…` : review.body;

  const date = new Date(review.created_at);
  const dateStr = date.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "text-[#f59e0b] fill-[#f59e0b]" : "text-gray-200 fill-gray-200"}`} />
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-1.5">
            {review.verified_patient && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ccfbf1] text-[#0f766e]">
                <BadgeCheck className="w-3 h-3" /> Verified Patient
              </span>
            )}
            {review.service_name && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-[#f0f4f8] text-[#64748d]">
                {review.service_name}
              </span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-[#6b7a99]">{dateStr}</p>
        </div>
      </div>

      {/* Name + suburb */}
      <p className="text-sm font-medium text-[#0d253d] mb-2">
        {review.display_name}{review.suburb ? ` — ${review.suburb}` : ""}
      </p>

      {/* Body */}
      <p className="text-sm text-[#64748d] leading-7" style={{ fontWeight: 300 }}>
        &ldquo;{displayBody}&rdquo;
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1.5 text-xs text-[#0d9488] hover:underline flex items-center gap-0.5"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Admin reply */}
      {review.admin_reply && (
        <div className="mt-4 pl-4 border-l-2 border-[#0d9488] bg-[#f0fdfa] rounded-r-lg py-3 pr-3">
          <p className="text-xs font-semibold text-[#0d9488] mb-1">Response from Physioflex</p>
          <p className="text-xs text-[#64748d] leading-relaxed">{review.admin_reply}</p>
        </div>
      )}
    </div>
  );
}

export function ReviewsList({ reviews, services }: Props) {
  const [starFilter, setStarFilter] = useState(0);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sort, setSort] = useState<Sort>("recent");

  const filtered = useMemo(() => {
    let list = reviews.filter((r) => {
      if (starFilter > 0 && r.rating !== starFilter) return false;
      if (serviceFilter !== "all" && r.service_name !== serviceFilter) return false;
      return true;
    });

    if (sort === "recent") list = [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (sort === "highest") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [reviews, starFilter, serviceFilter, sort]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Star filter */}
        <div className="flex gap-1 bg-white border border-[#e3e8ee] rounded-xl p-1">
          <button
            onClick={() => setStarFilter(0)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${starFilter === 0 ? "bg-[#0d253d] text-white font-medium" : "text-[#6b7a99] hover:text-[#0d253d]"}`}
          >
            All
          </button>
          {[5, 4, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStarFilter(s)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${starFilter === s ? "bg-[#0d253d] text-white font-medium" : "text-[#6b7a99] hover:text-[#0d253d]"}`}
            >
              {s}<Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Service filter */}
        {services.length > 0 && (
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-xs border border-[#e3e8ee] rounded-xl bg-white text-[#0d253d] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
            >
              <option value="all">All Services</option>
              {services.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b7a99] pointer-events-none" />
          </div>
        )}

        {/* Sort */}
        <div className="relative ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="appearance-none pl-3 pr-7 py-2 text-xs border border-[#e3e8ee] rounded-xl bg-white text-[#0d253d] focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6b7a99] pointer-events-none" />
        </div>
      </div>

      <p className="text-xs text-[#6b7a99] mb-4">{filtered.length} reviews</p>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e3e8ee] p-8 text-center text-sm text-[#6b7a99]">
            No reviews match your filters.
          </div>
        ) : (
          filtered.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </div>
  );
}
