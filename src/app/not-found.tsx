import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f9fc] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-[#f0fdfa] flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-[#0d9488]" style={{ fontWeight: 300 }}>404</span>
        </div>
        <h1 className="text-2xl text-[#0d253d] mb-3" style={{ fontWeight: 300, letterSpacing: "-0.26px" }}>
          Page not found
        </h1>
        <p className="text-sm text-[#64748d] mb-8" style={{ fontWeight: 300 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0d9488] text-white text-sm hover:bg-[#0f766e] transition-colors"
          style={{ fontWeight: 400 }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
