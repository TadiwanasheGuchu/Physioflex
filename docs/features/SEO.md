# Feature Spec — Local SEO & Google Maps

## Goal
Rank #1 on Google when someone in Swakopmund searches "physiotherapy Swakopmund", "physio near me Namibia", or condition-specific queries like "back pain physio Swakopmund". Local SEO is the highest-ROI marketing channel for a clinic.

---

## Google Maps Integration

### Homepage — Map Section
- Embed Google Maps showing Physioflex clinic location in Swakopmund
- Section placed in Footer or just above Footer
- Map with custom teal marker pin
- Alongside map: address, phone, WhatsApp, hours

```tsx
// Use Google Maps Embed API (no API key needed for basic embed)
// <iframe> embed approach — simplest, no JS library needed
// Or: @vis.gl/react-google-maps for interactive map with custom marker

<iframe
  src="https://www.google.com/maps/embed?pb=...PLACE_ID..."
  width="100%"
  height="400"
  loading="lazy"
  className="rounded-xl border border-[#e3e8ee]"
/>
```

### Contact Page (`/contact`)
- Full-width map (600px height on desktop)
- Directions button: opens Google Maps app on mobile
- "Get Directions" → `https://maps.google.com/?q=Physioflex+Swakopmund`

---

## Google Business Profile
- Ensure Google Business Profile is claimed and verified for Physioflex
- NAP consistency (Name, Address, Phone) must match exactly across:
  - Website footer
  - Google Business Profile
  - All directory listings
- Categories: "Physiotherapist", "Physical Therapy Clinic", "Sports Medicine Clinic"
- Add photos to Google Business Profile (use gallery photos)
- Enable Google Reviews — link from website Reviews section

---

## Structured Data (Schema.org)

### LocalBusiness Schema (in `layout.tsx`)
```json
{
  "@context": "https://schema.org",
  "@type": "PhysicalTherapist",
  "name": "Physioflex",
  "image": "https://physioflex.na/og-image.jpg",
  "url": "https://physioflex.na",
  "telephone": "+264640000000",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Sam Nujoma Avenue",
    "addressLocality": "Swakopmund",
    "addressRegion": "Erongo",
    "addressCountry": "NA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -22.6785,
    "longitude": 14.5252
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "17:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "08:00", "closes": "13:00" }
  ],
  "priceRange": "N$350 – N$750"
}
```

### MedicalCondition Schema (for each condition page)
```json
{
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  "name": "Lower Back Pain",
  "description": "...",
  "possibleTreatment": {
    "@type": "MedicalTherapy",
    "name": "Physiotherapy",
    "provider": { "@type": "PhysicalTherapist", "name": "Physioflex" }
  }
}
```

---

## Meta Tags Strategy

### Homepage
```tsx
// In layout.tsx — already partially done
export const metadata = {
  title: "Physioflex | Expert Physiotherapy in Swakopmund, Namibia",
  description: "Book expert physiotherapy in Swakopmund. Sports rehab, pain management, manual therapy. HPCNA registered. Walk-ins & medical aid welcome.",
  openGraph: {
    title: "Physioflex | Expert Physiotherapy in Swakopmund",
    description: "...",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_NA",
    type: "website",
  },
  twitter: { card: "summary_large_image", ... },
  alternates: { canonical: "https://physioflex.na" },
};
```

### Per-Page Metadata
- Each `/conditions/[slug]` page: title = "[Condition] Treatment | Physioflex Swakopmund"
- Each `/blog/[slug]` page: title = "[Article Title] | Physioflex"
- `/team` page: title = "Our Physiotherapy Team | Physioflex Swakopmund"

---

## Page Speed (Core Web Vitals)
- Target: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Next.js Image component: already using (hero image optimised)
- Font: Inter via next/font (no FOUT)
- `priority` prop on hero image: already set
- Lazy load below-fold images: `loading="lazy"` default on non-priority images

---

## URL Structure
```
/                           → Homepage
/team                       → Team
/conditions                 → All conditions
/conditions/lower-back-pain → Condition detail (slug)
/blog                       → Blog listing
/blog/[slug]                → Article
/gallery                    → Gallery
/resources                  → Patient resources
/book                       → Booking
/contact                    → Contact + map
/privacy                    → Privacy policy
```

All slugs: lowercase, hyphenated, no trailing slashes.

---

## Sitemap & Robots
```tsx
// app/sitemap.ts — Next.js App Router built-in
export default function sitemap() {
  return [
    { url: "https://physioflex.na", lastModified: new Date() },
    { url: "https://physioflex.na/team", lastModified: new Date() },
    // ... dynamic: conditions, blog posts from CMS
  ];
}

// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/portal", "/api"] },
    sitemap: "https://physioflex.na/sitemap.xml",
  };
}
```

---

## Local Directory Listings
Submit Physioflex NAP to:
- Google Business Profile (priority #1)
- Yellow Pages Namibia (yellowpages.com.na)
- Namibia Business Directory
- Yelp (international)
- Foursquare

---

## Dependencies
- `next-sitemap` OR built-in Next.js `sitemap.ts` (App Router — no package needed)
- Google Maps Embed API (free, no key needed for basic embed)
- `@vis.gl/react-google-maps` (optional, for interactive map with custom marker)
