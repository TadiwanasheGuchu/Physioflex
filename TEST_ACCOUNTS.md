# Physioflex — Test Accounts

> Run `node --env-file=.env.local scripts/create-test-accounts.mjs` to recreate these accounts at any time.

---

## Admin

| Field    | Value                        |
|----------|------------------------------|
| Email    | *(your production admin email)* |
| Password | *(set during setup)*         |
| Access   | `/admin`                     |

The admin account is created separately via `scripts/create-admin.mjs`.  
See `PROGRESS.md` → Authentication & Users for details.

---

## Patient — James Nakale

| Field         | Value                        |
|---------------|------------------------------|
| Email         | `patient@test.physioflex`    |
| Password      | `TestPatient123!`            |
| Role          | patient                      |
| DOB           | 15 March 1990                |
| Medical aid   | NHP · NHP-987654             |
| Phone         | +264 81 555 0001             |
| Login URL     | `/auth/login`                |
| Portal URL    | `/portal`                    |

What this account can do → see `docs/PATIENT_GUIDE.md`

---

## Therapist — Susan Mubatapasango

| Field      | Value                             |
|------------|-----------------------------------|
| Email      | `therapist@test.physioflex`       |
| Password   | `TestTherapist123!`               |
| Role       | therapist                         |
| Linked to  | Susan Mubatapasango (therapists table) |
| Login URL  | `/auth/login`                     |
| Portal URL | `/portal`                         |

What this account can do → see `docs/THERAPIST_GUIDE.md`

---

## Quick Login Links

| Role      | URL                      |
|-----------|--------------------------|
| Admin     | `/auth/login` → `/admin` |
| Patient   | `/auth/login` → `/portal`|
| Therapist | `/auth/login` → `/portal`|
