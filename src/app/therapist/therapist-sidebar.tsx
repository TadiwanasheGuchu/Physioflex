"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/therapist", label: "Overview", icon: LayoutDashboard },
  { href: "/therapist/schedule", label: "Schedule", icon: Calendar },
  { href: "/therapist/patients", label: "My Patients", icon: Users },
  { href: "/therapist/messages", label: "Messages", icon: MessageSquare },
];

interface Props {
  name: string;
  title: string;
  email: string;
}

function NavItems({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const isActive = (href: string) =>
    href === "/therapist" ? pathname === "/therapist" : pathname.startsWith(href);

  return (
    <>
      {NAV.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          onClick={onNavigate}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            isActive(href)
              ? "bg-[#0d9488] text-white"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
          style={{ fontWeight: isActive(href) ? 400 : 300 }}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </a>
      ))}
    </>
  );
}

export function TherapistSidebar({ name, title, email }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initial = name.charAt(0).toUpperCase();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 shrink-0">
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#0d9488] flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-white text-base" style={{ fontWeight: 300, letterSpacing: "-0.3px" }}>
            Physioflex
          </span>
        </a>
      </div>

      {/* Therapist info */}
      <div className="px-5 py-4 border-b border-white/10 shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#0d9488] flex items-center justify-center mb-2">
          <span className="text-white text-sm font-medium">{initial}</span>
        </div>
        <p className="text-white text-sm leading-tight truncate" style={{ fontWeight: 400 }}>
          {name}
        </p>
        {title && (
          <p className="text-[#0d9488] text-xs mt-0.5 truncate" style={{ fontWeight: 300 }}>
            {title}
          </p>
        )}
        <p className="text-white/50 text-xs mt-0.5 truncate" style={{ fontWeight: 300 }}>
          {email}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavItems pathname={pathname} onNavigate={() => setOpen(false)} />
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          style={{ fontWeight: 300 }}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-[#0d253d] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#0d253d] flex items-center justify-between px-4">
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
          className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-[#0d253d] flex flex-col h-full overflow-y-auto">
            <div className="h-14 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
              <a href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                <div className="w-7 h-7 rounded-full bg-[#0d9488] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="text-white text-base" style={{ fontWeight: 300 }}>Physioflex</span>
              </a>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
