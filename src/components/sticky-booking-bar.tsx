import Link from "next/link";
import { Calendar } from "lucide-react";

export function StickyBookingBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-[#e3e8ee] px-4 py-3"
      style={{ boxShadow: "rgba(0,55,112,0.12) 0 -4px 16px" }}
    >
      <Link
        href="#booking"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
      >
        <Calendar size={16} />
        Book an Appointment
      </Link>
    </div>
  );
}
