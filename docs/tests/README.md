# Physioflex — Site Functionality Tests

Use these checklists before every deployment or after major changes.

## Test Files

| File | Area | Accounts needed |
|------|------|----------------|
| [01-public-pages.md](01-public-pages.md) | Homepage, team, blog, gallery, contact | None |
| [02-authentication.md](02-authentication.md) | Register, login, forgot password, reset | New or test account |
| [03-booking-flow.md](03-booking-flow.md) | Guest booking, logged-in booking, success page | Optional login |
| [04-patient-portal.md](04-patient-portal.md) | Portal dashboard, appointments, billing, messages, progress, profile | `patient@test.physioflex` |
| [05-admin-panel.md](05-admin-panel.md) | Overview, bookings, patients, therapists, content, analytics, finance | Admin account |
| [06-therapist-dashboard.md](06-therapist-dashboard.md) | Overview, schedule, patients, messages | `therapist@test.physioflex` |

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | `patient@test.physioflex` | `TestPatient123!` |
| Therapist | `therapist@test.physioflex` | `TestTherapist123!` |
| Admin | *(your admin email)* | *(your admin password)* |

Recreate test accounts: `node --env-file=.env.local scripts/create-test-accounts.mjs`

## Test Order

Run in this order for a clean end-to-end pass:

1. Public pages (no login)
2. Authentication
3. Booking flow (guest)
4. Booking flow (logged in as patient)
5. Patient portal
6. Admin panel (verify bookings from step 3 & 4 appear)
7. Therapist dashboard
