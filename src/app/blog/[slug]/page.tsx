import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { blogPosts, categoryMeta, type ContentBlock } from "@/lib/blog-data";
import { ShareButtons } from "./share-buttons";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://physioflex.na/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://physioflex.na/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          className="text-2xl text-[#0d253d] mt-10 mb-4"
          style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p className="text-base text-[#64748d] leading-8 mb-4" style={{ fontWeight: 300 }}>
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2 mb-6">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-base text-[#64748d]" style={{ fontWeight: 300 }}>
              <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0" />
              <span className="leading-7">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          className="border-l-4 border-[#0d9488] bg-[#f0fdfa] rounded-r-lg px-6 py-4 my-6 italic text-[#0d253d] text-base leading-7"
          style={{ fontWeight: 300 }}
        >
          {block.text}
        </blockquote>
      );
    case "cta":
      return (
        <div className="bg-[#0d253d] rounded-xl p-6 my-8 text-center">
          <p className="text-white text-sm mb-4" style={{ fontWeight: 300 }}>
            {block.text}
          </p>
          <Link
            href="/#booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
          >
            Book an Appointment
          </Link>
        </div>
      );
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const catMeta = categoryMeta[post.category];
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Article header */}
        <section className="relative overflow-hidden bg-white pt-24 pb-10 md:pt-32">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-40"
            aria-hidden
            style={{
              background: "linear-gradient(135deg, #f5e9d4 0%, #ccfbf1 25%, #e0e7ff 50%, #0d9488 75%, #fce7f3 100%)",
              filter: "blur(48px)",
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-[#64748d] hover:text-[#0d253d] transition-colors mb-8"
              style={{ fontWeight: 300 }}
            >
              <ArrowLeft size={14} />
              Blog
            </Link>

            <span
              className="inline-block text-xs px-2.5 py-1 rounded-full mb-4"
              style={{ background: catMeta.bg, color: catMeta.text, fontWeight: 400 }}
            >
              {post.category}
            </span>

            <h1
              className="text-4xl md:text-5xl text-[#0d253d] mb-6"
              style={{ fontWeight: 300, letterSpacing: "-0.96px" }}
            >
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.authorTitle}</span>
              <span>·</span>
              <span>{post.publishedAt}</span>
              <span>·</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </section>

        {/* Cover image */}
        <div className="max-w-3xl mx-auto px-6 pb-8">
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
            <Image
              src={`${post.coverImage}?auto=compress&cs=tinysrgb&w=900`}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-6 pb-12">
          {post.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}

          <ShareButtons title={post.title} />
        </div>

        {/* Related articles */}
        <section className="bg-[#f6f9fc] py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2
              className="text-2xl text-[#0d253d] mb-8"
              style={{ fontWeight: 300, letterSpacing: "-0.26px" }}
            >
              More articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => {
                const relMeta = categoryMeta[p.category];
                return (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                    <article
                      className="bg-white rounded-xl border border-[#e3e8ee] overflow-hidden"
                      style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
                    >
                      <div className="relative h-36 overflow-hidden">
                        <Image
                          src={`${p.coverImage}?auto=compress&cs=tinysrgb&w=400`}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="33vw"
                        />
                      </div>
                      <div className="p-4">
                        <span
                          className="inline-block text-xs px-2 py-0.5 rounded-full mb-2"
                          style={{ background: relMeta.bg, color: relMeta.text, fontWeight: 400 }}
                        >
                          {p.category}
                        </span>
                        <p
                          className="text-sm text-[#0d253d] group-hover:text-[#0d9488] transition-colors"
                          style={{ fontWeight: 300 }}
                        >
                          {p.title}
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
