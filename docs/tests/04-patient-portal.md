# 04 — Patient Portal

Login: `patient@test.physioflex` / `TestPatient123!`  
Base URL: `/portal`

---

## Access Control

- [ ] Visiting `/portal` while logged out redirects to `/auth/login?redirect=/portal`
- [ ] After login, `/portal` loads correctly
- [ ] Sidebar shows patient name: **James Nakale**

---

## Dashboard `/portal`

- [ ] Page loads without errors
- [ ] Upcoming appointments listed (if any booked)
- [ ] "Book an appointment" quick-action link goes to `/book`
- [ ] KPI summary cards render (total sessions, next appointment, etc.)

---

## Appointments `/portal/appointments`

- [ ] All appointments for James Nakale are listed
- [ ] Status badges display correctly (confirmed, completed, cancelled, etc.)
- [ ] Date and time shown in readable format
- [ ] Service name and therapist name shown per row
- [ ] After making a new booking in `/book`, it appears here on refresh
- [ ] No appointments from other patients visible

---

## Billing `/portal/billing`

- [ ] Page loads
- [ ] Invoices for James Nakale listed (if any exist)
- [ ] Invoice number, amount, status, and date shown
- [ ] Unpaid invoices shown separately from paid
- [ ] No invoices from other patients visible

---

## Messages `/portal/messages`

- [ ] Page loads with message thread
- [ ] Text input and send button present
- [ ] Sending a message saves it and appears in the thread
- [ ] Message shows timestamp
- [ ] Messages are only visible to this patient and admin
- [ ] Admin replies (if any) appear in the thread

---

## Progress `/portal/progress`

- [ ] Page loads
- [ ] Pain score log entries shown (if any exist)
- [ ] Chart or visual indicator renders
- [ ] AI recovery suggestions section loads (requires API key)

---

## Profile `/portal/profile`

- [ ] Page loads with current values pre-filled:
  - First name: James
  - Last name: Nakale
  - Phone: +264 81 555 0001
  - Medical aid: NHP / NHP-987654
- [ ] Editing a field and saving updates the value
- [ ] Refreshing the page shows the updated value (persisted to DB)
- [ ] Empty required fields show validation errors

---

## Resources `/portal/resources`

- [ ] Page loads
- [ ] Resource cards or download links visible
- [ ] Links open correctly

---

## Sidebar Navigation

- [ ] All sidebar links work: Dashboard, Appointments, Billing, Messages, Progress, Profile, Resources
- [ ] Active page is highlighted in the sidebar
- [ ] **Sign out** button logs out and redirects away from portal
- [ ] Mobile: hamburger/menu icon opens the sidebar
