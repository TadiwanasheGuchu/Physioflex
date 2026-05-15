"use client";

import { useState } from "react";
import { Send, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  role: "patient" | "therapist";
  body: string;
  sentAt: string;
}

// Placeholder — will connect to messages table when therapist side is built
const DEMO_MESSAGES: Message[] = [];

export function MessagesThread() {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    // Optimistic add
    const msg: Message = {
      id: Date.now().toString(),
      role: "patient",
      body: text.trim(),
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setText("");
    setSending(false);
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-NA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="bg-white rounded-xl border border-[#e3e8ee] flex flex-col" style={{ boxShadow: "rgba(0,55,112,0.06) 0 2px 8px", minHeight: "480px" }}>
      {/* Thread header */}
      <div className="px-5 py-4 border-b border-[#e3e8ee] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#f0fdf9] flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-[#0d9488]" />
        </div>
        <div>
          <p className="text-sm text-[#0d253d]" style={{ fontWeight: 400 }}>
            Physioflex Team
          </p>
          <p className="text-xs text-[#64748d]" style={{ fontWeight: 300 }}>
            Your assigned therapist will respond here
          </p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <MessageSquare className="w-8 h-8 text-[#e3e8ee] mb-3" />
            <p className="text-sm text-[#64748d]" style={{ fontWeight: 300 }}>
              No messages yet. Send a message to your therapist below.
            </p>
            <p className="text-xs text-[#64748d] mt-1" style={{ fontWeight: 300 }}>
              For urgent queries, use{" "}
              <a href="https://wa.me/264811234567" className="text-[#0d9488] hover:underline">
                WhatsApp
              </a>
              .
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "patient" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                msg.role === "patient"
                  ? "bg-[#0d9488] text-white rounded-br-sm"
                  : "bg-[#f6f9fc] text-[#0d253d] border border-[#e3e8ee] rounded-bl-sm"
              }`}
              style={{ fontWeight: 300 }}
            >
              <p>{msg.body}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.role === "patient" ? "text-white/60" : "text-[#64748d]"
                }`}
                style={{ fontWeight: 300 }}
              >
                {formatTime(msg.sentAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Compose */}
      <form onSubmit={handleSend} className="px-5 py-4 border-t border-[#e3e8ee] flex gap-3">
        <input
          type="text"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-full border border-[#e3e8ee] bg-[#f6f9fc] px-4 py-2.5 text-sm text-[#0d253d] placeholder:text-[#b0bec5] outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] transition"
          style={{ fontWeight: 300 }}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="w-10 h-10 rounded-full bg-[#0d9488] flex items-center justify-center text-white hover:bg-[#0b7a6f] disabled:opacity-40 transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
