# Admin Testing Guide

The admin account is your production admin email (see `PROGRESS.md`).  
Access the panel at `/admin` after logging in.

---

## 1. Login

1. Go to `/auth/login`
2. Sign in with the admin credentials
3. You are redirected to `/admin` — the overview dashboard

> Any account with `role = 'admin'` in the `profiles` table gets access.  
> Non-admin users who try `/admin` are redirected to `/portal`.

---

## 2. Overview Dashboard (`/admin`)

Shows today's schedule and KPI cards. Test by verifying:
- **Today's Appointments** count matches bookings made today
- **This Week Revenue** reflects paid invoices created this week
- **Total Patients** matches the count in the Patients section
- **Unread Messages** badge updates when new messages arrive

---

## 3. Bookings (`/admin/bookings`)

| Action | How |
|--------|-----|
| View all appointments | The table loads all records — no RLS filter |
| Filter by status | Use the Status dropdown (confirmed / completed / cancelled / pending / no_show) |
| Filter by therapist | Use the Therapist dropdown |
| Filter by date | Use the date picker |
| Search | Type a patient name or reference number (e.g. `PF-2026-`) |

**To test with the patient account:**
1. Log in as `patient@test.physioflex` in a separate browser/tab and make a booking
2. Return to admin Bookings — the new appointment should appear immediately on refresh

---

## 4. Patients (`/admin/patients`)

- Lists all patients (both registered and guest bookings)
- Click any patient row to open the detail view
- Detail view shows: profile info, appointment history, invoices, progress logs

**Test patient:** James Nakale (`patient@test.physioflex`)

---

## 5. Therapists (`/admin/therapists`)

- Lists Susan Mubatapasango and Vimbai Shumba
- Shows upcoming appointment count per therapist
- Active/inactive toggle — deactivating hides the therapist from the booking flow

---

## 6. Content (`/admin/content`)

### Services
- Add a new service: click **Add Service**, fill in name/description/duration/price
- Edit a service: click the pencil icon on any row
- Deactivate: toggle the Active switch — deactivated services are hidden from `/book`

### Reviews
- Pending reviews submitted via `/reviews` appear here
- **Approve** → review goes live on `/reviews` (public)
- **Reject** → review is hidden
- **Reply** → add an admin response visible to the patient

---

## 7. Analytics (`/admin/analytics`)

Charts built from the last 6 months of appointment data. Sections:
- Bookings over time (bar chart)
- Status breakdown (confirmed / completed / cancelled)
- Top services by booking count
- Therapist workload comparison

---

## 8. Finance (`/admin/finance`)

- Lists all invoices from the last 6 months
- Grouped by status: unpaid / paid / void
- Revenue totals at the top

> Invoices are currently created manually or through future automation. To create a test invoice, use the Supabase dashboard → Table Editor → `invoices` table.

---

## 9. Promoting a User to Admin

To give any registered user admin access, run in Supabase → SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'the-user@email.com';
```

---

## Expected Outcomes Checklist

- [ ] `/admin` loads with real data (not zeros)
- [ ] Booking made by James Nakale appears in Bookings table
- [ ] Patient detail page for James Nakale shows appointment history
- [ ] Approving a review makes it visible on `/reviews`
- [ ] Deactivating a service hides it from `/book`
- [ ] Analytics charts render with booking data
