# Feature Spec — Reviews & Testimonials

## Goal
Move beyond static testimonials to a live, dynamic reviews system that builds trust through real patient feedback and success stories. Online reviews are the #1 factor Namibian patients use to choose a healthcare provider.

## Pages & Sections
- **Homepage** — star rating summary + 3 featured testimonials (upgrade existing static cards)
- **Reviews page** — `/reviews` — all reviews with filtering
- **Success Stories** — highlighted in `/reviews` — before/after recovery highlights

---

## Homepage Upgrades (upgrade existing static testimonials section)

### Rating Summary Bar (add above testimonial cards)
```
★★★★★  4.9 out of 5
Based on 142 patient reviews

[★★★★★ 89%] [████████░░]
[★★★★☆ 8% ] [████░░░░░░]
[★★★☆☆ 2% ] [█░░░░░░░░░]
[★★☆☆☆ 1% ] [░░░░░░░░░░]
[★☆☆☆☆ 0% ] [░░░░░░░░░░]

[Read all reviews →]  [Leave a review →]
```

### Testimonial cards
- Upgrade existing 3 static cards to pull from database (most recent 3, 5-star)
- Add: date of review, star rating (visual), verified patient badge

---

## Reviews Page (`/reviews`)

### Hero
- Minimal — white bg
- Headline: "What our patients say"
- Overall rating: large star display + count

### Filters
- Star rating: All | ★★★★★ | ★★★★ | ★★★
- Service: All | Sports Rehab | Pain Management | Manual Therapy | Post-Surgery
- Sort: Most Recent | Highest Rated | Most Helpful

### Reviews Grid / List
- 1-column list on all screen sizes (reviews need space to breathe)
- Each review card:

```
[★★★★★] Verified Patient · Sports Rehabilitation · 12 May 2026
Sarah M. — Swakopmund

"After my knee surgery, Physioflex had me back on the trail in eight weeks..."
[Show more] if > 3 lines

[Helpful? 👍 12]  [Share]
```

### Clinic Response
- Admin can reply to reviews (shown inline below the review)
- Builds trust — shows the clinic is engaged

---

## Success Stories Section (within `/reviews`)

### What it is
Curated, longer-form patient recovery stories — more narrative than standard reviews. These are the "case studies" of the website.

### Story Card
```
[Before/After or recovery photo (optional, with consent)]
[Service tag]
"Back on the Bike After ACL Surgery"

Patient: Johan V., 34 — Swakopmund
Treatment: Sports Rehabilitation — 10 sessions over 8 weeks
Result: Returned to competitive cycling, pain-free

Story (2–3 paragraphs)...

[Read Full Story →]
```

---

## Review Submission Flow

### Post-Appointment Trigger
- 48 hours after appointment marked "Completed", WhatsApp/email sent:
  ```
  Hi Sarah, how was your session at Physioflex?
  We'd love to hear your feedback — it only takes 1 minute:
  [Leave a review →]
  ```

### Review Form (`/reviews/submit?token=xxx`)
- Token-based (link in notification — no login required)
- Fields:
  - Star rating (1–5, required)
  - Which service? (pre-filled from booking)
  - Written review (min 20 chars, max 500 chars)
  - Consent checkbox: "I agree my review may be displayed on the Physioflex website"
  - Optional: first name + suburb (shown on review)

### Moderation
- Reviews submitted → status "pending"
- Admin reviews in `/admin/content` → approve / reject / respond
- Approved → visible on site
- Rejected → admin can note reason (spam, offensive, inappropriate)

---

## Google Reviews Integration
- "Leave a Google Review" CTA alongside internal review form
- Google Review link: `https://g.page/r/[PLACE_ID]/review`
- This feeds the Google Business Profile rating — critical for local SEO
- Homepage: show Google rating badge alongside internal rating

---

## Data Structure

```ts
interface Review {
  id: string;
  patientId?: string; // optional — anonymous allowed
  displayName: string; // e.g. "Sarah M."
  suburb: string; // e.g. "Swakopmund"
  serviceId: string;
  appointmentId?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  status: "pending" | "approved" | "rejected";
  helpfulCount: number;
  adminReply?: string;
  adminRepliedAt?: string;
  createdAt: string;
  verifiedPatient: boolean;
}

interface SuccessStory {
  id: string;
  patientDisplayName: string;
  age?: number;
  suburb: string;
  serviceId: string;
  title: string;
  sessionCount: number;
  durationWeeks: number;
  story: string; // MDX or plain text
  photo?: string; // with consent
  featured: boolean;
}
```

---

## Design Tokens
- Star colour: `#f59e0b` (amber-400)
- Verified badge: teal pill `#ccfbf1` / `#0f766e`
- Rating bar fill: `#0d9488`
- Admin reply: bg `#f0fdfa`, left border 3px `#0d9488`
- Pending badge: amber `#fef3c7` / `#92400e`
- Approved badge: teal
- Rejected badge: red `#fce7f3` / `#9d174d`
