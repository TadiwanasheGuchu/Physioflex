# 03 — Booking Flow

Start at `/book`. Test both guest and logged-in scenarios.

---

## Guest Booking (no account)

Use a private/incognito window or log out first.

### Step 1 — Select Service
- [ ] Service list loads (all active services shown)
- [ ] Service prices are NOT visible
- [ ] Service duration is NOT visible
- [ ] Clicking a service highlights it and enables the Next button

### Step 2 — Select Therapist
- [ ] Susan Mubatapasango and Vimbai Shumba appear as options
- [ ] "Any available therapist" option is present
- [ ] Selecting a therapist and clicking Next proceeds

### Step 3 — Select Date & Time
- [ ] Calendar or date picker loads
- [ ] Only weekdays (Mon–Fri) are selectable
- [ ] Time slots appear after selecting a date
- [ ] Selecting a slot and clicking Next proceeds
- [ ] Slots that are already booked are unavailable (test by booking twice for the same time)

### Step 4 — Patient Details (guest)
- [ ] Fields: First name, Last name, Email, Phone, WhatsApp, Notes
- [ ] **Email field is visible and required** (guest must provide email)
- [ ] Submitting without email shows validation error
- [ ] Submitting without first name shows validation error
- [ ] Valid submission proceeds to confirmation

### Success Page `/book/success`
- [ ] Reference number displayed (format: `PF-YYYY-XXXX`)
- [ ] Service name, therapist name, date and time shown correctly
- [ ] Confirmation email sent to the guest email address provided
- [ ] "Back to home" or similar link works

---

## Logged-In Booking

Log in as `patient@test.physioflex` / `TestPatient123!` first.

### Steps 1–3
- [ ] Same as guest — service, therapist, date/time selection works

### Step 4 — Patient Details (logged in)
- [ ] Name fields are pre-filled from the patient profile (James Nakale)
- [ ] Email field is NOT shown (uses account email)
- [ ] Phone and WhatsApp pre-filled if set in profile
- [ ] Notes field available
- [ ] Submit proceeds to confirmation

### Success Page
- [ ] Reference number shown
- [ ] Booking appears immediately in `/portal/appointments`
- [ ] Booking appears in Admin → Bookings

---

## Manage / Cancel Booking `/book/manage`

- [ ] Page loads with a reference number input
- [ ] Enter a valid reference (e.g. `PF-2026-XXXX`) → booking details shown
- [ ] Cancel button present for upcoming bookings
- [ ] Cancelling updates status to `cancelled` in Admin → Bookings
- [ ] Invalid reference shows "not found" message

---

## Edge Cases

- [ ] Booking for today — only future time slots shown
- [ ] Double booking same slot — second booking blocked (slot marked unavailable)
- [ ] Booking with therapist "any available" — a therapist is auto-assigned
- [ ] If no therapists active — booking flow shows appropriate error
