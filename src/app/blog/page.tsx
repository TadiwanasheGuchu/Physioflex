import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { blogPosts, categoryMeta } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Health Blog & Tips",
  description:
    "Expert physiotherapy advice, exercise tips, and recovery guides from the team at Physioflex Swakopmund.",
  alternates: { canonical: "https://physioflex.na/blog" },
  openGraph: { url: "https://physioflex.na/blog" },
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Health Tips & Insights"
          headline="Move better with expert advice"
          subtext="Evidence-based physiotherapy content from our registered practitioners in Swakopmund."
        />

        <section className="bg-[#f6f9fc] py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            {/* Featured article */}
            <Link
              href={`/blog/${featured.slug}`}
              className="block group mb-12"
            >
              <article
                className="bg-white rounded-2xl border border-[#e3e8ee] overflow-hidden md:flex"
                style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
              >
                <div className="relative md:w-2/5 h-56 md:h-auto shrink-0 overflow-hidden">
                  <Image
                    src={`${featured.coverImage}?auto=compress&cs=tinysrgb&w=700`}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span
                    className="self-start text-xs px-2.5 py-1 rounded-full mb-4"
                    style={{
                      background: categoryMeta[featured.category].bg,
                      color: categoryMeta[featured.category].text,
                      fontWeight: 400,
                    }}
                  >
                    {featured.category}
                  </span>
                  <h2
                    className="text-2xl md:text-3xl text-[#0d253d] mb-3 group-hover:text-[#0d9488] transition-colors"
                    style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
                  >
                    {featured.title}
                  </h2>
                  <p
                    className="text-sm text-[#64748d] leading-6 mb-4"
                    style={{ fontWeight: 300 }}
                  >
                    {featured.excerpt}
                  </p>
                  <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
                    {featured.author} · {featured.publishedAt} · {featured.readTime} read
                  </p>
                </div>
              </article>
            </Link>

            {/* Article grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => {
                const catMeta = categoryMeta[post.category];
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                    <article
                      className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden h-full flex flex-col"
                      style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={`${post.coverImage}?auto=compress&cs=tinysrgb&w=500`}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span
                          className="self-start text-xs px-2.5 py-1 rounded-full mb-3"
                          style={{ background: catMeta.bg, color: catMeta.text, fontWeight: 400 }}
                        >
                          {post.category}
                        </span>
                        <h3
                          className="text-base text-[#0d253d] mb-2 group-hover:text-[#0d9488] transition-colors flex-1"
                          style={{ fontWeight: 300, letterSpacing: "-0.2px" }}
                        >
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#64748d] mt-2" style={{ fontWeight: 300 }}>
                          {post.author} · {post.readTime} read
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
