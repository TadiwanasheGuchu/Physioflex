import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Physioflex — Expert Physiotherapy in Swakopmund, Namibia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0d253d",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Gradient mesh blob */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, #0d9488 0%, transparent 70%)",
            opacity: 0.35,
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#0d9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontSize: 24, fontWeight: 700 }}>P</span>
          </div>
          <span style={{ color: "white", fontSize: 32, fontWeight: 300, letterSpacing: "-0.5px" }}>
            Physioflex
          </span>
        </div>

        {/* Headline */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p
            style={{
              color: "#0d9488",
              fontSize: 18,
              fontWeight: 400,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Expert Physiotherapy
          </p>
          <h1
            style={{
              color: "white",
              fontSize: 64,
              fontWeight: 300,
              letterSpacing: "-1.4px",
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 700,
            }}
          >
            Swakopmund&apos;s trusted physiotherapy clinic
          </h1>
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 48 }}>
          <div style={{ display: "flex", gap: 24 }}>
            {["Sports Rehab", "Pain Management", "Manual Therapy", "Post-Surgery"].map((s) => (
              <span
                key={s}
                style={{
                  color: "#64748d",
                  fontSize: 15,
                  fontWeight: 300,
                  padding: "6px 16px",
                  border: "1px solid #1e3a5a",
                  borderRadius: 9999,
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <span style={{ color: "#64748d", fontSize: 15, fontWeight: 300 }}>physioflex.na</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
