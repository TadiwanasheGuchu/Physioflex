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
  reference: string;
  serviceName: string;
  therapistName: string;
  date: string;
  time: string;
  hoursUntil: 24 | 2;
  manageUrl: string;
}

export function AppointmentReminderEmail({
  patientName,
  reference,
  serviceName,
  therapistName,
  date,
  time,
  hoursUntil,
  manageUrl,
}: Props) {
  const subject =
    hoursUntil === 24
      ? `Reminder: Your appointment is tomorrow — ${reference}`
      : `Your appointment is in 2 hours — ${reference}`;

  const headline =
    hoursUntil === 24 ? "Your appointment is tomorrow 📅" : "Your appointment is in 2 hours 🕐";

  const blurb =
    hoursUntil === 24
      ? "This is a friendly reminder about your Physioflex appointment tomorrow. Please arrive 5 minutes early."
      : "Just a quick reminder — your session starts in 2 hours. We look forward to seeing you!";

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={{ padding: "0 0 24px", textAlign: "center" }}>
            <Heading style={logo}>Physioflex</Heading>
            <Text style={logoSub}>Expert Physiotherapy · Swakopmund, Namibia</Text>
          </Section>

          <Section style={card}>
            <Heading style={h1}>{headline}</Heading>
            <Text style={greeting}>Hi {patientName},</Text>
            <Text style={body2}>{blurb}</Text>

            <Section style={detailsBox}>
              <Row style={detailRow}>
                <Column style={detailIcon}>📅</Column>
                <Column>
                  <Text style={detailLabel}>Date</Text>
                  <Text style={detailValue}>{date}</Text>
                </Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailIcon}>🕐</Column>
                <Column>
                  <Text style={detailLabel}>Time</Text>
                  <Text style={detailValue}>{time}</Text>
                </Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailIcon}>💊</Column>
                <Column>
                  <Text style={detailLabel}>Service</Text>
                  <Text style={detailValue}>{serviceName}</Text>
                </Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailIcon}>👤</Column>
                <Column>
                  <Text style={detailLabel}>Therapist</Text>
                  <Text style={detailValue}>{therapistName}</Text>
                </Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailIcon}>📍</Column>
                <Column>
                  <Text style={detailLabel}>Location</Text>
                  <Text style={detailValue}>Physioflex Clinic, Swakopmund, Namibia</Text>
                </Column>
              </Row>
            </Section>

            {hoursUntil === 24 && (
              <Button style={cancelButton} href={manageUrl}>
                Reschedule or Cancel
              </Button>
            )}

            <Hr style={hr} />

            <Text style={footer2}>
              Reference:{" "}
              <span style={{ fontFamily: "monospace", color: "#0d9488" }}>{reference}</span>
              {" · "}
              <a href="https://wa.me/264811234567" style={link}>
                WhatsApp us
              </a>
            </Text>
          </Section>

          <Section style={{ padding: "20px 0 0", textAlign: "center" }}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Physioflex Clinic · Swakopmund, Namibia
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default AppointmentReminderEmail;

// Styles
const body: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: "40px 0",
};
const container: React.CSSProperties = { maxWidth: "520px", margin: "0 auto" };
const logo: React.CSSProperties = { color: "#0d253d", fontSize: "22px", fontWeight: 300, letterSpacing: "-0.4px", margin: "0 0 4px" };
const logoSub: React.CSSProperties = { color: "#64748d", fontSize: "12px", fontWeight: 300, margin: 0 };
const card: React.CSSProperties = { backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e3e8ee", padding: "32px", boxShadow: "rgba(0,55,112,0.08) 0 8px 24px" };
const h1: React.CSSProperties = { color: "#0d253d", fontSize: "20px", fontWeight: 300, letterSpacing: "-0.4px", margin: "0 0 8px" };
const greeting: React.CSSProperties = { color: "#0d253d", fontSize: "15px", fontWeight: 400, margin: "0 0 4px" };
const body2: React.CSSProperties = { color: "#64748d", fontSize: "14px", fontWeight: 300, margin: "0 0 20px", lineHeight: "1.6" };
const detailsBox: React.CSSProperties = { backgroundColor: "#f6f9fc", borderRadius: "12px", border: "1px solid #e3e8ee", padding: "16px", marginBottom: "24px" };
const detailRow: React.CSSProperties = { marginBottom: "10px" };
const detailIcon: React.CSSProperties = { width: "28px", fontSize: "16px", verticalAlign: "top", paddingTop: "2px" };
const detailLabel: React.CSSProperties = { color: "#64748d", fontSize: "11px", fontWeight: 300, margin: "0 0 1px" };
const detailValue: React.CSSProperties = { color: "#0d253d", fontSize: "14px", fontWeight: 400, margin: 0 };
const cancelButton: React.CSSProperties = { backgroundColor: "#ffffff", borderRadius: "50px", color: "#0d253d", fontSize: "14px", fontWeight: 400, textDecoration: "none", textAlign: "center", display: "block", padding: "12px 24px", marginBottom: "24px", border: "1px solid #e3e8ee" };
const hr: React.CSSProperties = { borderColor: "#e3e8ee", margin: "0 0 20px" };
const footer2: React.CSSProperties = { color: "#64748d", fontSize: "12px", fontWeight: 300, margin: 0 };
const link: React.CSSProperties = { color: "#0d9488", textDecoration: "underline" };
const footerText: React.CSSProperties = { color: "#b0bec5", fontSize: "11px", fontWeight: 300, margin: "0 0 4px" };
