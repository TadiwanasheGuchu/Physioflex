import { MessageSquare } from "lucide-react";

export default function TherapistMessagesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          Messages
        </h1>
        <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
          Patient communications
        </p>
      </div>

      <div
        className="bg-white rounded-xl border border-[#e3e8ee] p-12 text-center"
        style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px" }}
      >
        <div className="w-14 h-14 rounded-full bg-[#f0fdf9] flex items-center justify-center mx-auto mb-5">
          <MessageSquare className="w-6 h-6 text-[#0d9488]" />
        </div>
        <h2 className="text-base text-[#0d253d] mb-2" style={{ fontWeight: 400, letterSpacing: "-0.2px" }}>
          Messaging coming soon
        </h2>
        <p className="text-sm text-[#64748d] max-w-xs mx-auto" style={{ fontWeight: 300 }}>
          Direct messaging with patients is currently being built. You'll be notified when it goes live.
        </p>
      </div>
    </div>
  );
}
