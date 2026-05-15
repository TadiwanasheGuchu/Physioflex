# Feature Spec — Notifications System

## Goal
Reduce no-shows (the #1 revenue problem for physiotherapy clinics) through automated reminders. In Namibia, WhatsApp is the primary communication channel — it must be the lead notification method.

## Notification Channels (priority order)
1. **WhatsApp** — primary (highest open rate in Namibia)
2. **Email** — secondary (for invoices, formal records)
3. **SMS** — fallback (for patients without WhatsApp)
4. **In-app** — Sonner toasts within the Patient Portal

---

## Notification Events

| Trigger | Channels | Timing | Content |
|---|---|---|---|
| Booking confirmed | WhatsApp + Email | Immediately | Confirmation with date, time, therapist, location |
| Appointment reminder | WhatsApp + SMS | 24h before | Reminder + "Reply CANCEL to cancel" |
| Appointment reminder | WhatsApp | 2h before | Short reminder |
| Appointment rescheduled | WhatsApp + Email | Immediately | New date/time details |
| Appointment cancelled | WhatsApp + Email | Immediately | Cancellation confirmation + rebooking link |
| Missed appointment | WhatsApp | 30 min after slot | "We missed you — rebook here" |
| Invoice issued | Email | On invoice creation | Invoice PDF attached |
| Payment received | WhatsApp + Email | Immediately | Receipt confirmation |
| Recovery check-in | WhatsApp | 3 days after session | "How are you feeling? Continue your exercises" |
| Exercise plan assigned | WhatsApp + Email | When therapist assigns | Download link |
| Message received | In-app (Sonner) + WhatsApp | Immediately | "New message from [Therapist]" |

---

## WhatsApp Integration

### Provider Options
- **WhatsApp Business API** via **Twilio** (recommended — easy Node.js SDK)
- **Vonage** (alternative)
- **360dialog** (Africa-friendly pricing)

### Message Templates (WhatsApp requires pre-approved templates for outbound)

**Booking Confirmation:**
```
Hi {{name}}, your appointment at Physioflex is confirmed ✅

📅 {{date}} at {{time}}
👤 Therapist: {{therapist}}
📍 Swakopmund Clinic

Reply HELP for assistance or call us: +264 64 XXX XXXX
```

**24h Reminder:**
```
Hi {{name}}, reminder: your Physioflex appointment is tomorrow.

📅 {{date}} at {{time}} with {{therapist}}

Need to cancel? Reply CANCEL or visit: {{cancel_link}}
```

**Recovery Check-in:**
```
Hi {{name}}, how are you feeling after your session with {{therapist}}?

Remember to complete your exercises:
{{exercise_plan_link}}

See you at your next appointment on {{next_date}} 💪
```

---

## Email Integration

### Provider
- **Resend** (recommended — React Email templates, generous free tier)
- **SendGrid** (alternative)

### Email Templates (use React Email)
- Booking confirmation (with calendar .ics attachment)
- Invoice (with PDF attachment)
- Password reset
- Welcome email (after patient registration)
- Recovery check-in

### From Address
- `appointments@physioflex.na`
- `noreply@physioflex.na` for system emails

---

## In-App Notifications (Patient Portal)

```tsx
// Use Sonner (already installed) for toast notifications
// Persistent notification bell in portal header

<BellIcon /> [3] // badge count
// Dropdown: list of unread notifications
// Click → navigate to relevant page
```

---

## Global WhatsApp Button (Homepage + All Pages)

Floating WhatsApp button — bottom-right corner on all public pages:

```tsx
// Fixed position, z-50
// WhatsApp green (#25D366) circle button, 56px
// WhatsApp icon (use lucide MessageCircle or custom SVG)
// On hover: "Chat with us on WhatsApp" tooltip
// Link: https://wa.me/264640000000?text=Hi%2C%20I'd%20like%20to%20book%20an%20appointment

// Mobile: visible at all times
// Desktop: visible after 3s scroll delay
```

Also add to Navbar (mobile): WhatsApp icon next to "Book Appointment" CTA.

---

## Sticky Booking Button (Mobile)

```tsx
// Fixed bottom bar — mobile only (hidden md:hidden)
// Full width, bg-[#0d9488], text-white
// "Book Appointment" with calendar icon
// z-40, sits above page content, below modals
// Visible on all public pages
```

---

## Notification Preferences (Patient Portal)
Patients can toggle in `/portal/profile`:
- WhatsApp reminders: On/Off
- Email reminders: On/Off
- SMS reminders: On/Off
- Recovery check-ins: On/Off

---

## Queue & Scheduling
- Use a job queue (e.g. BullMQ with Redis, or Vercel Cron Jobs for simpler setup)
- Schedule reminders at booking time: create jobs for 24h before and 2h before
- Cancel scheduled jobs if appointment is cancelled

---

## Dependencies
- `twilio` npm package (WhatsApp + SMS)
- `resend` npm package (Email)
- `react-email` (email templates)
- BullMQ + Redis (job queue) OR Vercel Cron (simpler)
- Environment variables: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`, `RESEND_API_KEY`
