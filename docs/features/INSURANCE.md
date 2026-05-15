# Feature Spec — Medical Aid & Insurance

## Goal
Remove the biggest friction point in healthcare: "Will this be covered?" Namibian patients need to know which medical aids Physioflex accepts before they book. Clarity here directly increases bookings from insured patients.

## Pages & Sections
- **Homepage section** — logo strip + key info, placed between **About** and **Testimonials**
- **Dedicated page** (optional Phase 2) — `/insurance`

---

## Homepage Section

### Layout
```
[Eyebrow: "MEDICAL AID ACCEPTED"]
[Headline: "We work with most Namibian medical aids"]
[Subtext: "Not sure if your plan covers physiotherapy? Call us — we'll check your benefits before your first visit."]

[Medical aid logo/name strip — horizontal scroll on mobile]

[Two info cards side by side]
  Card 1: "Direct Billing"
  Card 2: "Self-Pay Welcome"

[CTA: "Check your cover →" → tel: or contact form]
```

### Medical Aid Logo Strip
- Display as named pills/badges (not external logo images — avoid copyright issues)
- Each badge: white pill, border `#e3e8ee`, text `#0d253d`, weight 400, small

---

## Namibian Medical Aids to List

| Medical Aid | Notes |
|---|---|
| PSEMAS | Public Service Employees Medical Aid Scheme — largest scheme in Namibia |
| Namibia Health Plan (NHP) | Major private scheme |
| Namlife Health | Namlife subsidiary |
| Renaissance Health | Mid-tier private scheme |
| Namdeb Medical Aid | Mining sector scheme |
| Debmarine Namibia | Diamond mining sector |
| Namibia Medical Care (NMC) | Smaller private scheme |
| Out-of-pocket (self-pay) | Always welcome — competitive rates |

> Note: Confirm the actual accepted aids with the clinic owner before launch. This list is a starting point based on common Namibian schemes.

---

## Two Info Cards

### Card 1: Direct Billing
- Icon: CreditCard (lucide)
- Title: "Direct medical aid billing"
- Body: "Where your medical aid allows, we submit claims directly on your behalf. You only pay any co-payment or amount above your annual physiotherapy benefit."
- Tag: "No paperwork for you"

### Card 2: Self-Pay
- Icon: Banknote (lucide)
- Title: "Transparent self-pay rates"
- Body: "Not insured? We offer competitive self-pay rates. Ask about our session packages for better value on ongoing treatment."
- Tag: "No hidden fees"

---

## FAQ Additions (for the FAQ section)
These questions should be added to the FAQ spec:
- "Which medical aids do you accept?" ← already in FAQ.md
- "Do you do direct billing?" ← already in FAQ.md
- "What happens if I exceed my annual benefit limit?" → Patient pays the difference directly; we'll inform you before treatment continues past your limit.

---

## Dedicated Page (`/insurance`) — Phase 2

### Content sections
1. How medical aid works for physiotherapy (educational)
2. Step-by-step: what to do at your first appointment (bring card, we process claim)
3. Full table: accepted aids, covered services, typical limits
4. Self-pay rate card (published transparently — strong differentiator)
5. CTA: "Still unsure? Call us to verify your cover"

---

## Rate Transparency (Strong Differentiator)
Most Namibian physiotherapy websites hide their prices. Publishing a self-pay rate card (or a range) builds massive trust. Example:
```
Initial Consultation (60 min): N$650 – N$750
Follow-up Session (30 min):    N$350 – N$450
Follow-up Session (45 min):    N$450 – N$550
Home visit (per session):      N$900 – N$1,100
```
> Confirm actual rates with clinic owner. Use ranges, not fixed prices, to account for complexity.

---

## Design Tokens
- Section bg: `#f0fdfa` (teal-50 — warm separation from white sections)
- Medical aid badges: white pill, border `#e3e8ee`, `rounded-full`, px-3 py-1
- Info cards: `card-feature-light` — white bg, border, shadow level 1, `rounded-xl`
- Info card icon bg: `#f0fdfa` teal-50, icon colour `#0d9488`
- CTA: phone number as `button-primary-pill` + optional outline "Send a message" button

---

## Namibia-Specific Notes
- PSEMAS is the dominant scheme — government employees make up a significant portion of Swakopmund's population (town hosts regional government offices)
- Many patients call ahead specifically to check medical aid acceptance — this section reduces those calls while still encouraging contact for complex cases
- WhatsApp is the preferred contact method; consider adding a WhatsApp link alongside the phone CTA
