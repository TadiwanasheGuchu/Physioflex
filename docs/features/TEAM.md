# Feature Spec — Meet the Team

## Goal
Build trust by putting real faces and credentials behind the Physioflex brand. Patients book with people, not clinics. This is the single highest-trust feature on a physiotherapy site.

## Pages & Sections
- **Homepage teaser** — 3-card horizontal strip, "Meet a few of our team" → links to `/team`
- **Full team page** — `/team` with all staff profiles

---

## Homepage Teaser (Section)
- Placed between **Services** and **About** sections
- 3 cards in a row (collapse to 1-up on mobile)
- Each card: circular photo, name, title, 2-3 specialisation tags, brief one-liner
- CTA below strip: "Meet the full team →" linking to `/team`

### Card anatomy
```
[Photo — circular, 96px]
Name (font weight 400, text-[#0d253d])
Title (font weight 300, text-[#64748d], e.g. "Senior Physiotherapist")
[tag pill] [tag pill]
```

---

## Full Team Page (`/team`)

### Hero
- Gradient mesh background (same as homepage hero)
- Headline: "The people behind your recovery"
- Subtext: "Our registered team brings expertise, care, and a genuine commitment to your wellbeing."

### Team grid
- 3-column on desktop, 2-column on tablet, 1-column on mobile
- Each card is a `card-feature-light` (border, shadow, 32px padding)
- Clicking a card expands or navigates to a detail view (Phase 2)

### Each Therapist Profile Card
```
[Photo — full-width top, 240px height, object-cover, rounded-t-xl]
[Content area — 32px padding]
  Name — display-md weight 300
  Title — body-md text-[#64748d]
  Registration — "HPCNA Reg. #XXXXXX" — caption size, text-[#64748d]
  ─────────────────────
  Specialisations (tag pills — teal bg)
  Languages spoken (tag pills — cream bg)
  ─────────────────────
  Bio — 2-3 sentences, body-md weight 300
  [Book with [Name] →] — pill CTA linking to #booking
```

---

## Data Structure (for when CMS/MDX is wired up)

```ts
interface TeamMember {
  id: string;
  name: string;
  title: string; // e.g. "Senior Physiotherapist"
  hpcnaNumber: string;
  photo: string; // URL
  specialisations: string[]; // e.g. ["Sports Rehab", "Dry Needling"]
  languages: string[]; // e.g. ["English", "Afrikaans", "German"]
  bio: string; // 2-3 sentences
  yearsExperience: number;
}
```

---

## Swakopmund Context
Swakopmund has a strong German-speaking community (historic German colonial settlement). Listing German, Afrikaans, and English as spoken languages is a meaningful differentiator — many local patients prefer treatment in their home language.

---

## Design Tokens to Use
- Card: `card-feature-light` — white bg, border `#e3e8ee`, `rounded-xl`, shadow level 1
- Specialisation tags: `pill-tag-soft` — bg `#ccfbf1`, text `#0f766e`
- Language tags: bg `#fdf4f0`, text `#9b6829` (warm cream tone)
- CTA: `button-primary-pill` — bg `#0d9488`, text white, `rounded-full`
- Photo container: `rounded-t-xl overflow-hidden`, `object-cover object-top`

---

## Placeholder Content (use until real photos/bios provided)
- 4 team members minimum
- Use Pexels images (search "physiotherapist portrait professional") — add to `remotePatterns` in `next.config.ts`
- Names: Anri van der Berg, Marco Shiimi, Liesl Haussmann, David Naango
- Titles: Senior Physiotherapist, Sports Rehabilitation Specialist, Manual Therapy Specialist, Paediatric Physiotherapist
