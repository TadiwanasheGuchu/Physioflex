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
  date: string;      // "Thursday, 22 May 2026"
  time: string;      // "09:00 AM"
  manageUrl: string; // full URL to /book/manage
}

export function BookingConfirmationEmail({
  patientName,
  reference,
  serviceName,
  therapistName,
  date,
  time,
  manageUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your Physioflex appointment is confirmed — {reference}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Heading style={logo}>Physioflex</Heading>
                <Text style={logoSub}>Expert Physiotherapy · Swakopmund, Namibia</Text>
              </Column>
            </Row>
          </Section>

          {/* Main card */}
          <Section style={card}>
            <Heading style={h1}>Booking Confirmed ✅</Heading>
            <Text style={greeting}>Hi {patientName},</Text>
            <Text style={body2}>
              Your appointment has been confirmed. We look forward to seeing you.
            </Text>

            {/* Reference badge */}
            <Section style={refBox}>
              <Text style={refLabel}>Booking Reference</Text>
              <Text style={refValue}>{reference}</Text>
            </Section>

            {/* Details */}
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

            <Button style={ctaButton} href={manageUrl}>
              Manage Booking
            </Button>

            <Hr style={hr} />

            <Text style={footer2}>
              Need to cancel or reschedule? You can manage your booking using the button above or by
              contacting us on{" "}
              <a href="https://wa.me/264811234567" style={link}>
                WhatsApp
              </a>
              .
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Physioflex Clinic · Swakopmund, Namibia
            </Text>
            <Text style={footerText}>
              <a href="https://physioflex.na" style={link}>
                physioflex.na
              </a>{" "}
              ·{" "}
              <a href="https://physioflex.na/privacy" style={link}>
                Privacy Policy
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default BookingConfirmationEmail;

// ─── Styles ───────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  margin: 0,
  padding: "40px 0",
};

const container: React.CSSProperties = {
  maxWidth: "520px",
  margin: "0 auto",
};

const header: React.CSSProperties = {
  padding: "0 0 24px",
  textAlign: "center",
};

const logo: React.CSSProperties = {
  color: "#0d253d",
  fontSize: "22px",
  fontWeight: 300,
  letterSpacing: "-0.4px",
  margin: "0 0 4px",
};

const logoSub: React.CSSProperties = {
  color: "#64748d",
  fontSize: "12px",
  fontWeight: 300,
  margin: 0,
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e3e8ee",
  padding: "32px",
  boxShadow: "rgba(0,55,112,0.08) 0 8px 24px",
};

const h1: React.CSSProperties = {
  color: "#0d253d",
  fontSize: "22px",
  fontWeight: 300,
  letterSpacing: "-0.4px",
  margin: "0 0 8px",
};

const greeting: React.CSSProperties = {
  color: "#0d253d",
  fontSize: "15px",
  fontWeight: 400,
  margin: "0 0 4px",
};

const body2: React.CSSProperties = {
  color: "#64748d",
  fontSize: "14px",
  fontWeight: 300,
  margin: "0 0 24px",
};

const refBox: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  borderRadius: "12px",
  border: "1px solid #e3e8ee",
  padding: "16px",
  marginBottom: "20px",
  textAlign: "center",
};

const refLabel: React.CSSProperties = {
  color: "#64748d",
  fontSize: "11px",
  fontWeight: 300,
  margin: "0 0 4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const refValue: React.CSSProperties = {
  color: "#0d9488",
  fontSize: "20px",
  fontWeight: 500,
  fontFamily: "monospace",
  letterSpacing: "3px",
  margin: 0,
};

const detailsBox: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  borderRadius: "12px",
  border: "1px solid #e3e8ee",
  padding: "16px",
  marginBottom: "24px",
};

const detailRow: React.CSSProperties = {
  marginBottom: "10px",
};

const detailIcon: React.CSSProperties = {
  width: "28px",
  fontSize: "16px",
  verticalAlign: "top",
  paddingTop: "2px",
};

const detailLabel: React.CSSProperties = {
  color: "#64748d",
  fontSize: "11px",
  fontWeight: 300,
  margin: "0 0 1px",
};

const detailValue: React.CSSProperties = {
  color: "#0d253d",
  fontSize: "14px",
  fontWeight: 400,
  margin: 0,
};

const ctaButton: React.CSSProperties = {
  backgroundColor: "#0d9488",
  borderRadius: "50px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 400,
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  padding: "12px 24px",
  marginBottom: "24px",
};

const hr: React.CSSProperties = {
  borderColor: "#e3e8ee",
  margin: "0 0 20px",
};

const footer2: React.CSSProperties = {
  color: "#64748d",
  fontSize: "12px",
  fontWeight: 300,
  margin: 0,
  lineHeight: "1.6",
};

const link: React.CSSProperties = {
  color: "#0d9488",
  textDecoration: "underline",
};

const footerSection: React.CSSProperties = {
  padding: "20px 0 0",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  color: "#b0bec5",
  fontSize: "11px",
  fontWeight: 300,
  margin: "0 0 4px",
};
