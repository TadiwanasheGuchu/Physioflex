# Patient Testing Guide

Login: `patient@test.physioflex` / `TestPatient123!`

---

## 1. Register / Login

1. Go to `/auth/login`
2. Enter the credentials above and click **Sign in**
3. You are redirected to `/portal` — the patient dashboard

> To test new-patient registration instead: go to `/auth/register`, fill in any name/email/password (min 8 chars), then check your email for the confirmation link before logging in.

---

## 2. Book an Appointment (logged-in flow)

1. Click **New Booking** in the portal sidebar, or go to `/book`
2. **Step 1 — Service**: pick any service (e.g. Initial Assessment, Sports Physiotherapy)
3. **Step 2 — Therapist**: choose Susan or Vimbai, or leave on "Any available"
4. **Step 3 — Date & Time**: pick a weekday slot (Mon–Fri 08:00–18:00)
5. **Step 4 — Your details**: pre-filled from the patient profile; add notes if needed
6. Click **Confirm Booking**
7. A reference number appears (e.g. `PF-2026-XY12`) — note it for admin testing

The booking is immediately visible in:
- Patient portal → **My Appointments**
- Admin panel → **Bookings**

---

## 3. Guest Booking (no account needed)

1. Log out first (sidebar → Sign out), or use a private/incognito window
2. Go to `/book`
3. Complete the flow — on the details step you will be asked for your email
4. No account is created; a guest patient row is created in the database
5. Confirmation email is sent to the address you provided

---

## 4. Patient Portal — Feature Tour

| Page | URL | What to test |
|------|-----|--------------|
| Dashboard | `/portal` | Upcoming appointments, quick links |
| Appointments | `/portal/appointments` | Full history, status badges |
| Billing | `/portal/billing` | Invoices (unpaid / paid / void) |
| Messages | `/portal/messages` | Send a message to the clinic |
| Progress | `/portal/progress` | Recovery log entries, pain score chart |
| Profile | `/portal/profile` | Edit name, phone, medical aid, address |
| Resources | `/portal/resources` | Patient education PDFs / links |

---

## 5. Profile Update

1. Go to `/portal/profile`
2. Update phone, WhatsApp, or medical aid details
3. Click **Save** — changes persist immediately

---

## 6. Submit a Review

1. Go to `/reviews` (public page)
2. Click **Leave a Review**
3. Fill in display name, rating, and comment — submit
4. The review lands in Admin → Content → Reviews with status **pending**
5. Approve it in the admin panel to make it appear publicly

---

## 7. Password Reset

1. Log out
2. Go to `/auth/forgot`
3. Enter `patient@test.physioflex`
4. Check the email inbox for the reset link (check Supabase email logs in dev)
5. Click the link → `/auth/reset` → enter a new password

---

## Expected Outcomes Checklist

- [ ] Login succeeds, redirects to `/portal`
- [ ] Booking flow completes and reference number is shown
- [ ] Appointment appears in portal and in admin Bookings list
- [ ] Profile edits save correctly
- [ ] Review submission lands in admin Content queue
