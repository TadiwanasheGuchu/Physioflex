import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

interface Props {
  patientName: string;
  invoiceNumber: string;
  serviceName: string;
  therapistName: string;
  date: string;
  amountNAD: number;
  status: "paid" | "due";
  payUrl?: string;
}

export function InvoiceEmail({
  patientName,
  invoiceNumber,
  serviceName,
  therapistName,
  date,
  amountNAD,
  status,
  payUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        {status === "paid"
          ? `Payment receipt — ${invoiceNumber}`
          : `Invoice due — ${invoiceNumber} — N$${amountNAD}`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={{ padding: "0 0 24px", textAlign: "center" }}>
            <Heading style={logo}>Physioflex</Heading>
            <Text style={logoSub}>Expert Physiotherapy · Swakopmund, Namibia</Text>
          </Section>

          <Section style={card}>
            <Heading style={h1}>
              {status === "paid" ? "Payment Received ✅" : "Invoice 🧾"}
            </Heading>
            <Text style={greeting}>Hi {patientName},</Text>
            <Text style={body2}>
              {status === "paid"
                ? "Thank you — your payment has been received. Please find your invoice details below."
                : "Please find your invoice below. Payment is due at your appointment."}
            </Text>

            {/* Invoice box */}
            <Section style={invoiceBox}>
              <Row style={{ marginBottom: "8px" }}>
                <Column>
                  <Text style={invoiceLabel}>Invoice Number</Text>
                  <Text style={invoiceValue}>{invoiceNumber}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={invoiceLabel}>Date</Text>
                  <Text style={invoiceValue}>{date}</Text>
                </Column>
              </Row>

              <Hr style={{ borderColor: "#e3e8ee", margin: "12px 0" }} />

              <Row style={{ marginBottom: "6px" }}>
                <Column>
                  <Text style={lineLabel}>{serviceName}</Text>
                  <Text style={lineSubLabel}>with {therapistName}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={lineAmount}>N${amountNAD.toLocaleString()}</Text>
                </Column>
              </Row>

              <Hr style={{ borderColor: "#e3e8ee", margin: "12px 0" }} />

              <Row>
                <Column>
                  <Text style={totalLabel}>Total</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={totalAmount}>N${amountNAD.toLocaleString()}</Text>
                </Column>
              </Row>

              <Row>
                <Column style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 400,
                      padding: "2px 10px",
                      borderRadius: "50px",
                      backgroundColor: status === "paid" ? "#f0fdf9" : "#fef3c7",
                      color: status === "paid" ? "#0d9488" : "#92400e",
                      border: `1px solid ${status === "paid" ? "#0d9488" : "#fbbf24"}`,
                    }}
                  >
                    {status === "paid" ? "PAID" : "DUE"}
                  </span>
                </Column>
              </Row>
            </Section>

            {status === "due" && payUrl && (
              <Button style={ctaButton} href={payUrl}>
                Pay Now
              </Button>
            )}

            <Hr style={hr} />

            <Text style={footer2}>
              Questions about this invoice?{" "}
              <a href="https://wa.me/264811234567" style={link}>
                WhatsApp us
              </a>{" "}
              or call{" "}
              <a href="tel:+264640000000" style={link}>
                +264 64 000 0000
              </a>
              .
            </Text>

            <Text style={{ ...footer2, marginTop: "8px" }}>
              Medical aid members: present this invoice to your scheme for direct reimbursement.
            </Text>
          </Section>

          <Section style={{ padding: "20px 0 0", textAlign: "center" }}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Physioflex Clinic · Swakopmund, Namibia
            </Text>
            <Text style={footerText}>
              Reg. No. XXXXXXX · VAT No. XXXXXXX
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InvoiceEmail;

const body: React.CSSProperties = { backgroundColor: "#f6f9fc", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", margin: 0, padding: "40px 0" };
const container: React.CSSProperties = { maxWidth: "520px", margin: "0 auto" };
const logo: React.CSSProperties = { color: "#0d253d", fontSize: "22px", fontWeight: 300, letterSpacing: "-0.4px", margin: "0 0 4px" };
const logoSub: React.CSSProperties = { color: "#64748d", fontSize: "12px", fontWeight: 300, margin: 0 };
const card: React.CSSProperties = { backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e3e8ee", padding: "32px", boxShadow: "rgba(0,55,112,0.08) 0 8px 24px" };
const h1: React.CSSProperties = { color: "#0d253d", fontSize: "22px", fontWeight: 300, letterSpacing: "-0.4px", margin: "0 0 8px" };
const greeting: React.CSSProperties = { color: "#0d253d", fontSize: "15px", fontWeight: 400, margin: "0 0 4px" };
const body2: React.CSSProperties = { color: "#64748d", fontSize: "14px", fontWeight: 300, margin: "0 0 24px", lineHeight: "1.6" };
const invoiceBox: React.CSSProperties = { backgroundColor: "#f6f9fc", borderRadius: "12px", border: "1px solid #e3e8ee", padding: "20px", marginBottom: "24px" };
const invoiceLabel: React.CSSProperties = { color: "#64748d", fontSize: "11px", fontWeight: 300, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.5px" };
const invoiceValue: React.CSSProperties = { color: "#0d253d", fontSize: "14px", fontWeight: 400, margin: 0 };
const lineLabel: React.CSSProperties = { color: "#0d253d", fontSize: "14px", fontWeight: 400, margin: "0 0 2px" };
const lineSubLabel: React.CSSProperties = { color: "#64748d", fontSize: "12px", fontWeight: 300, margin: 0 };
const lineAmount: React.CSSProperties = { color: "#0d253d", fontSize: "14px", fontWeight: 400, margin: 0 };
const totalLabel: React.CSSProperties = { color: "#0d253d", fontSize: "15px", fontWeight: 500, margin: 0 };
const totalAmount: React.CSSProperties = { color: "#0d253d", fontSize: "18px", fontWeight: 500, margin: 0 };
const ctaButton: React.CSSProperties = { backgroundColor: "#0d9488", borderRadius: "50px", color: "#ffffff", fontSize: "14px", fontWeight: 400, textDecoration: "none", textAlign: "center", display: "block", padding: "12px 24px", marginBottom: "24px" };
const hr: React.CSSProperties = { borderColor: "#e3e8ee", margin: "0 0 20px" };
const footer2: React.CSSProperties = { color: "#64748d", fontSize: "12px", fontWeight: 300, margin: 0, lineHeight: "1.6" };
const link: React.CSSProperties = { color: "#0d9488", textDecoration: "underline" };
const footerText: React.CSSProperties = { color: "#b0bec5", fontSize: "11px", fontWeight: 300, margin: "0 0 4px" };
