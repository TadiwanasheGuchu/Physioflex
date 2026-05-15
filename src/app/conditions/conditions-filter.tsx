"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { type Condition, type ConditionCategory, categoryMeta } from "@/lib/conditions-data";

const categories: { value: ConditionCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "musculoskeletal", label: "Musculoskeletal" },
  { value: "sports", label: "Sports" },
  { value: "neurological", label: "Neurological" },
  { value: "post-surgical", label: "Post-Surgical" },
  { value: "paediatric", label: "Paediatric" },
];

export function ConditionsFilter({ conditions }: { conditions: Condition[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ConditionCategory | "all">("all");

  const filtered = conditions.filter((c) => {
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    const matchesQuery =
      query.trim() === "" ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-[#f6f9fc] py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Search */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748d]"
          />
          <input
            type="text"
            placeholder="Search conditions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm text-[#0d253d] placeholder:text-[#64748d] bg-white border border-[#a8c3de] rounded-lg focus:outline-none focus:border-[#0d9488] transition-colors"
            style={{ fontWeight: 300 }}
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className="text-sm px-4 py-2 rounded-full border transition-colors"
                style={{
                  background: active ? "#0d9488" : "#f0fdfa",
                  color: active ? "#ffffff" : "#0d9488",
                  borderColor: active ? "#0d9488" : "#99f6e4",
                  fontWeight: 400,
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#64748d]" style={{ fontWeight: 300 }}>
            No conditions found for &ldquo;{query}&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((condition) => {
              const meta = categoryMeta[condition.category];
              return (
                <article
                  key={condition.id}
                  className="bg-white rounded-xl border border-[#e3e8ee] p-6 flex flex-col"
                  style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
                >
                  {/* Category tag */}
                  <span
                    className="self-start text-xs px-2.5 py-1 rounded-full mb-4"
                    style={{ background: meta.bg, color: meta.text, fontWeight: 400 }}
                  >
                    {meta.label}
                  </span>

                  <h3
                    className="text-lg text-[#0d253d] mb-2"
                    style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
                  >
                    {condition.name}
                  </h3>

                  <p
                    className="text-sm text-[#64748d] leading-6 mb-5 flex-1"
                    style={{ fontWeight: 300 }}
                  >
                    {condition.description}
                  </p>

                  {/* Symptoms */}
                  <div className="mb-5">
                    <p className="text-xs text-[#0d253d] font-medium mb-2">Common symptoms</p>
                    <ul className="space-y-1">
                      {condition.symptoms.slice(0, 3).map((s) => (
                        <li
                          key={s}
                          className="text-xs text-[#64748d] flex items-start gap-2"
                          style={{ fontWeight: 300 }}
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#0d9488] shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/conditions/${condition.id}`}
                    className="inline-flex items-center text-sm text-[#0d9488] hover:text-[#0f766e] transition-colors"
                    style={{ fontWeight: 400 }}
                  >
                    Learn more & book →
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
