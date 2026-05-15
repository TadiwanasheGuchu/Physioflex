"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Team", href: "/team" },
  { label: "Conditions", href: "/conditions" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e3e8ee]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold leading-none">P</span>
          </div>
          <span
            className="text-[#0d253d] text-xl tracking-tight"
            style={{ fontWeight: 300, letterSpacing: "-0.4px" }}
          >
            Physioflex
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#64748d] hover:text-[#0d253d] text-sm transition-colors"
              style={{ fontWeight: 300 }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="tel:+26464000000"
            className="text-sm text-[#64748d] hover:text-[#0d253d] transition-colors"
            style={{ fontWeight: 300 }}
          >
            Call Us
          </Link>
          <Link
            href="#booking"
            className="px-4 py-2 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
          >
            Book Appointment
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-[#64748d] hover:text-[#0d253d] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#e3e8ee] px-6 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#0d253d] text-sm"
              style={{ fontWeight: 300 }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#booking"
            className="mt-2 w-full text-center px-4 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium"
            onClick={() => setOpen(false)}
          >
            Book Appointment
          </Link>
        </div>
      )}
    </nav>
  );
}
