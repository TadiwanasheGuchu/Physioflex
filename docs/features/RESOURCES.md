# Feature Spec — Patient Resources & Exercise Library

## Goal
Give patients value between appointments. A resource library of home exercises, recovery guides, and educational PDFs keeps patients engaged, accelerates recovery, and positions Physioflex as a partner in long-term health — not just a one-time service.

This is the biggest differentiator among physiotherapy websites in Namibia, where very few clinics provide digital resources at all.

## Pages & Sections
- **Homepage teaser** — compact 3-card preview of featured resources
- **Full resources page** — `/resources`

---

## Homepage Teaser (Section)
- Placed between **Blog** and **Booking CTA** (or after Blog teaser)
- Eyebrow: "PATIENT RESOURCES"
- Headline: "Your recovery doesn't stop at the clinic door"
- 3 resource cards in a row (1-up on mobile)
- CTA: "Browse all resources →" linking to `/resources`

### Resource teaser card anatomy
```
[Icon — 32px, teal, inside rounded square bg-[#f0fdfa]]
Resource type tag pill (PDF / Video / Guide)
Title — display-md weight 300
One-line description
[Download / Watch →]
```

---

## Full Resources Page (`/resources`)

### Hero
- Minimal hero, white bg
- Headline: "Resources for patients"
- Subtext: "Exercises, guides, and tools to support your recovery at home."
- Search input + category filter bar

### Filter Bar
```
All | Exercise Videos | Downloadable PDFs | Recovery Guides | Post-Treatment Care
```

### Resource Grid
- 3-column desktop, 2-column tablet, 1-column mobile
- Each card: `card-feature-light` style

---

## Resource Types

### Exercise Videos (embedded, not hosted)
- Host on YouTube (unlisted) or Vimeo
- Embed via `<iframe>` or Next.js-compatible video component
- Thumbnail preview with play button overlay

Each video card:
```
[Video thumbnail with play icon overlay]
[Category tag]
Exercise title
Duration + difficulty (Beginner / Intermediate / Advanced)
Body area tags: Lower Back | Neck | Knee | Shoulder | Hip | Core
[Watch exercise →]
```

### Downloadable PDFs
- Store in `/public/resources/` or S3 bucket (link out)
- PDF cards include a small PDF icon and file size

Each PDF card:
```
[PDF icon — teal]
[Category tag: "Exercise Sheet" / "Education Guide" / "Post-Surgery Protocol"]
Document title
Description — 1 line
File size
[Download PDF ↓]
```

### Recovery Guides (in-page reading)
- Long-form content, similar to blog posts but more clinical
- Written by the physiotherapists
- Include diagrams/illustrations

---

## Initial Resource Library (12 items to build first)

| Type | Title | Category | Body Area |
|---|---|---|---|
| PDF | Lower back strengthening programme | Exercise Sheet | Lower Back |
| PDF | Post-knee replacement: weeks 1–6 guide | Post-Surgery | Knee |
| PDF | Cervical spine stretches for desk workers | Exercise Sheet | Neck |
| PDF | Rotator cuff rehabilitation phase 1 | Post-Surgery | Shoulder |
| Video | 7-minute morning mobility routine | Exercise Video | Full Body |
| Video | Hip flexor release — 3 exercises | Exercise Video | Hip |
| Video | Scapular stabilisation exercises | Exercise Video | Shoulder |
| Guide | Understanding your physiotherapy report | Education | General |
| Guide | What is dry needling? | Education | General |
| Guide | Ice vs Heat: when to use which | Education | General |
| Guide | Returning to sport after injury | Recovery | Sports |
| Guide | Managing pain at home between sessions | Recovery | General |

---

## Data Structure

```ts
interface Resource {
  id: string;
  type: "pdf" | "video" | "guide";
  title: string;
  description: string;
  category: string;
  bodyArea: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  duration?: string; // for videos e.g. "7 min"
  fileSize?: string; // for PDFs e.g. "1.2 MB"
  url: string; // video embed URL or PDF download URL
  thumbnail?: string; // image URL for video cards
  featured: boolean;
  publishedAt: string;
}
```

---

## Access Control (Phase 2)
- Phase 1: All resources freely available (drives SEO and trust)
- Phase 2: Gate premium resources behind email signup (name + email → receive download link)
  - Use Sonner toast for success/error feedback (already installed)
  - Store leads in a simple serverless function (e.g. Resend, EmailJS)

---

## Design Tokens
- Resource type tags:
  - PDF: bg `#fce7f3` text `#9d174d`
  - Video: bg `#e0e7ff` text `#3730a3`
  - Guide: bg `#fdf4f0` text `#9b6829`
- Download button: `button-secondary` — outline style, pill, border `#0d9488`, text `#0d9488`
- Video thumbnail overlay: `bg-black/30` with white play circle in centre
- Featured badge: `pill-tag-soft` teal, positioned top-left on card

---

## Notes
- WhatsApp share on individual resources is critical for Namibian audience
- PDF resources should be bilingual (English + Afrikaans) for wider reach in Namibia
