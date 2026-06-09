# 05 — Admin Panel

Login: your admin account  
Base URL: `/admin`

---

## Access Control

- [ ] `/admin` while logged out → redirect to `/auth/login?redirect=/admin`
- [ ] `/admin` logged in as patient → redirect to `/portal`
- [ ] `/admin` logged in as admin → panel loads
- [ ] Sidebar shows admin name and email

---

## Overview Dashboard `/admin`

- [ ] Page loads without errors
- [ ] **Today's Appointments** card shows correct count for today
- [ ] **This Week Revenue** shows total of paid invoices this week
- [ ] **Total Patients** matches patient count in Patients section
- [ ] **Unread Messages** count is correct
- [ ] Today's schedule list shows today's appointments with time, patient, service, therapist
- [ ] Status breakdown (confirmed / completed / cancelled) counts are correct
- [ ] "View all" link goes to `/admin/bookings`
- [ ] Quick action links work: New Booking → `/book`, All Patients, All Bookings, Finance

---

## Bookings `/admin/bookings`

- [ ] All appointments load (not just the logged-in user's — this was the RLS bug)
- [ ] Guest bookings appear alongside registered patient bookings
- [ ] Booking made by James Nakale (test patient) is visible
- [ ] Table columns: Date/Time, Patient, Service, Therapist, Duration, Status, Ref
- [ ] **Search** by patient name works (e.g. type "James")
- [ ] **Search** by reference number works (e.g. `PF-2026`)
- [ ] **Status filter** — selecting "confirmed" shows only confirmed appointments
- [ ] **Therapist filter** — selecting Susan or Vimbai filters correctly
- [ ] **Date filter** — selecting today shows only today's appointments
- [ ] Clearing filters shows all records again
- [ ] Count label updates to match filtered results

---

## Patients `/admin/patients`

- [ ] All patients listed (registered + guest)
- [ ] James Nakale appears in the list
- [ ] Search / filter works
- [ ] Clicking a patient row opens the detail page

### Patient Detail `/admin/patients/[id]`
- [ ] Patient profile info shown (name, phone, medical aid, DOB)
- [ ] Stats: total sessions, total revenue, member since date
- [ ] Appointment history listed with date, service, therapist, status
- [ ] Invoices section visible
- [ ] Progress logs section visible (if any exist)
- [ ] Back to Patients link works

---

## Therapists `/admin/therapists`

- [ ] Susan Mubatapasango and Vimbai Shumba listed
- [ ] No dummy staff (Anri, Marco, Liesl, David)
- [ ] Upcoming appointment count shown per therapist
- [ ] Active toggle works — deactivating hides therapist from `/book`
- [ ] Re-activating makes therapist appear in `/book` again

---

## Content `/admin/content`

### Services
- [ ] All active services listed with name, duration, price
- [ ] **Add Service** button opens a form
- [ ] Filling in name, duration (min), price and saving creates a new service
- [ ] New service appears in the booking flow at `/book`
- [ ] **Edit** (pencil icon) opens the service for editing — changes save correctly
- [ ] **Active toggle** — deactivating a service removes it from `/book`
- [ ] Deactivated service does NOT appear in the booking flow

### Reviews
- [ ] Pending reviews from test submissions appear
- [ ] **Approve** button → review status changes to approved
- [ ] Approved review appears on the public `/reviews` page
- [ ] **Reject** button → review status changes to rejected
- [ ] Rejected review does NOT appear on `/reviews`
- [ ] **Reply** field — typing a reply and saving stores it (visible to admin)

---

## Analytics `/admin/analytics`

- [ ] Page loads without errors
- [ ] Charts render with booking data (last 6 months)
- [ ] Bookings-over-time chart shows bars/lines
- [ ] Status breakdown chart (confirmed / completed / cancelled)
- [ ] Top services by booking count listed
- [ ] Therapist workload comparison visible
- [ ] All data reflects real appointment records (not zeros)

---

## Finance `/admin/finance`

- [ ] Page loads without errors
- [ ] Invoices from the last 6 months listed
- [ ] Revenue total cards at top (total, paid, unpaid)
- [ ] Each invoice row shows: number, patient, amount, status, date
- [ ] Paid vs unpaid invoices distinguishable by status badge
- [ ] No invoices from outside the 6-month window shown

---

## Sidebar Navigation

- [ ] All links work: Overview, Bookings, Patients, Therapists, Content, Analytics, Finance
- [ ] Active page highlighted
- [ ] Sign out logs out and redirects away from admin panel
- [ ] Mobile: sidebar accessible via menu icon
