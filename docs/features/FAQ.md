# Feature Spec — Interactive FAQ

## Goal
Remove booking friction by answering the questions every new patient has before they pick up the phone. A well-written FAQ reduces "I'll call later" drop-off and positions Physioflex as transparent and patient-centred.

## Placement
- **Homepage section** only (no separate page needed)
- Placed just before the **Booking CTA** section
- Accordion pattern — one question open at a time

---

## Layout

```
[Eyebrow: "FREQUENTLY ASKED QUESTIONS"]
[Headline: "Everything you need to know before your first visit"]
[Subtext: "Still have questions? Call us or send a message."]

[Two-column layout on desktop]
  Left: 5 questions
  Right: 5 questions
  (Stacks to single column on mobile)
```

Each item uses shadcn `Accordion` component (already available in the project via radix-ui).

---

## FAQ Content (10 Questions)

### Before Your Visit
1. **Do I need a doctor's referral to see a physiotherapist?**
   No — you can book directly with us without a referral. However, some medical aids require a referral for reimbursement, so check your plan's requirements before your appointment.

2. **What should I bring to my first appointment?**
   Bring any recent X-rays, scans, or specialist letters related to your condition, your medical aid card, and wear comfortable clothing that allows access to the affected area.

3. **How long is a session?**
   Initial consultations are 60 minutes and include a full assessment plus your first treatment. Follow-up sessions are typically 30–45 minutes depending on your treatment plan.

4. **Is physiotherapy painful?**
   Some techniques may cause temporary discomfort, but treatment should never be excessively painful. Your physiotherapist will always work within your comfort level and explain what to expect before any technique.

5. **How many sessions will I need?**
   This varies by condition. Acute injuries may resolve in 3–6 sessions; chronic or post-surgical conditions often require 8–12+ sessions. Your physiotherapist will give you a realistic estimate after the initial assessment.

### Medical Aid & Costs
6. **Which medical aids do you accept?**
   We accept most Namibian medical aids including PSEMAS, Namibia Health Plan (NHP), Namlife, Renaissance Health, and others. Contact us to confirm your specific plan. Uninsured patients are welcome — ask about our self-pay rates.

7. **Do you do direct billing to medical aids?**
   Yes, where the medical aid allows direct billing, we process claims on your behalf. You may be responsible for co-payments or amounts above your annual physiotherapy benefit limit.

### During Treatment
8. **What physiotherapy techniques do you use?**
   We use a range of evidence-based techniques including manual therapy, dry needling, exercise prescription, ultrasound therapy, TENS, and taping/strapping — tailored to your specific condition and goals.

9. **Do you treat children?**
   Yes. Our paediatric physiotherapy services treat children from infancy through adolescence, covering developmental delays, sports injuries, scoliosis, and more.

### Practical
10. **Where are you located and is there parking?**
    We are located in Swakopmund, Erongo Region. Free parking is available on-site. The clinic is wheelchair accessible. See the map below or call us for directions.

---

## Component Spec

```tsx
// Use shadcn Accordion (radix-ui based)
// Single type — only one item open at a time
// Animate open/close with tw-animate-css

<Accordion type="single" collapsible>
  <AccordionItem value="q1">
    <AccordionTrigger>Question text</AccordionTrigger>
    <AccordionContent>Answer text</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Styling
- Trigger text: `text-[#0d253d]` weight 400, `text-sm`
- Open trigger: `text-[#0d9488]`
- Answer text: `text-[#64748d]` weight 300, `text-sm leading-7`
- Divider between items: `border-b border-[#e3e8ee]`
- No outer card border — items sit on the white canvas directly
- Desktop: 2-column grid, each column is an independent accordion

---

## Design Tokens
- Section bg: `#ffffff` (white canvas)
- Trigger active colour: `#0d9488`
- Answer text: `text-[#64748d]` weight 300

---

## Install Note
shadcn Accordion is not yet installed. Run:
```bash
npx shadcn@latest add accordion
```
before building this feature.
