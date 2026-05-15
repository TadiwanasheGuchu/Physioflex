interface PageHeroProps {
  eyebrow?: string;
  headline: string;
  subtext?: string;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, headline, subtext, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-16 md:pt-32 md:pb-20">
      {/* Gradient mesh */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-40"
        aria-hidden
        style={{
          background:
            "linear-gradient(135deg, #f5e9d4 0%, #ccfbf1 25%, #e0e7ff 50%, #0d9488 75%, #fce7f3 100%)",
          filter: "blur(48px)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {eyebrow && (
          <p
            className="text-xs font-medium tracking-widest text-[#0d9488] uppercase mb-4"
          >
            {eyebrow}
          </p>
        )}
        <h1
          className="text-4xl md:text-5xl text-[#0d253d] mb-4"
          style={{ fontWeight: 300, letterSpacing: "-0.96px" }}
        >
          {headline}
        </h1>
        {subtext && (
          <p
            className="text-base text-[#64748d] max-w-2xl mx-auto leading-7"
            style={{ fontWeight: 300 }}
          >
            {subtext}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
