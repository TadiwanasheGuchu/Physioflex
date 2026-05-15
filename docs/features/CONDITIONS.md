# Feature Spec — Conditions We Treat

## Goal
When a potential patient Googles "physiotherapy for back pain Swakopmund" or "knee injury physio Namibia", this page should rank and convert. It's both an SEO page and a trust-builder — it shows depth of expertise before a patient even books.

## Pages & Sections
- **Homepage teaser** — compact icon-grid of condition categories (6-8 icons with labels)
- **Full conditions page** — `/conditions` with filterable card grid

---

## Homepage Teaser (Section)
- Placed after the **About** section
- Eyebrow: "CONDITIONS WE TREAT"
- Headline: "Whatever brings you pain, we have a path forward."
- Layout: 3×2 or 4×2 icon grid (icons + labels only, no descriptions)
- CTA: "See all conditions →" linking to `/conditions`

### Grid item anatomy
```
[Icon — 32px, teal]
Label (text-sm, text-[#0d253d], weight 300)
```

---

## Full Conditions Page (`/conditions`)

### Hero
- Gradient mesh background
- Headline: "Conditions we treat"
- Search input: filter conditions in real-time by name
- Filter pill bar: All | Musculoskeletal | Sports | Neurological | Post-Surgical | Paediatric

### Conditions Grid
- 3-column desktop, 2-column tablet, 1-column mobile
- Each card: `card-feature-light` style

### Each Condition Card
```
[Category tag pill]
Condition name — display-md weight 300
One-line description — body-sm text-[#64748d]
[Symptoms — collapsed by default, expand on click]
[Book for this condition →] — pill CTA
```

---

## Condition Categories & Examples

### Musculoskeletal
- Lower Back Pain
- Neck Pain & Stiffness
- Shoulder Impingement
- Hip & Knee Osteoarthritis
- Plantar Fasciitis
- Carpal Tunnel Syndrome
- Scoliosis

### Sports Injuries
- ACL / Meniscus Tears
- Rotator Cuff Injuries
- Tennis / Golfer's Elbow
- Ankle Sprains
- Hamstring Strains
- Shin Splints
- Stress Fractures

### Neurological
- Stroke Rehabilitation
- Multiple Sclerosis
- Parkinson's Disease (mobility)
- Peripheral Neuropathy
- Sciatica

### Post-Surgical
- Knee Replacement Rehab
- Hip Replacement Rehab
- Spinal Surgery Recovery
- Rotator Cuff Repair
- Fracture Rehabilitation

### Paediatric
- Developmental Delays (motor)
- Cerebral Palsy
- Torticollis
- Scoliosis (adolescent)
- Sports Injuries in Youth

---

## Data Structure

```ts
interface Condition {
  id: string;
  name: string;
  category: "musculoskeletal" | "sports" | "neurological" | "post-surgical" | "paediatric";
  description: string; // 1 sentence
  symptoms: string[]; // bullet list, 3-5 items
  treatmentApproach: string; // 1-2 sentences
  icon: string; // lucide icon name
}
```

---

## Design Tokens
- Category tags: same `pill-tag-soft` system as services — each category gets its own colour
  - Musculoskeletal: teal `#ccfbf1` / `#0f766e`
  - Sports: amber `#fef3c7` / `#92400e`
  - Neurological: indigo `#e0e7ff` / `#3730a3`
  - Post-Surgical: cream `#fdf4f0` / `#9b6829`
  - Paediatric: pink `#fce7f3` / `#9d174d`
- Filter pills: active state — bg `#0d9488`, text white; inactive — bg `#f0fdfa`, text `#0d9488`, border `#99f6e4`
- Search input: `text-input` style — border `#a8c3de`, focus border `#0d9488`, `rounded-md`

---

## SEO Notes
- Each condition should eventually have its own sub-page at `/conditions/[slug]` for long-tail SEO
- Meta description per condition: "Physioflex treats [condition] in Swakopmund, Namibia. Book with our registered physiotherapists today."
- Include structured data (MedicalCondition schema) in Phase 2
