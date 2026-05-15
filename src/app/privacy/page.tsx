import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Physioflex Swakopmund",
  description:
    "Privacy Policy for Physioflex — how we collect, use, and protect your personal information in compliance with Namibia's data protection framework.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="relative overflow-hidden bg-white pt-24 pb-10 md:pt-32">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-48 opacity-30"
            aria-hidden
            style={{
              background: "linear-gradient(135deg, #f5e9d4 0%, #ccfbf1 25%, #e0e7ff 50%, #0d9488 75%, #fce7f3 100%)",
              filter: "blur(48px)",
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl text-[#0d253d] mb-4"
              style={{ fontWeight: 300, letterSpacing: "-0.96px" }}
            >
              Privacy Policy
            </h1>
            <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
              Last updated: 14 May 2026
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="bg-[#f6f9fc] py-10 pb-20">
          <div className="max-w-3xl mx-auto px-6 space-y-8">
            <Prose>
              <p>
                Physioflex (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our physiotherapy services. Please read this policy carefully. If you disagree with its terms, please discontinue use of this site.
              </p>
            </Prose>

            <PolicySection title="1. Information we collect">
              <p>We may collect the following personal information:</p>
              <ul>
                <li><strong>Identity data:</strong> first name, last name, date of birth</li>
                <li><strong>Contact data:</strong> email address, telephone number, WhatsApp number, physical address</li>
                <li><strong>Health data:</strong> medical history, treatment notes, physiotherapy records (collected with your explicit consent)</li>
                <li><strong>Medical aid data:</strong> scheme name, membership number (for billing purposes)</li>
                <li><strong>Technical data:</strong> IP address, browser type and version, pages visited, time and date of visit</li>
                <li><strong>Usage data:</strong> information about how you use our website</li>
              </ul>
            </PolicySection>

            <PolicySection title="2. How we collect your information">
              <p>We collect information through:</p>
              <ul>
                <li>Direct interactions: when you complete intake forms, book appointments, or contact us via phone, email, or WhatsApp</li>
                <li>Automated technologies: cookies and similar tracking technologies on our website</li>
                <li>Third parties: medical aid administrators and referring healthcare providers (with your consent)</li>
              </ul>
            </PolicySection>

            <PolicySection title="3. How we use your information">
              <p>We use your personal information to:</p>
              <ul>
                <li>Provide physiotherapy services and manage your treatment</li>
                <li>Book and manage appointments</li>
                <li>Process medical aid claims and invoices</li>
                <li>Send appointment reminders via WhatsApp or email</li>
                <li>Communicate treatment plans and home exercise programmes</li>
                <li>Comply with our legal obligations as a registered healthcare provider</li>
                <li>Improve our services and website</li>
              </ul>
              <p>
                We will never sell your personal information to third parties.
              </p>
            </PolicySection>

            <PolicySection title="4. Legal basis for processing">
              <p>We process your personal data on the following legal bases:</p>
              <ul>
                <li><strong>Contract:</strong> processing necessary to provide the physiotherapy services you have requested</li>
                <li><strong>Consent:</strong> where you have given explicit consent, including for health data</li>
                <li><strong>Legal obligation:</strong> where we are required to process data by applicable law</li>
                <li><strong>Legitimate interests:</strong> for purposes such as improving our website and sending appointment reminders</li>
              </ul>
            </PolicySection>

            <PolicySection title="5. Health information">
              <p>
                Your health information is sensitive data and is treated with the highest level of confidentiality. It is collected with your explicit consent, used solely for the purpose of delivering your treatment, stored securely with access limited to your treating physiotherapist and the practice administrator, and is never shared with third parties without your consent (except where required by law or a medical emergency).
              </p>
              <p>
                All health records are retained for a minimum of 5 years in compliance with Namibian health regulations.
              </p>
            </PolicySection>

            <PolicySection title="6. Sharing your information">
              <p>We may share your information with:</p>
              <ul>
                <li><strong>Medical aid schemes:</strong> to process claims on your behalf</li>
                <li><strong>Referring practitioners:</strong> with your consent, for coordinated care</li>
                <li><strong>IT service providers:</strong> who assist us in operating our website and practice management systems (bound by confidentiality agreements)</li>
                <li><strong>Legal authorities:</strong> where required by Namibian law</li>
              </ul>
            </PolicySection>

            <PolicySection title="7. Cookies">
              <p>
                Our website uses cookies to improve your browsing experience and analyse website traffic. You can control cookies through your browser settings. The following cookies may be set:
              </p>
              <ul>
                <li><strong>Essential cookies:</strong> required for the website to function</li>
                <li><strong>Analytics cookies:</strong> help us understand how visitors interact with our site (Google Analytics)</li>
              </ul>
            </PolicySection>

            <PolicySection title="8. Your rights">
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information held by us</li>
                <li>Correct inaccurate personal information</li>
                <li>Request deletion of your personal information (where legally permissible)</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with the relevant Namibian data protection authority</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at <strong>info@physioflex.na</strong> or call <strong>+264 64 000 0000</strong>.
              </p>
            </PolicySection>

            <PolicySection title="9. Data security">
              <p>
                We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no internet transmission or electronic storage method is 100% secure, and we cannot guarantee absolute security.
              </p>
            </PolicySection>

            <PolicySection title="10. Retention">
              <p>
                We retain personal data only for as long as necessary for the purposes set out in this policy, or as required by law. Clinical records are retained for a minimum of 5 years. Website analytics data is retained for 26 months.
              </p>
            </PolicySection>

            <PolicySection title="11. Changes to this policy">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
              </p>
            </PolicySection>

            <PolicySection title="12. Contact us">
              <p>
                If you have any questions about this Privacy Policy or how we handle your personal information, please contact us:
              </p>
              <ul>
                <li><strong>Physioflex</strong></li>
                <li>Sam Nujoma Avenue, Swakopmund, Erongo Region, Namibia</li>
                <li>Email: info@physioflex.na</li>
                <li>Phone: +264 64 000 0000</li>
              </ul>
            </PolicySection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-sm text-[#64748d] leading-7"
      style={{ fontWeight: 300 }}
    >
      {children}
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] p-7" style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
      <h2
        className="text-base text-[#0d253d] mb-4"
        style={{ fontWeight: 400 }}
      >
        {title}
      </h2>
      <div
        className="text-sm text-[#64748d] leading-7 space-y-3 [&_ul]:space-y-1.5 [&_ul]:list-none [&_ul_li]:flex [&_ul_li]:items-start [&_ul_li]:gap-2 [&_ul_li]:before:content-['–'] [&_ul_li]:before:text-[#0d9488] [&_ul_li]:before:shrink-0 [&_strong]:text-[#0d253d] [&_strong]:font-medium"
        style={{ fontWeight: 300 }}
      >
        {children}
      </div>
    </div>
  );
}
