# Therapist Testing Guide

Login: `therapist@test.physioflex` / `TestTherapist123!`  
Linked therapist record: **Susan Mubatapasango**

---

## Role Overview

The therapist account is a Supabase auth user with `role = 'therapist'` in the profiles table.
It is linked to Susan's row in the `therapists` table via `user_id`.

Currently the app does not have a separate therapist-only dashboard — therapists log into the same patient portal (`/portal`). The portal shows their own patient data (if any) and lets them use the messaging system.

Admin-level management of therapist schedules and appointment history is done through the **Admin panel** (requires admin role).

---

## 1. Login

1. Go to `/auth/login`
2. Enter `therapist@test.physioflex` / `TestTherapist123!`
3. You land on `/portal`

---

## 2. What the Therapist Can Access

| Feature | Available | Notes |
|---------|-----------|-------|
| Patient portal | Yes | Same as a regular patient |
| Messages | Yes | Can message the admin/clinic |
| Admin panel | No | Requires `role = 'admin'` |
| Own appointment schedule | Not yet | Planned — therapist-specific view |

---

## 3. Public Profile (no login needed)

Susan's therapist profile is visible on:
- `/team` — team listing page
- Booking flow Step 2 — therapist selection card

To check Susan's public card:
1. Go to `/team`
2. Susan Mubatapasango should appear with her photo, title, and specialisations

---

## 4. Therapist Data in Admin Panel

Log in as admin and go to `/admin/therapists` to see:
- Susan's profile (name, title, HPCNA number placeholder, specialisations)
- Upcoming appointment count (pulled from `appointments` table)
- Active/inactive toggle

From `/admin/patients` → click any patient → Appointment History shows which therapist handled each session.

---

## 5. Linking / Unlinking the Account

If you need to re-link the test therapist account to a different therapist row, run this SQL in Supabase → SQL Editor:

```sql
-- Find the test user's ID
SELECT id FROM auth.users WHERE email = 'therapist@test.physioflex';

-- Link to a therapist row
UPDATE public.therapists
SET user_id = '<user-id-from-above>'
WHERE first_name = 'Susan' AND last_name = 'Mubatapasango';
```

Or re-run the setup script which does this automatically:
```
node --env-file=.env.local scripts/create-test-accounts.mjs
```

---

## Expected Outcomes Checklist

- [ ] Login succeeds, redirects to `/portal`
- [ ] Susan's card appears on `/team`
- [ ] Susan appears as a selectable therapist in the booking flow
- [ ] In Admin → Therapists, Susan's row shows correct upcoming appointment count
