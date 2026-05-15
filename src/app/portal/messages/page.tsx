import { MessageSquare } from "lucide-react";
import { MessagesThread } from "./messages-thread";

export default function MessagesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl text-[#0d253d]" style={{ fontWeight: 300, letterSpacing: "-0.4px" }}>
          Messages
        </h1>
        <p className="text-sm text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
          Chat with your therapist
        </p>
      </div>

      <MessagesThread />
    </div>
  );
}
