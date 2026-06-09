import { Resend } from "resend";
import { render } from "@react-email/components";
import { BookingConfirmationEmail } from "@/emails/booking-confirmation";
import { AppointmentReminderEmail } from "@/emails/appointment-reminder";
import { InvoiceEmail } from "@/emails/invoice";

// ─── Email client ─────────────────────────────────────────────────────────────

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM_EMAIL = "appointments@physioflex.na";

// ─── WhatsApp stub ────────────────────────────────────────────────────────────
// Replace this function body with your chosen provider (Meta Cloud API, Fonnte, etc.)
// Expected env vars will depend on the provider you pick.

async function sendWhatsApp(to: string, body: string): Promise<void> {
  // TODO: integrate WhatsApp provider
  // Meta Cloud API example:
  //   POST https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages
  //   Authorization: Bearer {WHATSAPP_TOKEN}
  //   Body: { messaging_product: "whatsapp", to, type: "text", text: { body } }
  console.log(`[whatsapp stub] to=${to} | ${body.slice(0, 60)}...`);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookingData {
  patientName: string;
  patientEmail: string;
  patientWhatsapp: string | null;
  reference: string;
  serviceName: string;
  therapistName: string;
  date: string;
  time: string;
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

// ─── Email helper ─────────────────────────────────────────────────────────────

async function sendEmail(opts: { to: string; subject: string; html: string }) {
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

// ─── Public notification functions ────────────────────────────────────────────

export async function sendBookingConfirmation(data: BookingData) {
  const manageUrl = `${data.siteUrl}/book/manage?ref=${data.reference}`;

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

  if (data.patientWhatsapp) {
    const msg =
      `Hi ${data.patientName}, your appointment at Physioflex is confirmed ✅\n\n` +
      `📅 ${data.date} at ${data.time}\n` +
      `👤 Therapist: ${data.therapistName}\n` +
      `📍 Swakopmund Clinic\n\n` +
      `Reference: ${data.reference}\n` +
      `Manage booking: ${manageUrl}`;
    await sendWhatsApp(data.patientWhatsapp, msg);
  }
}

export async function sendAppointmentReminder(data: ReminderData) {
  const manageUrl = `${data.siteUrl}/book/manage?ref=${data.reference}`;

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

  if (data.patientWhatsapp && data.status === "paid") {
    const msg =
      `Hi ${data.patientName}, your payment of N$${data.amountNAD} for ${data.serviceName} has been received. ✅\n\n` +
      `Invoice: ${data.invoiceNumber}\n` +
      `Thank you for choosing Physioflex!`;
    await sendWhatsApp(data.patientWhatsapp, msg);
  }
}

export async function sendReviewRequest(data: {
  patientName: string;
  patientEmail: string;
  patientWhatsapp: string | null;
  appointmentId: string;
  serviceName: string;
  therapistName: string;
  siteUrl: string;
}) {
  const token = Buffer.from(data.appointmentId).toString("base64url");
  const reviewUrl = `${data.siteUrl}/reviews/submit?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: #ccfbf1; display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">⭐</div>
      </div>
      <h1 style="font-size: 20px; color: #0d253d; margin: 0 0 8px; font-weight: 600; text-align: center;">How was your session, ${data.patientName}?</h1>
      <p style="color: #6b7a99; font-size: 14px; text-align: center; margin: 0 0 24px;">
        Your <strong>${data.serviceName}</strong> session with ${data.therapistName} is now complete.<br>
        We'd love to hear your feedback — it only takes 1 minute.
      </p>
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${reviewUrl}" style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 14px 32px; border-radius: 100px; font-size: 14px; font-weight: 500;">
          Leave a Review →
        </a>
      </div>
      <p style="font-size: 12px; color: #6b7a99; text-align: center;">
        Your review helps other patients in Swakopmund find the right physiotherapy care.<br>
        This link is personal to you — no login required.
      </p>
    </div>
  `;

  await sendEmail({
    to: data.patientEmail,
    subject: `How was your session? — Physioflex`,
    html,
  });

  if (data.patientWhatsapp) {
    const msg =
      `Hi ${data.patientName}! 👋\n\n` +
      `Your ${data.serviceName} session with ${data.therapistName} is now complete.\n\n` +
      `We'd love to hear your feedback — it only takes 1 minute:\n${reviewUrl}\n\n` +
      `Thank you for choosing Physioflex! 🙏`;
    await sendWhatsApp(data.patientWhatsapp, msg);
  }
}
