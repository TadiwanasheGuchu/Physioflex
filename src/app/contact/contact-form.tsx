"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-[#e3e8ee] p-10 text-center h-full flex flex-col items-center justify-center gap-4" style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}>
        <div className="w-12 h-12 rounded-full bg-[#f0fdfa] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl text-[#0d253d]" style={{ fontWeight: 300 }}>
          Message sent!
        </h3>
        <p className="text-sm text-[#64748d] max-w-xs" style={{ fontWeight: 300 }}>
          Thank you for getting in touch. We'll get back to you within one business day.
        </p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 text-sm text-[#0d253d] placeholder:text-[#64748d] bg-white border border-[#a8c3de] rounded-lg focus:outline-none focus:border-[#0d9488] transition-colors";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-[#e3e8ee] p-7 space-y-4"
      style={{ boxShadow: "rgba(0,55,112,0.08) 0 1px 3px" }}
    >
      <h2
        className="text-lg text-[#0d253d] mb-5"
        style={{ fontWeight: 300, letterSpacing: "-0.22px" }}
      >
        Send us a message
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
            Full name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sarah Müller"
            className={inputClass}
            style={{ fontWeight: 300 }}
          />
        </div>
        <div>
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
            Email address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="sarah@example.com"
            className={inputClass}
            style={{ fontWeight: 300 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
            Phone / WhatsApp
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+264 81 000 0000"
            className={inputClass}
            style={{ fontWeight: 300 }}
          />
        </div>
        <div>
          <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
            Subject *
          </label>
          <select
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className={inputClass}
            style={{ fontWeight: 300 }}
          >
            <option value="" disabled>Select a subject…</option>
            <option>Book an appointment</option>
            <option>General enquiry</option>
            <option>Medical aid & billing</option>
            <option>Feedback</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#64748d] mb-1.5" style={{ fontWeight: 400 }}>
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us how we can help you…"
          className={`${inputClass} resize-none`}
          style={{ fontWeight: 300 }}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-full bg-[#0d9488] text-white text-sm font-medium hover:bg-[#0f766e] transition-colors"
      >
        Send message
      </button>

      <p className="text-xs text-[#64748d] text-center" style={{ fontWeight: 300 }}>
        Or message us directly on{" "}
        <a
          href="https://wa.me/264640000000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#25D366] hover:underline"
        >
          WhatsApp
        </a>{" "}
        for a faster response.
      </p>
    </form>
  );
}
