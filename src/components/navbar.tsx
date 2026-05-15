"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Team", href: "/team" },
  { label: "Conditions", href: "/conditions" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

type AuthState = "loading" | "guest" | "user";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(session ? "user" : "guest");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "user" : "guest");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e3e8ee]">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop nav links */}
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

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          {authState === "user" ? (
            <Link
              href="/portal"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#e3e8ee] text-sm text-[#0d253d] hover:bg-[#f6f9fc] transition-colors"
              style={{ fontWeight: 400 }}
            >
              <User className="w-3.5 h-3.5" />
              My Portal
            </Link>
          ) : authState === "guest" ? (
            <div className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#e3e8ee] text-sm text-[#0d253d] hover:bg-[#f6f9fc] transition-colors"
                style={{ fontWeight: 400 }}
              >
                <User className="w-3.5 h-3.5" />
                Account
                <ChevronDown className={`w-3.5 h-3.5 text-[#64748d] transition-transform ${accountOpen ? "rotate-180" : ""}`} />
              </button>

              {accountOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setAccountOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#e3e8ee] rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="p-1">
                      <Link
                        href="/auth/login"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm text-[#0d253d] rounded-lg hover:bg-[#f6f9fc] transition-colors"
                        style={{ fontWeight: 400 }}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm text-[#0d253d] rounded-lg hover:bg-[#f6f9fc] transition-colors"
                        style={{ fontWeight: 400 }}
                      >
                        Create account
                      </Link>
                    </div>
                    <div className="border-t border-[#e3e8ee] p-3">
                      <p className="text-[11px] text-[#6b7a99] leading-relaxed">
                        No account needed to book — just fill in your details at checkout.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Loading skeleton
            <div className="w-24 h-8 rounded-full bg-[#e3e8ee] animate-pulse" />
          )}

          <Link
            href="/book"
            className="px-4 py-2 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-[#64748d] hover:text-[#0d253d] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#e3e8ee] px-6 py-5 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-2 py-2.5 text-[#0d253d] text-sm rounded-lg hover:bg-[#f6f9fc] transition-colors"
              style={{ fontWeight: 300 }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-[#e3e8ee] mt-3 pt-3 flex flex-col gap-2">
            {authState === "user" ? (
              <Link
                href="/portal"
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#0d253d] border border-[#e3e8ee] rounded-full text-center justify-center hover:bg-[#f6f9fc] transition-colors"
                style={{ fontWeight: 400 }}
                onClick={() => setOpen(false)}
              >
                <User className="w-4 h-4" />
                My Portal
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="w-full text-center px-4 py-2.5 rounded-full border border-[#e3e8ee] text-[#0d253d] text-sm hover:bg-[#f6f9fc] transition-colors"
                  style={{ fontWeight: 400 }}
                  onClick={() => setOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full text-center px-4 py-2.5 rounded-full border border-[#0d9488] text-[#0d9488] text-sm hover:bg-[#0d9488]/5 transition-colors"
                  style={{ fontWeight: 400 }}
                  onClick={() => setOpen(false)}
                >
                  Create account
                </Link>
              </>
            )}

            <Link
              href="/book"
              className="mt-1 w-full text-center px-4 py-2.5 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
              onClick={() => setOpen(false)}
            >
              Book Appointment
            </Link>

            {authState === "guest" && (
              <p className="text-center text-[11px] text-[#6b7a99] mt-1 px-2">
                No account needed to book — just fill in your details.
              </p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
