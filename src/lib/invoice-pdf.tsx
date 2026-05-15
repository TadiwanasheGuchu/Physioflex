"use server";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  patientName: string;
  patientEmail: string;
  serviceName: string;
  therapistName: string;
  durationMin: number;
  amountNAD: number;
  vatRate: number; // 0.15
  status: "paid" | "due";
  reference: string;
}

const VAT_RATE = 0.15;

function InvoiceDocument({ data }: { data: InvoiceData }) {
  const subtotal = Math.round(data.amountNAD / (1 + VAT_RATE));
  const vat = data.amountNAD - subtotal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.clinicName}>Physioflex</Text>
            <Text style={styles.clinicDetail}>Expert Physiotherapy</Text>
            <Text style={styles.clinicDetail}>Swakopmund, Namibia</Text>
            <Text style={styles.clinicDetail}>Tel: +264 64 000 0000</Text>
            <Text style={styles.clinicDetail}>info@physioflex.na</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>
            <View style={[styles.statusBadge, data.status === "paid" ? styles.statusPaid : styles.statusDue]}>
              <Text style={styles.statusText}>{data.status === "paid" ? "PAID" : "DUE"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill to / Invoice details */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>BILL TO</Text>
            <Text style={styles.metaValue}>{data.patientName}</Text>
            <Text style={styles.metaSubValue}>{data.patientEmail}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>INVOICE DATE</Text>
            <Text style={styles.metaValue}>{data.date}</Text>
            <Text style={styles.metaLabel} />
            <Text style={styles.metaLabel}>DUE DATE</Text>
            <Text style={styles.metaValue}>{data.dueDate}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>REFERENCE</Text>
            <Text style={[styles.metaValue, styles.mono]}>{data.reference}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Line items table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 3 }]}>Description</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, textAlign: "center" }]}>Qty</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Unit Price</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1, textAlign: "right" }]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>
              {data.serviceName} — {data.durationMin} min{"\n"}
              <Text style={styles.tableSubText}>Therapist: {data.therapistName}</Text>
            </Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>1</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>N${subtotal.toFixed(2)}</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>N${subtotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal (excl. VAT)</Text>
            <Text style={styles.totalsValue}>N${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>VAT (15%)</Text>
            <Text style={styles.totalsValue}>N${vat.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalsRow}>
            <Text style={styles.totalsFinalLabel}>TOTAL</Text>
            <Text style={styles.totalsFinalValue}>N${data.amountNAD.toFixed(2)}</Text>
          </View>
        </View>

        {/* Banking details */}
        <View style={styles.bankingSection}>
          <Text style={styles.bankingTitle}>Banking Details (EFT)</Text>
          <Text style={styles.bankingDetail}>Bank: Bank Windhoek</Text>
          <Text style={styles.bankingDetail}>Account Name: Physioflex Clinic</Text>
          <Text style={styles.bankingDetail}>Account Number: 000 000 0000</Text>
          <Text style={styles.bankingDetail}>Branch Code: 483 872</Text>
          <Text style={styles.bankingDetail}>Reference: {data.reference}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing Physioflex · physioflex.na · Registered in Namibia
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} />);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#0d253d" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  clinicName: { fontSize: 18, fontWeight: "bold", color: "#0d9488", marginBottom: 4 },
  clinicDetail: { fontSize: 9, color: "#64748d", lineHeight: 1.5 },
  headerRight: { alignItems: "flex-end" },
  invoiceTitle: { fontSize: 22, fontWeight: "bold", color: "#0d253d", letterSpacing: 2 },
  invoiceNumber: { fontSize: 11, color: "#64748d", marginTop: 4, marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 50 },
  statusPaid: { backgroundColor: "#f0fdf9" },
  statusDue: { backgroundColor: "#fef3c7" },
  statusText: { fontSize: 9, fontWeight: "bold" },
  divider: { borderBottom: "1pt solid #e3e8ee", marginVertical: 16 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  metaCol: { flex: 1 },
  metaLabel: { fontSize: 8, color: "#64748d", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3, marginTop: 6 },
  metaValue: { fontSize: 10, color: "#0d253d", fontWeight: "bold" },
  metaSubValue: { fontSize: 9, color: "#64748d" },
  mono: { fontFamily: "Courier" },
  table: { marginTop: 8 },
  tableRow: { flexDirection: "row", paddingVertical: 8 },
  tableHeader: { backgroundColor: "#f6f9fc", borderRadius: 4, paddingHorizontal: 8 },
  tableHeaderText: { fontSize: 8, color: "#64748d", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "bold" },
  tableCell: { fontSize: 10, color: "#0d253d", paddingHorizontal: 8, paddingVertical: 6 },
  tableSubText: { fontSize: 9, color: "#64748d" },
  totalsSection: { marginTop: 16, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 4, width: 240 },
  totalsLabel: { flex: 1, fontSize: 10, color: "#64748d" },
  totalsValue: { fontSize: 10, color: "#0d253d", width: 80, textAlign: "right" },
  totalsFinalLabel: { flex: 1, fontSize: 12, fontWeight: "bold", color: "#0d253d" },
  totalsFinalValue: { fontSize: 12, fontWeight: "bold", color: "#0d9488", width: 80, textAlign: "right" },
  bankingSection: { marginTop: 32, padding: 16, backgroundColor: "#f6f9fc", borderRadius: 4 },
  bankingTitle: { fontSize: 10, fontWeight: "bold", color: "#0d253d", marginBottom: 8 },
  bankingDetail: { fontSize: 9, color: "#64748d", lineHeight: 1.6 },
  footer: { position: "absolute", bottom: 32, left: 48, right: 48, borderTop: "1pt solid #e3e8ee", paddingTop: 10 },
  footerText: { fontSize: 8, color: "#b0bec5", textAlign: "center" },
});
