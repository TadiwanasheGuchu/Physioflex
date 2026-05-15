# Feature Spec — Payments System

## Goal
Allow patients to pay for appointments online via card or mobile money, and give the clinic automated invoicing and payment tracking. Mobile money is critical in Namibia — many patients don't use traditional cards.

## Routes
- `/book/pay` — payment step within booking flow
- `/portal/billing` — patient invoice + payment history (see PATIENT-PORTAL.md)
- `/admin/finance` — financial reporting (see ADMIN.md)

---

## Payment Methods

### 1. Card Payment
- Debit / credit card (Visa, Mastercard)
- Provider: **Stripe** (has ZAR support — usable in Namibia) or **Peach Payments** (SA/Namibia native)
- PCI-compliant hosted payment form — never store card details
- 3D Secure support

### 2. Mobile Money
- **MobiPay** (Namibia's dominant mobile money platform)
- **EasyWallet** (Bank Windhoek)
- Flow: patient enters phone number → receives USSD/push prompt → confirms on phone → webhook confirms payment
- Fallback: generate payment reference for bank EFT

### 3. Medical Aid (not a payment — a claim)
- Not collected through the payments system
- Booking is marked "Medical Aid" → clinic submits claim manually (Phase 1) or via API (Phase 2)
- Patient only pays any co-payment or amount above annual benefit

---

## Payment Flow (within booking)

```
[Booking confirmed — Step 4 complete]
         ↓
[Payment page — /book/pay]
  Show: Service | Therapist | Date | Amount due

  [Pay by Card]      [Pay by Mobile Money]    [Medical Aid — No payment now]

If Card:
  → Stripe/Peach hosted form (iframe or redirect)
  → On success → /book/success with "Paid" badge

If Mobile Money:
  → Input phone number
  → [Send Payment Request]
  → Polling / webhook for confirmation
  → On success → /book/success

If Medical Aid:
  → Input scheme + member number
  → Skip payment → booking confirmed, claim submitted later
```

---

## Invoice Generation
- Auto-generated on booking confirmation
- Invoice fields:
  - Physioflex business details (name, address, VAT number if registered)
  - Patient name + contact
  - Service rendered, date, duration
  - Therapist name
  - Amount, VAT (15% Namibian VAT), total
  - Medical aid claim reference (if applicable)
  - Payment status
- Format: PDF (generated server-side with a library like `@react-pdf/renderer` or `puppeteer`)
- Stored and accessible from `/portal/billing`

---

## Invoice Data Structure

```ts
interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0042"
  patientId: string;
  appointmentId: string;
  therapistId: string;
  lineItems: {
    description: string; // e.g. "Initial Consultation — 60 min"
    quantity: number;
    unitPrice: number; // in NAD cents
    vat: number; // 15%
    total: number;
  }[];
  subtotal: number;
  vatAmount: number;
  total: number; // NAD cents
  currency: "NAD";
  status: "draft" | "sent" | "paid" | "partial" | "overdue";
  paymentMethod?: "card" | "mobile_money" | "medical_aid" | "eft" | "cash";
  paidAt?: string;
  dueDate: string;
  notes?: string;
}
```

---

## Payment History Tracking
- All transactions stored with: date, amount, method, reference, status
- Accessible in patient portal (`/portal/billing`) and admin (`/admin/finance`)
- Export to CSV for accounting purposes

---

## Refund & Credit Flow
- Cancellation >24h before: full refund to original payment method (or clinic credit)
- Cancellation <24h: 50% clinic credit (not cash refund)
- Clinic credit stored on patient account, deducted from next invoice

---

## Financial Reporting (Admin)
- Daily / weekly / monthly revenue summary
- Breakdown by: service type, therapist, payment method, medical aid vs self-pay
- Outstanding invoices list
- Export to CSV

---

## Namibia-Specific Notes
- Currency: NAD (Namibian Dollar), also pegged 1:1 to ZAR
- VAT: 15% (Namibian standard rate)
- Some patients will pay cash in-clinic — admin should be able to mark invoices as "paid by cash"
- MobiPay is the dominant mobile money in Namibia — prioritise over other mobile wallets
- Bank EFT is common for larger amounts — generate a payment reference so clinic can match transfers

---

## Dependencies
- `stripe` npm package or Peach Payments SDK
- `@react-pdf/renderer` for PDF invoice generation
- Webhook endpoint for payment confirmation: `POST /api/webhooks/payment`
- Environment variables: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `MOBIPAY_API_KEY`
