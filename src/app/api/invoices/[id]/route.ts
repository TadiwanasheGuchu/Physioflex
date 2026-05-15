import { createClient } from "@/lib/supabase/server";
import { generateInvoicePDF } from "@/lib/invoice-pdf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  // Fetch invoice with related data
  const { data: invoice } = await supabase
    .from("invoices")
    .select(
      "id, number, amount_nad, status, paid_at, created_at, " +
      "appointments(reference, starts_at, services(name, duration_min), therapists(first_name, last_name)), " +
      "patients(first_name, last_name, user_id)"
    )
    .eq("id", id)
    .single();

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  const inv = invoice as any;

  // Verify ownership
  if (inv.patients?.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 403 });
  }

  const patientEmail = user.email ?? "";
  const appt = inv.appointments;
  const date = appt?.starts_at
    ? new Date(appt.starts_at).toLocaleDateString("en-NA", { day: "numeric", month: "long", year: "numeric" })
    : new Date(inv.created_at).toLocaleDateString("en-NA", { day: "numeric", month: "long", year: "numeric" });

  const pdfBuffer = await generateInvoicePDF({
    invoiceNumber: inv.number,
    date,
    dueDate: date,
    patientName: `${inv.patients.first_name} ${inv.patients.last_name}`,
    patientEmail,
    serviceName: appt?.services?.name ?? "Physiotherapy Session",
    therapistName: appt?.therapists
      ? `${appt.therapists.first_name} ${appt.therapists.last_name}`
      : "Physioflex Therapist",
    durationMin: appt?.services?.duration_min ?? 60,
    amountNAD: inv.amount_nad,
    vatRate: 0.15,
    status: inv.status === "paid" ? "paid" : "due",
    reference: appt?.reference ?? inv.number,
  });

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${inv.number}.pdf"`,
    },
  });
}
