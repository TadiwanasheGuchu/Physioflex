# Feature Spec — Patient Portal

## Goal
Give patients a personal dashboard to manage their relationship with Physioflex — view appointments, track recovery, download exercise plans, message their therapist, and access invoices. Reduces admin calls and increases patient retention.

## Routes (all require authentication)
- `/portal` — dashboard overview
- `/portal/appointments` — appointment history + upcoming
- `/portal/progress` — treatment progress tracker
- `/portal/resources` — personal exercise plans (assigned by therapist)
- `/portal/messages` — messaging thread with therapist
- `/portal/billing` — invoices + payment history
- `/portal/profile` — personal details, medical aid info, password

---

## Dashboard Overview (`/portal`)

### Layout
```
[Sidebar — desktop] | [Main content — full width mobile]

Sidebar items:
  - Overview (home icon)
  - My Appointments (calendar icon)
  - Progress (activity icon)
  - Exercise Plans (file icon)
  - Messages (message icon) [unread badge]
  - Billing (receipt icon)
  - Profile (user icon)
  - Log Out
```

### Overview Cards (4 stat cards)
```
[Next Appointment]     [Sessions Completed]   [Exercises Assigned]  [Messages]
"Thu 22 May, 09:00"    "6 sessions"           "3 plans"             "2 unread"
Manual Therapy         with Anri van der Berg
```

### Quick Actions
- [Book Next Appointment →]
- [Download Latest Exercise Plan →]
- [Message My Therapist →]

---

## Appointments (`/portal/appointments`)

### Tabs: Upcoming | Past

**Upcoming appointments table**
```
Date & Time | Service | Therapist | Status | Actions
Thu 22 May 09:00 | Manual Therapy | Anri v.d. Berg | Confirmed | [Reschedule] [Cancel]
```

**Past appointments table**
```
Date | Service | Therapist | Duration | Invoice
12 May 2026 | Sports Rehab | Marco Shiimi | 45 min | [Download PDF]
```

---

## Progress Tracker (`/portal/progress`)
- Therapist updates this — patient views only
- Timeline of sessions with notes
- Pain level chart (1–10 scale over time) — simple line chart
- Functional goals with completion status (checkboxes, marked by therapist)
- Next milestone highlighted

---

## Exercise Plans (`/portal/resources`)
- Cards per assigned plan (e.g. "Lower Back Programme — Week 3")
- Each plan: list of exercises with sets/reps, description, video link
- [Download PDF] per plan
- Plans are assigned by the therapist (admin/therapist side)

---

## Messaging (`/portal/messages`)
- Simple thread per therapist
- Text messages only (Phase 1)
- File attachment support (Phase 2)
- Read receipts
- Sonner toast notification when new message arrives
- WhatsApp fallback link if patient prefers

---

## Billing (`/portal/billing`)

### Tabs: Invoices | Payments

**Invoices table**
```
Invoice # | Date | Service | Amount | Status | Action
INV-0042 | 12 May 2026 | Initial Consultation | N$700 | Paid | [Download PDF]
INV-0043 | 22 May 2026 | Manual Therapy | N$420 | Due | [Pay Now]
```

**Payment history**
```
Date | Amount | Method | Reference
12 May 2026 | N$700 | Medical Aid (PSEMAS) | CLM-928471
```

---

## Profile (`/portal/profile`)
- Personal details: name, DOB, phone, WhatsApp, email
- Address: Swakopmund + suburb
- Emergency contact: name + phone
- Medical aid details: scheme, member number, dependent code
- Password change section
- Notification preferences: Email / WhatsApp / SMS toggles
- [Save Changes] button with Sonner success toast

---

## Data Structure

```ts
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  dob: string;
  address: string;
  emergencyContact: { name: string; phone: string };
  medicalAid?: { scheme: string; memberNumber: string; dependentCode?: string };
  notificationPrefs: { email: boolean; whatsapp: boolean; sms: boolean };
}

interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  serviceId: string;
  date: string; // ISO
  duration: number; // minutes
  status: "confirmed" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
}

interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: "patient" | "therapist";
  body: string;
  sentAt: string;
  read: boolean;
}
```

---

## Design Tokens
- Portal sidebar bg: `#0d253d` (dark navy — same as footer)
- Sidebar active item: bg `#0d9488`, text white, `rounded-md`
- Sidebar inactive: text `#64748d`, hover text white
- Main content bg: `#f6f9fc` (canvas-soft)
- Stat cards: white bg, border `#e3e8ee`, shadow level 1, `rounded-xl`
- Tables: `shadcn/ui` Table component (already installed)
- Status badges: Confirmed → teal, Completed → grey, Cancelled → red, Pending → amber

---

## Auth Requirement
Patient Portal requires authentication (see SECURITY.md).
Redirect unauthenticated users to `/auth/login?redirect=/portal`.
