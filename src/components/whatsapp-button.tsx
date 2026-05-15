"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "264640000000";
const WHATSAPP_MESSAGE = "Hi, I'd like to book an appointment at Physioflex.";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-24 right-5 z-50 md:bottom-8 md:right-6 group flex items-center gap-2"
    >
      {/* Tooltip — desktop only */}
      <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d253d] text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
        Chat on WhatsApp
      </span>

      {/* Button */}
      <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={26} className="text-white fill-white" />
      </div>
    </a>
  );
}
