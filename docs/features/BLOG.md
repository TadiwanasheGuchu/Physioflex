# Feature Spec — Health Blog & Tips

## Goal
Establish Physioflex as the authority on physiotherapy and movement health in Namibia. Blog content drives organic Google traffic ("exercises for back pain Namibia", "physiotherapy after ACL surgery") and gives patients a reason to return between appointments.

## Pages
- `/blog` — listing page with filter by category
- `/blog/[slug]` — individual article page
- **Homepage teaser** — 3 latest articles, compact card layout

---

## Homepage Teaser (Section)
- Placed before the **Booking CTA** section
- Eyebrow: "HEALTH TIPS & INSIGHTS"
- Headline: "Move better with expert advice"
- 3 cards in a row (2-up on tablet, 1-up on mobile)
- CTA: "Read all articles →" linking to `/blog`

### Teaser card anatomy
```
[Cover image — 200px height, object-cover, rounded-t-xl]
[Category tag pill]
Article title — display-md weight 300
Date + read time — caption, text-[#64748d]
One-line excerpt
[Read more →]
```

---

## Blog Listing Page (`/blog`)

### Hero
- Minimal — no gradient mesh needed here
- White bg, large headline "Health Blog", short intro paragraph
- Category filter pill bar: All | Injury Prevention | Recovery Tips | Exercise | Lifestyle | Namibia Health

### Article Grid
- 3-column desktop, 2-column tablet, 1-column mobile
- Infinite scroll or pagination (12 per page)
- Featured article at top: full-width card with large image

---

## Article Page (`/blog/[slug]`)

### Layout
```
[Back link: ← Blog]
[Category tag pill]
[Headline — display-xl weight 300]
[Author: Photo + Name + "Physiotherapist at Physioflex" + Date + Read time]
[Hero image — full width, 400px height, object-cover]
[Article body — max-width 720px, centred]
[Share: WhatsApp | Facebook | Copy link]  ← WhatsApp important in Namibia
[Related articles — 3 cards]
[CTA: "Ready to start treatment? Book an appointment →"]
```

### Typography for article body
- `h2` — `text-2xl` weight 300 `text-[#0d253d]`
- `p` — `text-base` weight 300 `text-[#64748d]` leading-8
- `ul/ol` — same weight, bullet in `#0d9488`
- `strong` — weight 500 `text-[#0d253d]`
- Blockquote — left border `#0d9488` 4px, bg `#f0fdfa`, italic, padded

---

## Content Strategy — First 6 Articles to Build

| Slug | Title | Category |
|---|---|---|
| `lower-back-pain-exercises` | 5 exercises for lower back pain you can do at home | Injury Prevention |
| `after-acl-surgery-namibia` | What to expect in ACL surgery recovery | Recovery Tips |
| `dry-needling-explained` | Dry needling: what it is and who it helps | Education |
| `desk-posture-swakopmund` | Desk worker's guide to avoiding neck and shoulder pain | Lifestyle |
| `sports-warm-up-routine` | The warm-up routine every Namibian athlete should know | Exercise |
| `how-many-physio-sessions` | How many physiotherapy sessions do I actually need? | FAQ |

---

## Content Format
- Use MDX files stored in `content/blog/[slug].mdx`
- Frontmatter:

```yaml
---
title: "5 exercises for lower back pain you can do at home"
excerpt: "Lower back pain is one of the most common conditions we treat at Physioflex..."
category: "Injury Prevention"
author: "Anri van der Berg"
authorTitle: "Senior Physiotherapist"
publishedAt: "2026-05-15"
readTime: "5 min"
coverImage: "https://images.pexels.com/photos/XXXXXX/..."
---
```

---

## SEO Strategy
- Title tag: `[Article Title] | Physioflex Swakopmund`
- Each article targets a long-tail keyword specific to Namibia/Swakopmund where possible
- WhatsApp share button is critical — WhatsApp is the dominant social sharing platform in Namibia

---

## Design Tokens
- Section bg: white
- Category pill: colour-coded by category (same system as CONDITIONS.md)
- Article card: `card-feature-light` — white bg, border, shadow level 1
- CTA within articles: `button-primary-pill`

---

## Dependencies
- `next-mdx-remote` or built-in Next.js MDX support (`@next/mdx`)
- `gray-matter` for frontmatter parsing
- `reading-time` for read time estimate
