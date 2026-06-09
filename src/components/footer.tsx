import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const services = [
  "Sports Rehabilitation",
  "Pain Management",
  "Manual Therapy",
  "Post-Surgery Recovery",
  "Dry Needling",
];

const quickLinks = [
  { label: "Our Team", href: "/team" },
  { label: "Conditions", href: "/conditions" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#0d253d]" id="contact">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold leading-none">P</span>
              </div>
              <span
                className="text-white text-xl"
                style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
              >
                Physioflex
              </span>
            </div>
            <p className="text-[#64748d] text-sm leading-6" style={{ fontWeight: 300 }}>
              Expert physiotherapy care in the heart of Swakopmund, Namibia.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-5">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="#services"
                    className="text-[#64748d] text-sm hover:text-white transition-colors"
                    style={{ fontWeight: 300 }}
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[#64748d] text-sm hover:text-white transition-colors"
                    style={{ fontWeight: 300 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[#64748d] text-sm" style={{ fontWeight: 300 }}>
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#0d9488]" />
                <span>Shop Nr 2, Spar Ocean View Shopping Centre, Eugene Muller Street, Swakopmund, Erongo</span>
              </li>
              <li className="flex items-center gap-3 text-[#64748d] text-sm" style={{ fontWeight: 300 }}>
                <Phone size={14} className="shrink-0 text-[#0d9488]" />
                <span>+264 64 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-[#64748d] text-sm" style={{ fontWeight: 300 }}>
                <Mail size={14} className="shrink-0 text-[#0d9488]" />
                <span>info@physioflex.na</span>
              </li>
              <li className="flex items-start gap-3 text-[#64748d] text-sm" style={{ fontWeight: 300 }}>
                <Clock size={14} className="mt-0.5 shrink-0 text-[#0d9488]" />
                <div>
                  <p>Mon – Fri: 08:00 – 18:00</p>
                  <p>Saturday: 08:00 – 13:00</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Maps */}
        <div className="mt-14 rounded-xl overflow-hidden border border-white/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14778.123456789!2d14.5252!3d-22.6785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1c2a5f0f0f0f0f0f%3A0x0!2sSwakopmund%2C+Namibia!5e0!3m2!1sen!2sna!4v1715000000000!5m2!1sen!2sna"
            width="100%"
            height="220"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Physioflex location in Swakopmund, Namibia"
            className="w-full grayscale opacity-80"
          />
        </div>

        <div className="border-t border-white/10 mt-8 pt-6">
          <p className="text-[#64748d] text-xs mb-2" style={{ fontWeight: 400 }}>
            Medical aids accepted
          </p>
          <p className="text-[#64748d] text-xs" style={{ fontWeight: 300 }}>
            NHP · NMC · Named · Prosperity · Napotel · GemHealth
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mt-4">
            <p className="text-[#64748d] text-xs" style={{ fontWeight: 300 }}>
              © 2026 Physioflex. All rights reserved.
            </p>
            <p className="text-[#64748d] text-xs" style={{ fontWeight: 300 }}>
              Swakopmund, Erongo, Namibia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
