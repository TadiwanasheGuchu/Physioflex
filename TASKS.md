# Physioflex — Task List

> Work top-to-bottom. Complete each task before starting the next.
> Mark done with `[x]`. Reference the spec file for each task.

---

## Phase 1 — Complete the Homepage
*No backend needed. Pure UI. Ship this first.*

- [x] **1.1** Install shadcn Accordion → `npx shadcn@latest add accordion`
- [x] **1.2** Build **FAQ section** on homepage (10 questions, accordion, 2-col desktop) → [FAQ.md](docs/features/FAQ.md)
- [x] **1.3** Build **Meet the Team homepage teaser** (3 cards, circular photo, name, title, tags) → [TEAM.md](docs/features/TEAM.md)
- [x] **1.4** Build **Medical Aid & Insurance section** (logo strip, 2 info cards, WhatsApp CTA) → [INSURANCE.md](docs/features/INSURANCE.md)
- [x] **1.5** Build **Conditions We Treat homepage teaser** (icon grid, 8 conditions) → [CONDITIONS.md](docs/features/CONDITIONS.md)
- [x] **1.6** Build **Reviews rating summary** (star bar, upgrade static testimonials) → [REVIEWS.md](docs/features/REVIEWS.md)
- [x] **1.7** Build **Blog teaser section** (3 article cards) → [BLOG.md](docs/features/BLOG.md)
- [x] **1.8** Build **Gallery teaser section** (3-image asymmetric grid) → [GALLERY.md](docs/features/GALLERY.md)
- [x] **1.9** Add **floating WhatsApp button** (global, all pages) → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **1.10** Add **sticky mobile booking button** (fixed bottom bar, mobile only) → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **1.11** Add **Google Maps embed** in footer area → [SEO.md](docs/features/SEO.md)

---

## Phase 2 — Public Content Pages
*Still no backend. All static/MDX content.*

- [x] **2.1** Build **/team** full page (grid of therapist cards, hero) → [TEAM.md](docs/features/TEAM.md)
- [x] **2.2** Build **/conditions** full page (filterable card grid, search) → [CONDITIONS.md](docs/features/CONDITIONS.md)
- [x] **2.3** Build **/conditions/[slug]** individual condition pages → [CONDITIONS.md](docs/features/CONDITIONS.md)
- [x] **2.4** Build **/gallery** full page (masonry grid, lightbox) → [GALLERY.md](docs/features/GALLERY.md)
- [x] **2.5** Build **/resources** full page (exercise videos, PDFs, guides) → [RESOURCES.md](docs/features/RESOURCES.md)
- [x] **2.6** Build **/reviews** full page (rating summary, filtered list, success stories) → [REVIEWS.md](docs/features/REVIEWS.md)
- [x] **2.7** Set up static blog data (TypeScript objects in `src/lib/blog-data.ts`) → [BLOG.md](docs/features/BLOG.md)
- [x] **2.8** Build **/blog** listing page → [BLOG.md](docs/features/BLOG.md)
- [x] **2.9** Build **/blog/[slug]** article page → [BLOG.md](docs/features/BLOG.md)
- [x] **2.10** Write 6 initial blog articles → [BLOG.md](docs/features/BLOG.md)
- [x] **2.11** Build **/contact** page (map, contact form, hours) → [SEO.md](docs/features/SEO.md)
- [x] **2.12** Build **/privacy** policy page → [SECURITY.md](docs/features/SECURITY.md)

---

## Phase 3 — SEO Foundation
*No backend. Metadata + structured data.*

- [x] **3.1** Add `LocalBusiness` JSON-LD schema to `layout.tsx` → [SEO.md](docs/features/SEO.md)
- [x] **3.2** Add `MedicalCondition` schema to each `/conditions/[slug]` page → [SEO.md](docs/features/SEO.md)
- [x] **3.3** Create `app/sitemap.ts` → [SEO.md](docs/features/SEO.md)
- [x] **3.4** Create `app/robots.ts` → [SEO.md](docs/features/SEO.md)
- [x] **3.5** Add full Open Graph + Twitter card meta to all pages → [SEO.md](docs/features/SEO.md)
- [x] **3.6** Create OG image (programmatic via `app/opengraph-image.tsx`, 1200×630, edge runtime) → [SEO.md](docs/features/SEO.md)
- [x] **3.7** Page speed optimised: `next/image` + `priority` on above-fold, `next/font` for zero FOUT, all pages statically pre-rendered → [SEO.md](docs/features/SEO.md)

---

## Phase 4 — Database & Auth Setup
*First backend work. Everything else depends on this.*

- [x] **4.1** Provisioned PostgreSQL on Supabase (project: mvibsqmongwjfxyececp, region: eu-west-2)
- [x] **4.2** Installed Supabase SDK (`@supabase/supabase-js` + `@supabase/ssr`) — replaced Prisma
- [x] **4.3** Wrote full database schema (`supabase/schema.sql`) — 9 tables with RLS + enums
- [x] **4.4** Ran schema in Supabase SQL Editor — all tables live ✅
- [x] **4.5** Auth via Supabase Auth (replaced NextAuth) — no extra package needed
- [x] **4.6** Supabase client utils: `lib/supabase/client.ts`, `server.ts`, `admin.ts`
- [x] **4.7** Built `/auth/login` page (email + password, redirect support)
- [x] **4.8** Built `/auth/register` page (patient self-registration, email confirmation)
- [x] **4.9** Built `/auth/forgot` + `/auth/reset` pages
- [x] **4.10** Added `middleware.ts` — guards `/portal` and `/admin`, redirects to login
- [x] **4.11** Seeded: 8 services + 4 therapists via SQL seed block

---

## Phase 5 — Booking System
*Depends on Phase 4 (auth + database).*

- [x] **5.1** Build availability API → `GET /api/availability`
- [x] **5.2** Build booking API → `POST /api/bookings`
- [x] **5.3** Build **/book** page — Step 1: select service → [BOOKING.md](docs/features/BOOKING.md)
- [x] **5.4** Build **/book** page — Step 2: select therapist → [BOOKING.md](docs/features/BOOKING.md)
- [x] **5.5** Build **/book** page — Step 3: date + time calendar → [BOOKING.md](docs/features/BOOKING.md)
- [x] **5.6** Build **/book** page — Step 4: patient details form → [BOOKING.md](docs/features/BOOKING.md)
- [x] **5.7** Build **/book/confirm** summary page → [BOOKING.md](docs/features/BOOKING.md)
- [x] **5.8** Build **/book/success** page (reference #, add to calendar, WhatsApp share) → [BOOKING.md](docs/features/BOOKING.md)
- [x] **5.9** Build **/book/manage** reschedule + cancel flow → [BOOKING.md](docs/features/BOOKING.md)

---

## Phase 6 — Patient Portal
*Depends on Phase 4 (auth + database).*

- [x] **6.1** Build portal layout (sidebar nav, responsive) → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)
- [x] **6.2** Build **/portal** dashboard overview (KPI cards, quick actions) → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)
- [x] **6.3** Build **/portal/appointments** (upcoming + past tables) → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)
- [x] **6.4** Build **/portal/progress** tracker (timeline, pain chart) → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)
- [x] **6.5** Build **/portal/resources** (assigned exercise plans) → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)
- [x] **6.6** Build **/portal/messages** thread UI → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)
- [x] **6.7** Build **/portal/billing** (invoices table, payment history) → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)
- [x] **6.8** Build **/portal/profile** (edit personal details, medical aid, notification prefs) → [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md)

---

## Phase 7 — Notifications
*Depends on Phase 5 (booking) + Phase 4 (auth).*

- [x] **7.1** Install Resend + React Email → `npm install resend react-email @react-email/components`
- [x] **7.2** Build booking confirmation email template → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **7.3** Build appointment reminder email template → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **7.4** Build invoice email template (with PDF attachment) → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **7.5** Install Twilio → `npm install twilio`
- [x] **7.6** Implement WhatsApp booking confirmation message → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **7.7** Implement WhatsApp 24h reminder (scheduled job) → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **7.8** Implement recovery check-in message (3 days post-session) → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)
- [x] **7.9** Set up Vercel Cron Jobs for scheduled notifications → [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md)

---

## Phase 8 — Payments
*Depends on Phase 5 (booking) + Phase 4 (auth).*

- [x] **8.1** Choose and set up payment provider (Stripe or Peach Payments)
- [x] **8.2** Build **/book/pay** page — card payment form → [PAYMENTS.md](docs/features/PAYMENTS.md)
- [x] **8.3** Build mobile money payment flow → [PAYMENTS.md](docs/features/PAYMENTS.md)
- [x] **8.4** Build payment webhook handler → `POST /api/webhooks/payment`
- [x] **8.5** Implement PDF invoice generation (`@react-pdf/renderer`) → [PAYMENTS.md](docs/features/PAYMENTS.md)
- [x] **8.6** Link invoices to patient portal billing page → [PAYMENTS.md](docs/features/PAYMENTS.md)

---

## Phase 9 — Admin Dashboard
*Depends on Phases 4, 5, 6, 7, 8.*

- [ ] **9.1** Install recharts → `npm install recharts`
- [ ] **9.2** Build admin layout (sidebar, role check) → [ADMIN.md](docs/features/ADMIN.md)
- [ ] **9.3** Build **/admin** overview dashboard (KPI cards, today's schedule) → [ADMIN.md](docs/features/ADMIN.md)
- [ ] **9.4** Build **/admin/bookings** (table, calendar view, filters) → [ADMIN.md](docs/features/ADMIN.md)
- [ ] **9.5** Build **/admin/patients** (list + detail page) → [ADMIN.md](docs/features/ADMIN.md)
- [ ] **9.6** Build **/admin/therapists** (list + availability schedule editor) → [ADMIN.md](docs/features/ADMIN.md)
- [ ] **9.7** Build **/admin/finance** (revenue chart, invoice table, CSV export) → [ADMIN.md](docs/features/ADMIN.md)
- [ ] **9.8** Build **/admin/analytics** (peak times heatmap, service breakdown) → [ADMIN.md](docs/features/ADMIN.md)
- [ ] **9.9** Build **/admin/content** (blog CMS, FAQ editor, reviews moderation) → [ADMIN.md](docs/features/ADMIN.md)

---

## Phase 10 — Reviews System
*Depends on Phase 4 (auth + database).*

- [ ] **10.1** Build review submission API → `POST /api/reviews`
- [ ] **10.2** Build **/reviews/submit** page (token-gated, no login) → [REVIEWS.md](docs/features/REVIEWS.md)
- [ ] **10.3** Build **/reviews** public page (filtered list, success stories) → [REVIEWS.md](docs/features/REVIEWS.md)
- [ ] **10.4** Add review trigger to notification flow (48h post-appointment) → [REVIEWS.md](docs/features/REVIEWS.md)
- [ ] **10.5** Build review moderation in `/admin/content` → [REVIEWS.md](docs/features/REVIEWS.md)
- [ ] **10.6** Upgrade homepage testimonials to pull live from database → [REVIEWS.md](docs/features/REVIEWS.md)

---

## Phase 11 — AI Features *(Optional)*

- [ ] **11.1** Install Anthropic SDK → `npm install @anthropic-ai/sdk`
- [ ] **11.2** Build booking assistant chatbot widget → [AI.md](docs/features/AI.md)
- [ ] **11.3** Build **/symptom-check** guided questionnaire → [AI.md](docs/features/AI.md)
- [ ] **11.4** Build personalised recovery suggestions in patient portal → [AI.md](docs/features/AI.md)
- [ ] **11.5** Build AI-drafted follow-up message system → [AI.md](docs/features/AI.md)

---

## Quick Reference — What to build next

| Now | Next | After that |
|---|---|---|
| ~~Phase 3 — DONE~~ | Phase 4 (Database & Auth) | Phase 5 (Booking) |
| ✅ Complete | First backend work | Depends on Phase 4 |
| — | Start with task **4.1** | Start with task **5.1** |

**Current task: 4.1 — Choose and provision database**
