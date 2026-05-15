import { Resend } from "resend";
import twilio from "twilio";
import { render } from "@react-email/components";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation";
import { AppointmentReminderEmail } from "@/emails/appointment-reminder";
import { InvoiceEmail } from "@/emails/invoice";

// ─── Clients (lazy-init so missing keys don't break builds) ───────────────────

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials are not set");
  return twilio(sid, token);
}

const FROM_EMAIL = "appointments@physioflex.na";
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886"; // Twilio sandbox default
const CLINIC_PHONE = "+264640000000"; // replace with real clinic number

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingData {
  patientName: string;
  patientEmail: string;
  patientWhatsapp: string | null;
  reference: string;
  serviceName: string;
  therapistName: string;
  date: string;   // "Thursday, 22 May 2026"
  time: string;   // "09:00 AM"
  siteUrl: string;
}

export interface ReminderData extends BookingData {
  hoursUntil: 24 | 2;
}

export interface InvoiceData {
  patientName: string;
  patientEmail: string;
  patientWhatsapp: string | null;
  invoiceNumber: string;
  serviceName: string;
  therapistName: string;
  date: string;
  amountNAD: number;
  status: "paid" | "due";
  payUrl?: string;
}

// ─── Email helpers ─────────────────────────────────────────────────────────────

async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const resend = getResend();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
  } catch (err) {
    console.error("[notifications] email failed:", err);
  }
}

// ─── WhatsApp helpers ─────────────────────────────────────────────────────────

async function sendWhatsApp(to: string, body: string) {
  if (!to) return;
  const normalized = to.startsWith("+") ? to : `+${to}`;
  try {
    const client = getTwilioClient();
    await client.messages.create({
      from: WHATSAPP_FROM,
      to: `whatsapp:${normalized}`,
      body,
    });
  } catch (err) {
    console.error("[notifications] WhatsApp failed:", err);
  }
}

// ─── Public notification functions ────────────────────────────────────────────

export async function sendBookingConfirmation(data: BookingData) {
  const manageUrl = `${data.siteUrl}/book/manage?ref=${data.reference}`;

  // Email
  const html = await render(
    BookingConfirmationEmail({
      patientName: data.patientName,
      reference: data.reference,
      serviceName: data.serviceName,
      therapistName: data.therapistName,
      date: data.date,
      time: data.time,
      manageUrl,
    })
  );

  await sendEmail({
    to: data.patientEmail,
    subject: `Booking Confirmed — ${data.reference} | Physioflex`,
    html,
  });

  // WhatsApp
  if (data.patientWhatsapp) {
    const msg =
      `Hi ${data.patientName}, your appointment at Physioflex is confirmed ✅\n\n` +
      `📅 ${data.date} at ${data.time}\n` +
      `👤 Therapist: ${data.therapistName}\n` +
      `📍 Swakopmund Clinic\n\n` +
      `Reference: ${data.reference}\n` +
      `Manage booking: ${manageUrl}\n\n` +
      `Reply HELP for assistance.`;
    await sendWhatsApp(data.patientWhatsapp, msg);
  }
}

export async function sendAppointmentReminder(data: ReminderData) {
  const manageUrl = `${data.siteUrl}/book/manage?ref=${data.reference}`;

  // Email
  const html = await render(
    AppointmentReminderEmail({
      patientName: data.patientName,
      reference: data.reference,
      serviceName: data.serviceName,
      therapistName: data.therapistName,
      date: data.date,
      time: data.time,
      hoursUntil: data.hoursUntil,
      manageUrl,
    })
  );

  const subject =
    data.hoursUntil === 24
      ? `Reminder: Your appointment is tomorrow — ${data.reference}`
      : `Your Physioflex appointment is in 2 hours — ${data.reference}`;

  await sendEmail({ to: data.patientEmail, subject, html });

  // WhatsApp
  if (data.patientWhatsapp) {
    const msg =
      data.hoursUntil === 24
        ? `Hi ${data.patientName}, reminder: your Physioflex appointment is tomorrow.\n\n` +
          `📅 ${data.date} at ${data.time} with ${data.therapistName}\n\n` +
          `Need to cancel? Visit: ${manageUrl}`
        : `Hi ${data.patientName}, your Physioflex appointment starts in 2 hours!\n\n` +
          `📅 ${data.date} at ${data.time}\n` +
          `📍 Swakopmund Clinic\n\nSee you soon! 💪`;
    await sendWhatsApp(data.patientWhatsapp, msg);
  }
}

export async function sendRecoveryCheckIn(data: {
  patientName: string;
  patientWhatsapp: string | null;
  therapistName: string;
  portalUrl: string;
}) {
  if (!data.patientWhatsapp) return;
  const msg =
    `Hi ${data.patientName}, how are you feeling after your session with ${data.therapistName}? 💪\n\n` +
    `Remember to complete your exercises:\n${data.portalUrl}/portal/resources\n\n` +
    `Reply to let us know how your recovery is going!`;
  await sendWhatsApp(data.patientWhatsapp, msg);
}

export async function sendInvoiceEmail(data: InvoiceData) {
  const html = await render(
    InvoiceEmail({
      patientName: data.patientName,
      invoiceNumber: data.invoiceNumber,
      serviceName: data.serviceName,
      therapistName: data.therapistName,
      date: data.date,
      amountNAD: data.amountNAD,
      status: data.status,
      payUrl: data.payUrl,
    })
  );

  await sendEmail({
    to: data.patientEmail,
    subject:
      data.status === "paid"
        ? `Payment Receipt — ${data.invoiceNumber} | Physioflex`
        : `Invoice — ${data.invoiceNumber} — N$${data.amountNAD} | Physioflex`,
    html,
  });

  // WhatsApp for paid receipts
  if (data.patientWhatsapp && data.status === "paid") {
    const msg =
      `Hi ${data.patientName}, your payment of N$${data.amountNAD} for ${data.serviceName} has been received. ✅\n\n` +
      `Invoice: ${data.invoiceNumber}\n` +
      `Thank you for choosing Physioflex!`;
    await sendWhatsApp(data.patientWhatsapp, msg);
  }
}
