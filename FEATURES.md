# Physioflex — Feature Roadmap

> Source: Combined from internal planning + ChatGPT PRD (`chat.md`).
> Design rules: always follow `DESIGN.md`. Each feature has a spec in `docs/features/`.

---

## User Roles

| Role | Description |
|---|---|
| **Patient** | Books appointments, views therapists, accesses exercise plans, manages profile, makes payments |
| **Physiotherapist** | Views assigned patients, updates treatment notes, manages availability, tracks patient progress |
| **Admin** | Manages bookings, assigns therapists, manages payments, views analytics, manages content |

---

## Phase 1 — Homepage & Public Pages *(Build first — no auth needed)*

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 1.1 | Homepage hero + layout | Built | `/` | `done` |
| 1.2 | Services section | Built | `/` | `done` |
| 1.3 | About section | Built | `/` | `done` |
| 1.4 | Testimonials section | Built | `/` | `done` |
| 1.5 | Booking CTA section | Built | `/` | `done` |
| 1.6 | Meet the Team homepage teaser | [TEAM.md](docs/features/TEAM.md) | `/` | `pending` |
| 1.7 | Conditions We Treat homepage teaser | [CONDITIONS.md](docs/features/CONDITIONS.md) | `/` | `pending` |
| 1.8 | Medical Aid & Insurance section | [INSURANCE.md](docs/features/INSURANCE.md) | `/` | `pending` |
| 1.9 | Interactive FAQ section | [FAQ.md](docs/features/FAQ.md) | `/` | `pending` |
| 1.10 | Blog teaser section | [BLOG.md](docs/features/BLOG.md) | `/` | `pending` |
| 1.11 | Gallery teaser section | [GALLERY.md](docs/features/GALLERY.md) | `/` | `pending` |
| 1.12 | Google Maps + Local SEO | [SEO.md](docs/features/SEO.md) | `/` + all pages | `pending` |
| 1.13 | Click-to-call / WhatsApp sticky button | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | Global | `pending` |

---

## Phase 2 — Content Pages *(Public, no auth)*

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 2.1 | Full Team page | [TEAM.md](docs/features/TEAM.md) | `/team` | `pending` |
| 2.2 | Full Conditions page | [CONDITIONS.md](docs/features/CONDITIONS.md) | `/conditions` | `pending` |
| 2.3 | Blog listing page | [BLOG.md](docs/features/BLOG.md) | `/blog` | `pending` |
| 2.4 | Blog article page | [BLOG.md](docs/features/BLOG.md) | `/blog/[slug]` | `pending` |
| 2.5 | Clinic Gallery page | [GALLERY.md](docs/features/GALLERY.md) | `/gallery` | `pending` |
| 2.6 | Patient Resources page | [RESOURCES.md](docs/features/RESOURCES.md) | `/resources` | `pending` |
| 2.7 | Services detail pages | [CONDITIONS.md](docs/features/CONDITIONS.md) | `/conditions/[slug]` | `pending` |
| 2.8 | Reviews & Success Stories | [REVIEWS.md](docs/features/REVIEWS.md) | `/reviews` + homepage | `pending` |

---

## Phase 3 — Booking System *(Core feature)*

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 3.1 | Booking page — select service + therapist | [BOOKING.md](docs/features/BOOKING.md) | `/book` | `pending` |
| 3.2 | Real-time availability calendar | [BOOKING.md](docs/features/BOOKING.md) | `/book` | `pending` |
| 3.3 | Booking confirmation flow | [BOOKING.md](docs/features/BOOKING.md) | `/book/confirm` | `pending` |
| 3.4 | Rescheduling & cancellation | [BOOKING.md](docs/features/BOOKING.md) | `/book/manage` | `pending` |
| 3.5 | Automated confirmation (Email + WhatsApp) | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | — | `pending` |

---

## Phase 4 — Patient Portal *(Auth required)*

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 4.1 | Authentication (register / login / reset) | [SECURITY.md](docs/features/SECURITY.md) | `/auth/*` | `pending` |
| 4.2 | Patient dashboard | [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md) | `/portal` | `pending` |
| 4.3 | Appointment history | [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md) | `/portal/appointments` | `pending` |
| 4.4 | Treatment progress tracking | [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md) | `/portal/progress` | `pending` |
| 4.5 | Download exercise plans | [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md) | `/portal/resources` | `pending` |
| 4.6 | Billing & invoices | [PAYMENTS.md](docs/features/PAYMENTS.md) | `/portal/billing` | `pending` |
| 4.7 | Messaging with therapist | [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md) | `/portal/messages` | `pending` |
| 4.8 | Personal profile management | [PATIENT-PORTAL.md](docs/features/PATIENT-PORTAL.md) | `/portal/profile` | `pending` |

---

## Phase 5 — Payments System

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 5.1 | Card payments | [PAYMENTS.md](docs/features/PAYMENTS.md) | `/book/pay` | `pending` |
| 5.2 | Mobile money integration | [PAYMENTS.md](docs/features/PAYMENTS.md) | `/book/pay` | `pending` |
| 5.3 | Invoice generation & download | [PAYMENTS.md](docs/features/PAYMENTS.md) | `/portal/billing` | `pending` |
| 5.4 | Payment history tracking | [PAYMENTS.md](docs/features/PAYMENTS.md) | `/portal/billing` | `pending` |

---

## Phase 6 — Admin Dashboard *(Admin role only)*

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 6.1 | Admin overview dashboard | [ADMIN.md](docs/features/ADMIN.md) | `/admin` | `pending` |
| 6.2 | Booking management | [ADMIN.md](docs/features/ADMIN.md) | `/admin/bookings` | `pending` |
| 6.3 | Therapist assignment | [ADMIN.md](docs/features/ADMIN.md) | `/admin/therapists` | `pending` |
| 6.4 | User & role management | [ADMIN.md](docs/features/ADMIN.md) | `/admin/users` | `pending` |
| 6.5 | Analytics (peak times, popular services) | [ADMIN.md](docs/features/ADMIN.md) | `/admin/analytics` | `pending` |
| 6.6 | Financial reporting | [ADMIN.md](docs/features/ADMIN.md) | `/admin/finance` | `pending` |
| 6.7 | Content management (blog, services) | [ADMIN.md](docs/features/ADMIN.md) | `/admin/content` | `pending` |

---

## Phase 7 — Notifications System

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 7.1 | Appointment reminder (24h before) | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | — | `pending` |
| 7.2 | Booking confirmation message | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | — | `pending` |
| 7.3 | Missed session alert | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | — | `pending` |
| 7.4 | Recovery check-in message | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | — | `pending` |
| 7.5 | WhatsApp notification channel | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | — | `pending` |
| 7.6 | Email notification channel | [NOTIFICATIONS.md](docs/features/NOTIFICATIONS.md) | — | `pending` |

---

## Phase 8 — Security & Compliance

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 8.1 | JWT-based authentication | [SECURITY.md](docs/features/SECURITY.md) | — | `pending` |
| 8.2 | Role-based access control (RBAC) | [SECURITY.md](docs/features/SECURITY.md) | — | `pending` |
| 8.3 | Encrypted patient data | [SECURITY.md](docs/features/SECURITY.md) | — | `pending` |
| 8.4 | Secure API endpoints | [SECURITY.md](docs/features/SECURITY.md) | — | `pending` |
| 8.5 | Privacy policy + GDPR-style compliance | [SECURITY.md](docs/features/SECURITY.md) | `/privacy` | `pending` |

---

## Phase 9 — AI Features *(Optional / Future)*

| # | Feature | Spec | Route | Status |
|---|---|---|---|---|
| 9.1 | Chatbot for booking assistance | [AI.md](docs/features/AI.md) | Global widget | `pending` |
| 9.2 | Basic symptom guidance tool | [AI.md](docs/features/AI.md) | `/symptom-check` | `pending` |
| 9.3 | Personalised recovery suggestions | [AI.md](docs/features/AI.md) | `/portal` | `pending` |
| 9.4 | Automated follow-up messages | [AI.md](docs/features/AI.md) | — | `pending` |

---

## Future Enhancements *(Post-launch)*
- Telehealth video consultations
- Wearable device integration
- Multi-clinic support
- AI-based diagnosis assistant
- Doctor referral portal (`/refer`)

---

## Global Rules
- Follow `DESIGN.md` for all visual decisions
- Mobile-first — test at 375px, 768px, 1280px
- Every page: gradient mesh hero + clear CTA linking to `/book`
- WhatsApp is the primary communication channel in Namibia — prioritise it in all notification flows
- Swakopmund context: multilingual (English, Afrikaans, German), reference coastal location
- Pexels images: already in `next.config.ts` remotePatterns
