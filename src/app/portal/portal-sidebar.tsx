"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Activity,
  FileText,
  MessageSquare,
  Receipt,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/appointments", label: "My Appointments", icon: Calendar },
  { href: "/portal/progress", label: "Progress", icon: Activity },
  { href: "/portal/resources", label: "Exercise Plans", icon: FileText },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/billing", label: "Billing", icon: Receipt },
  { href: "/portal/profile", label: "Profile", icon: User },
];

interface Props {
  name: string;
  email: string;
}

export function PortalSidebar({ name, email }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/portal" ? pathname === "/portal" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#0d9488] flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white text-base" style={{ fontWeight: 300, letterSpacing: "-0.3px" }}>
            Physioflex
          </span>
        </a>
      </div>

      {/* Patient info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-[#0d9488] flex items-center justify-center mb-2">
          <span className="text-white text-sm font-medium">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <p className="text-white text-sm leading-tight" style={{ fontWeight: 400 }}>
          {name}
        </p>
        <p className="text-white/50 text-xs mt-0.5" style={{ fontWeight: 300 }}>
          {email}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(href)
                ? "bg-[#0d9488] text-white"
                : "text-white/60 hover:text-white hover:bg-white/8"
            }`}
            style={{ fontWeight: isActive(href) ? 400 : 300 }}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/8 transition-colors"
          style={{ fontWeight: 300 }}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-[#0d253d] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0d253d] px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#0d9488] flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white text-base" style={{ fontWeight: 300 }}>
            Physioflex
          </span>
        </a>
        <button
          onClick={() => setOpen(!open)}
          className="text-white/70 hover:text-white p-1"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute top-0 left-0 h-screen w-72 bg-[#0d253d] pt-14">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile top bar spacer */}
      <div className="lg:hidden h-14 w-full" />
    </>
  );
}
