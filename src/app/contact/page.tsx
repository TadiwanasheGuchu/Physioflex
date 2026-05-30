import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Physioflex in Swakopmund, Namibia. Call, WhatsApp, or email us. Located at Spar Ocean View Shopping Centre, Eugene Muller Street, Swakopmund.",
  alternates: { canonical: "https://physioflex.na/contact" },
  openGraph: { url: "https://physioflex.na/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Get in Touch"
          headline="We'd love to hear from you"
          subtext="Whether you have a question about treatment, want to book an appointment, or just need some advice — our team is here."
        />

        <section className="bg-[#f6f9fc] py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

              {/* Contact info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-[#e3e8ee] p-7" style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
                  <h2
                    className="text-lg text-[#0d253d] mb-6"
                    style={{ fontWeight: 300, letterSpacing: "-0.22px" }}
                  >
                    Contact details
                  </h2>
                  <ul className="space-y-5">
                    <li className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-[#0d9488]" />
                      <div>
                        <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>Address</p>
                        <p className="text-sm text-[#64748d] mt-0.5" style={{ fontWeight: 300 }}>
                          Shop Nr 2, Spar Ocean View Shopping Centre<br />
                          Eugene Muller Street, Swakopmund, Erongo<br />
                          Namibia
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone size={16} className="mt-0.5 shrink-0 text-[#0d9488]" />
                      <div>
                        <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>Phone</p>
                        <a
                          href="tel:+264640000000"
                          className="text-sm text-[#64748d] hover:text-[#0d9488] transition-colors mt-0.5 block"
                          style={{ fontWeight: 300 }}
                        >
                          +264 64 000 0000
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <MessageCircle size={16} className="mt-0.5 shrink-0 text-[#0d9488]" />
                      <div>
                        <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>WhatsApp</p>
                        <a
                          href="https://wa.me/264640000000?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20physiotherapy%20at%20Physioflex."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#25D366] hover:text-[#1fb855] transition-colors mt-0.5 block"
                          style={{ fontWeight: 300 }}
                        >
                          Message us on WhatsApp
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail size={16} className="mt-0.5 shrink-0 text-[#0d9488]" />
                      <div>
                        <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>Email</p>
                        <a
                          href="mailto:info@physioflex.na"
                          className="text-sm text-[#64748d] hover:text-[#0d9488] transition-colors mt-0.5 block"
                          style={{ fontWeight: 300 }}
                        >
                          info@physioflex.na
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock size={16} className="mt-0.5 shrink-0 text-[#0d9488]" />
                      <div>
                        <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>Hours</p>
                        <div className="text-sm text-[#64748d] mt-0.5 space-y-0.5" style={{ fontWeight: 300 }}>
                          <p>Mon – Fri: 08:00 – 18:00</p>
                          <p>Saturday: 08:00 – 13:00</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/264640000000?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment%20at%20Physioflex."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#1fb855] transition-colors text-white px-6 py-4 rounded-2xl"
                >
                  <MessageCircle size={20} />
                  <div>
                    <p className="text-sm font-medium">Book via WhatsApp</p>
                    <p className="text-xs text-white/80" style={{ fontWeight: 300 }}>
                      Usually responds within an hour
                    </p>
                  </div>
                </a>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
            </div>

            {/* Map */}
            <div className="mt-10 rounded-2xl overflow-hidden border border-[#e3e8ee]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14778.123456789!2d14.5252!3d-22.6785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c2a5f0f0f0f0f0f%3A0x0!2sSwakopmund%2C+Namibia!5e0!3m2!1sen!2sna!4v1715000000000!5m2!1sen!2sna"
                width="100%"
                height="280"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Physioflex location in Swakopmund, Namibia"
                className="w-full grayscale opacity-90"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
