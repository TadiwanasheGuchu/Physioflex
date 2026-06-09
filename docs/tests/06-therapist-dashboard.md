# 06 — Therapist Dashboard

Login: `therapist@test.physioflex` / `TestTherapist123!`  
Base URL: `/therapist`

---

## Access Control

- [ ] `/therapist` while logged out → redirect to `/auth/login?redirect=/therapist`
- [ ] `/therapist` logged in as patient → redirect to `/portal`
- [ ] `/therapist` logged in as admin → redirect to `/admin`
- [ ] `/therapist` logged in as therapist → dashboard loads
- [ ] Sidebar shows therapist name, title (in teal), and email

---

## Login Routing

- [ ] Logging in as therapist (no `?redirect=` param) goes directly to `/therapist`
- [ ] Logging in as therapist with `?redirect=/therapist/schedule` goes to `/therapist/schedule`

---

## Overview `/therapist`

- [ ] Page loads without errors
- [ ] Greeting shows therapist's first name ("Good day, [Name]")
- [ ] Today's date shown in a readable format below the greeting
- [ ] **Today** stat card shows count of today's non-cancelled appointments
- [ ] **This Week** stat card shows combined count of today + upcoming this week
- [ ] **Completed** stat card shows total completed sessions across all time
- [ ] **Patients** stat card shows total unique patients seen (non-cancelled)
- [ ] Today's Schedule section renders
  - [ ] If appointments exist today: each card shows time, patient name, service, status badge
  - [ ] If no appointments today: empty state with calendar icon and message
- [ ] Coming Up This Week section appears when future appointments exist this week
  - [ ] Each card shows date, time, patient name, service, status badge
- [ ] Quick Actions section shows three links: Full Schedule, My Patients, Messages
- [ ] Quick action links navigate to the correct pages

---

## Schedule `/therapist/schedule`

- [ ] Page loads without errors
- [ ] "Upcoming (N)" section header shows correct count
- [ ] Upcoming appointments show: patient name, service name, duration, date, time, status badge
- [ ] Appointment notes displayed when present
- [ ] Patient phone number shown when available
- [ ] Reference number shown in monospace font when available
- [ ] **Past Appointments** table renders with columns: Date, Patient, Service, Duration, Status
- [ ] Past appointments ordered most recent first
- [ ] Status badges display correctly (confirmed, completed, cancelled, pending)
- [ ] If no upcoming appointments: empty state shown
- [ ] If no past appointments: empty state shown
- [ ] Only this therapist's appointments shown — no other therapist's records

---

## My Patients `/therapist/patients`

- [ ] Page loads without errors
- [ ] Patient count shown in the subtitle ("N patients seen")
- [ ] Each row shows: avatar initial, patient name, phone number (or —), session count badge, last appointment date
- [ ] Session count badge uses teal styling
- [ ] Patients ordered by most recent appointment first
- [ ] Cancelled appointments are excluded from the session count
- [ ] If no patients: empty state with users icon shown
- [ ] Only patients who have had appointments with this therapist listed

---

## Messages `/therapist/messages`

- [ ] Page loads without errors
- [ ] "Messaging coming soon" placeholder shown
- [ ] Teal message icon displayed
- [ ] Subtitle text present

---

## Sidebar Navigation

- [ ] All links work: Overview, Schedule, My Patients, Messages
- [ ] Active page highlighted in teal on desktop sidebar
- [ ] Navigating between pages updates the active highlight
- [ ] **Log Out** button signs out and redirects to homepage (`/`)
- [ ] Mobile: top bar with Physioflex logo and hamburger icon visible
- [ ] Mobile: tapping the hamburger opens the drawer
- [ ] Mobile: tapping a nav item closes the drawer and navigates
- [ ] Mobile: tapping the overlay closes the drawer

---

## Data Isolation

- [ ] Therapist A cannot see Therapist B's appointments on `/therapist/schedule`
- [ ] Therapist A cannot see patients seen only by Therapist B on `/therapist/patients`
- [ ] Visiting `/therapist` as a patient account redirects to `/portal`
