# Feature Spec — Online Booking System

## Goal
Allow patients to book appointments 24/7 without calling the clinic. The booking flow must be simple enough to complete on a phone in under 2 minutes.

## Routes
- `/book` — main booking page
- `/book/confirm` — confirmation step
- `/book/success` — post-booking success page
- `/book/manage` — reschedule / cancel (requires patient auth or booking reference)

---

## Booking Flow (4 steps)

```
Step 1: Select Service
  → list of services (cards with icons, descriptions, duration, price range)

Step 2: Select Therapist
  → "Any available therapist" (default) or choose specific therapist
  → therapist cards with photo, name, specialisations

Step 3: Select Date & Time
  → Calendar showing available days (grey = fully booked)
  → Time slot grid for selected day (30/45/60 min slots)
  → Timezone: WAT (UTC+1) — Namibia Standard Time

Step 4: Patient Details
  → Name, email, phone number, WhatsApp number (if different)
  → Medical aid: Yes/No → if Yes: scheme name + member number
  → Notes / reason for visit (optional, 200 char max)
  → Accept terms checkbox
  → [Confirm Booking] pill button
```

---

## Step Components

### Step 1 — Service Selection
```tsx
// Grid of service cards — 2-up on mobile, 3-up on desktop
// Each card:
//   Icon (lucide), service name, duration, price range, short description
// Selected card: border-2 border-[#0d9488] bg-[#f0fdfa]
// Unselected: border border-[#e3e8ee]
```

### Step 2 — Therapist Selection
```tsx
// "Any available" default option (always first)
// Therapist cards: photo, name, title, specialisation tags
// Same selected/unselected border treatment
```

### Step 3 — Calendar & Slots
```tsx
// Use react-day-picker (already installed) for the calendar
// Available days: normal styling
// Fully booked days: line-through text, pointer-events-none, opacity-40
// Selected day: bg-[#0d9488] text-white rounded-full
// Time slots: pill buttons in a grid — 3-column on desktop, 2-column on mobile
// Booked slots: bg-[#f0fdfa] text-[#64748d] cursor-not-allowed
// Available slots: border border-[#e3e8ee] hover:border-[#0d9488]
// Selected slot: bg-[#0d9488] text-white
```

### Step 4 — Patient Details
```tsx
// shadcn Input components (already installed)
// Medical aid toggle: show/hide scheme name + member number fields
// WhatsApp field: pre-fill with phone, allow editing
// Sonner toast on submission error (already installed)
```

### Step indicator (top of page)
```tsx
// 4 numbered steps with connecting line
// Active: teal circle, bold label
// Completed: teal circle with checkmark
// Upcoming: grey circle
```

---

## Confirmation Page (`/book/confirm`)
- Summary card: service, therapist, date/time, patient name
- Medical aid or self-pay indicator
- [Go Back] outline button | [Confirm & Book] primary pill button
- On confirm: show loading spinner, then redirect to `/book/success`

## Success Page (`/book/success`)
- Large checkmark animation (use tw-animate-css — already installed)
- "Your appointment is confirmed"
- Booking reference number (e.g. PF-2026-0042)
- Date, time, therapist name
- "Add to Calendar" button (generates .ics file)
- "Share via WhatsApp" button
- CTA: "Book another appointment" | "Go to homepage"
- Triggers: email + WhatsApp confirmation sent automatically

---

## Backend Requirements
- `POST /api/bookings` — create booking
- `GET /api/availability?therapistId=&date=` — fetch available slots
- `GET /api/bookings/:ref` — fetch booking by reference
- `PATCH /api/bookings/:ref` — reschedule
- `DELETE /api/bookings/:ref` — cancel

---

## Rescheduling & Cancellation (`/book/manage`)
- Patient enters booking reference + email/phone to authenticate
- Shows current booking details
- [Reschedule] → opens calendar step
- [Cancel] → confirmation modal with cancellation policy
- Cancellation policy: >24h = full refund; <24h = 50% credit

---

## Design Tokens
- Step indicator active: bg `#0d9488`
- Step indicator complete: bg `#0d9488` with check icon
- Step indicator pending: bg `#e3e8ee`
- Selected card/slot: border-2 `#0d9488`, bg `#f0fdfa`
- Form inputs: `text-input` style from DESIGN.md
- Primary CTA: `button-primary-pill`

---

## Dependencies
- `react-day-picker` — already installed
- `shadcn/ui` Input, Label — already installed
- `sonner` — already installed (for error toasts)
- Calendar component — already installed
- Backend: needs API (FastAPI or Next.js Route Handlers)
