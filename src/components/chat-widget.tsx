"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING = "Hi! I'm the Physioflex assistant. How can I help you today? I can answer questions about our services, conditions we treat, or help you get started with a booking.";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Placeholder for streaming
    const placeholder: Message = { role: "assistant", content: "" };
    setMessages([...newMessages, placeholder]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("AI unavailable");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: "assistant", content: accumulated }]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please call us or use the booking form.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm flex flex-col bg-white rounded-2xl shadow-2xl border border-[#e3e8ee] overflow-hidden"
          style={{ height: "min(520px, calc(100vh - 140px))" }}>

          {/* Header */}
          <div className="bg-[#0d253d] px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium leading-tight">Physioflex Assistant</p>
                <p className="text-white/50 text-[10px]">Powered by AI · Usually instant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#0d9488]/10 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <Bot className="w-3 h-3 text-[#0d9488]" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0d9488] text-white rounded-br-sm"
                    : "bg-[#f6f9fc] text-[#0d253d] rounded-bl-sm"
                }`}>
                  {msg.content || (
                    <span className="flex items-center gap-1.5 text-[#6b7a99]">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Thinking…
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {["What services do you offer?", "How do I book?", "Do you accept medical aid?"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-[#e3e8ee] text-[#6b7a99] hover:border-[#0d9488] hover:text-[#0d9488] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#e3e8ee] shrink-0">
            <div className="flex items-center gap-2 bg-[#f6f9fc] rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything…"
                className="flex-1 bg-transparent text-sm text-[#0d253d] placeholder-[#6b7a99] focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg bg-[#0d9488] flex items-center justify-center text-white disabled:opacity-40 transition-opacity shrink-0"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-[#0d253d] text-white shadow-lg hover:bg-[#0d9488] transition-colors flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0d9488] rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
