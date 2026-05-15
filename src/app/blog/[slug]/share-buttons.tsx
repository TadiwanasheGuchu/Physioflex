"use client";

export function ShareButtons({ title }: { title: string }) {
  const waText = encodeURIComponent(`Check out this article from Physioflex: ${title}`);

  return (
    <div className="border-t border-[#e3e8ee] pt-8 mt-8">
      <p className="text-sm text-[#64748d] mb-4" style={{ fontWeight: 300 }}>
        Share this article:
      </p>
      <div className="flex gap-3 flex-wrap">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-[#25D366] text-white hover:bg-[#1fb855] transition-colors"
          style={{ fontWeight: 400 }}
        >
          WhatsApp
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-[#e3e8ee] text-[#64748d] hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
          style={{ fontWeight: 400 }}
        >
          Copy link
        </button>
      </div>
    </div>
  );
}
