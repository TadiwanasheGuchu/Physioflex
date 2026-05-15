# Feature Spec — Security & Authentication

## Goal
Protect sensitive patient health data, implement role-based access, and meet healthcare data standards. Security is a prerequisite for the Patient Portal, Admin Dashboard, and any feature that handles personal or medical information.

## Authentication System

### Provider: NextAuth.js (Auth.js v5)
- Works natively with Next.js App Router
- Supports: email/password, Google OAuth (optional Phase 2)
- JWT sessions stored in httpOnly cookies
- Adapter: Prisma adapter with PostgreSQL

### Auth Routes
```
/auth/login          → Login page
/auth/register       → Patient self-registration
/auth/forgot         → Forgot password form
/auth/reset          → Password reset (token from email)
/auth/verify         → Email verification
```

### Registration Flow (Patient)
1. Patient fills: name, email, phone, WhatsApp, password
2. Verification email sent (via Resend)
3. Patient clicks verify link → account activated
4. Redirected to `/portal`

### Login Flow
- Email + password
- "Remember me" toggle (extends session to 30 days)
- Failed login: lock after 5 attempts for 15 minutes
- On success: redirect to `/portal` (patients) or `/admin` (admin/therapist)

---

## Role-Based Access Control (RBAC)

### Roles
```ts
type Role = "patient" | "therapist" | "admin";
```

### Route Protection

| Route Pattern | Allowed Roles |
|---|---|
| `/portal/*` | patient, therapist (own data), admin |
| `/admin/*` | admin only |
| `/book/*` | public (booking) + patient (portal view) |
| All other routes | public |

### Middleware (`middleware.ts`)
```ts
// Next.js middleware — runs at the edge
// Check session role on every protected route request
// Redirect unauthenticated → /auth/login?redirect=<original_path>
// Redirect wrong role → /403
```

### Row-Level Security
- Therapists can only see their own patients' data
- Patients can only see their own records
- Admin sees everything
- Implemented via Prisma queries filtered by `userId` or `therapistId`

---

## Data Encryption

### Sensitive Fields (encrypt at rest)
- `Patient.medicalAidNumber`
- `Patient.dateOfBirth`
- `Treatment.notes` (therapist clinical notes)
- `Message.body`

### Encryption Method
- AES-256-GCM via Node.js `crypto` module
- Encryption key stored in environment variable: `ENCRYPTION_KEY` (32-byte hex)
- Never logged, never sent to client

### Password Hashing
- `bcrypt` with salt rounds = 12
- Never store plaintext passwords

---

## API Security

### All `/api` Routes
- Validate session on every request (no public API endpoints for patient data)
- Rate limiting: 100 requests/minute per IP (use `upstash/ratelimit` with Redis)
- Input validation: `zod` schemas on all request bodies
- SQL injection prevention: Prisma ORM (parameterised queries by default)
- XSS prevention: React's default JSX escaping + Content Security Policy header

### HTTP Headers (`next.config.ts` headers)
```ts
headers: [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: "..." },
]
```

---

## Privacy & Compliance

### Privacy Policy Page (`/privacy`)
- What data is collected (name, contact, medical aid, health notes)
- How it is used (treatment, billing, communication)
- How long it is stored (active patients: indefinitely; inactive: 5 years per healthcare standard)
- Patient rights: request data export, request deletion
- Contact for data requests: privacy@physioflex.na

### GDPR-Style Controls (even though Namibia uses POPIA-equivalent)
- Cookie consent banner (no tracking cookies without consent)
- Marketing email unsubscribe (one-click, per POPIA)
- Data export request (admin can generate patient data export)
- Data deletion request (admin can anonymise patient record)

### Namibia Data Context
- Namibia's data protection law: **Protection of Personal Information (POPI) Act** (mirrors GDPR)
- Health data = "special personal information" — higher protection standard
- Store all data on servers in South Africa or Europe (Vercel's default regions are compliant)

---

## Session Management
- Session duration: 24h default, 30 days with "Remember me"
- Sessions invalidated on: password change, logout, admin force-logout
- Concurrent sessions: allowed (patients may use phone + laptop)

---

## Audit Logging (Admin actions)
- Log all admin actions: booking edits, patient record changes, user role changes
- Store: who, what, when, before/after values
- Accessible only to super-admin
- Retained for 2 years

---

## Dependencies
- `next-auth` (Auth.js v5) — authentication
- `@auth/prisma-adapter` — database session storage
- `prisma` + `@prisma/client` — ORM
- `bcryptjs` — password hashing
- `zod` — input validation
- `@upstash/ratelimit` + `@upstash/redis` — rate limiting
- `jsonwebtoken` — for custom tokens (booking references, password reset)
- Environment variables:
  - `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - `ENCRYPTION_KEY`
  - `RESEND_API_KEY` (for verification emails)
