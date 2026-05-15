# Feature Spec — Admin Dashboard

## Goal
Give clinic staff a single place to manage all operations: bookings, patients, therapists, payments, content, and analytics. Replaces paper-based systems and phone-only booking management.

## Routes (all require admin role)
- `/admin` — overview dashboard
- `/admin/bookings` — all appointments
- `/admin/patients` — patient list + records
- `/admin/therapists` — staff management
- `/admin/finance` — financial reporting
- `/admin/analytics` — usage analytics
- `/admin/content` — blog + services content management

---

## Admin Navigation
- Left sidebar (same dark navy as Patient Portal)
- Logo top-left, role badge "Admin" below
- Nav items: Overview, Bookings, Patients, Therapists, Finance, Analytics, Content, Settings, Log Out

---

## Overview Dashboard (`/admin`)

### KPI Cards (top row — 4 cards)
```
[Today's Appointments]   [This Week Revenue]   [Active Patients]   [Unread Messages]
      8                      N$4,200               142                  3
  3 remaining              ↑12% vs last week    +4 this month
```

### Today's Schedule (main panel)
- Timeline view of all therapist appointments for today
- Colour-coded by therapist
- Click appointment → view details / edit

### Quick Actions
- [+ New Booking] — opens booking modal
- [+ New Patient] — opens patient creation form
- [View All Bookings →]

---

## Bookings Management (`/admin/bookings`)

### Filters
- Date range picker
- Therapist dropdown
- Service type dropdown
- Status: All | Confirmed | Completed | Cancelled | Rescheduled

### Bookings Table
```
Date/Time | Patient | Service | Therapist | Duration | Status | Payment | Actions
22 May 09:00 | Sarah M. | Manual Therapy | Anri | 45 min | Confirmed | Medical Aid | [Edit][Cancel]
22 May 10:00 | Johan V. | Sports Rehab | Marco | 60 min | Confirmed | Paid N$700 | [Edit][Cancel]
```

### Booking Detail Modal
- All booking fields editable
- Therapist reassignment
- Status update dropdown
- Notes / treatment log
- Invoice link

### Calendar View toggle
- Week view: each therapist as a column, time slots as rows
- Click empty slot → create new booking

---

## Patient Management (`/admin/patients`)

### Patient List
- Search by name, phone, email
- Filter by: medical aid / self-pay, therapist assigned, last visit date
- Table: Name | Phone | Email | Medical Aid | Last Visit | Sessions | Actions

### Patient Detail Page (`/admin/patients/[id]`)
- Personal details
- Full appointment history
- Progress notes (therapist can edit)
- Assigned exercise plans
- Invoices
- Message thread

---

## Therapist Management (`/admin/therapists`)

### Therapist List
- Add / edit / deactivate therapist accounts
- Set availability schedule per therapist (weekly recurring pattern)
- View therapist's upcoming bookings

### Availability Schedule Editor
- 7-day grid, time slots (e.g. 08:00–17:00)
- Toggle slots as available / unavailable / break
- Set recurring days off (e.g. every Sunday)
- Block specific dates (holidays, training days)

---

## Financial Reporting (`/admin/finance`)

### Summary Cards
- Total revenue (period selector: today / week / month / year)
- Outstanding invoices (amount + count)
- Medical aid claims pending

### Revenue Breakdown Chart
- Bar chart by week/month
- Colour split: self-pay vs medical aid

### Invoice Table
- All invoices, filterable by status: All | Paid | Pending | Overdue
- Bulk actions: Send reminder | Mark as paid | Export CSV

### Expense Tracking (Phase 2)
- Record clinic expenses
- Net profit calculation

---

## Analytics (`/admin/analytics`)

### Key Metrics
- Peak booking times (heatmap — day × hour)
- Most popular services (bar chart)
- Therapist utilisation rate (% of available slots booked)
- Patient retention rate (% who return within 90 days)
- New vs returning patients (pie chart)
- Cancellation rate

### Geographic (Phase 2)
- Patient postcode/suburb distribution map

---

## Content Management (`/admin/content`)

### Blog Posts
- List of all blog posts with status: Draft | Published | Archived
- [+ New Post] → rich text editor (MDX)
- Edit, publish, unpublish, delete

### Services
- Edit service names, descriptions, durations, prices
- Add / remove services

### Team Profiles
- Edit therapist public profiles (bio, photo, specialisations)
- Separate from therapist admin account settings

### FAQ
- Add, edit, reorder, delete FAQ items
- Live preview before saving

---

## Role Access Summary

| Page | Patient | Therapist | Admin |
|---|---|---|---|
| `/admin` | ✗ | ✗ | ✓ |
| `/admin/bookings` | ✗ | Own only | ✓ |
| `/admin/patients` | ✗ | Own only | ✓ |
| `/admin/finance` | ✗ | ✗ | ✓ |
| `/admin/content` | ✗ | ✗ | ✓ |

---

## Design Tokens
- Admin sidebar: bg `#0d253d` (same as patient portal)
- KPI cards: white bg, border `#e3e8ee`, shadow level 1
- Tables: shadcn Table component
- Charts: use `recharts` (lightweight, React-native)
- Status badges: same colour system as Patient Portal
- Calendar/timeline: custom component or `react-big-calendar`

---

## Dependencies
- `recharts` — charts and analytics
- `react-big-calendar` — week/day calendar view for bookings
- shadcn Table, Dialog, DropdownMenu — already installed
- Role middleware (see SECURITY.md)
