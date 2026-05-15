# Feature Spec — AI Features (Optional / Phase 9)

## Goal
Add intelligent, helpful AI features that reduce admin load and improve patient experience — without replacing the human physiotherapist relationship. All AI features are clearly labelled as assistants, not medical diagnosis tools.

---

## Feature 1: Booking Assistant Chatbot

### What it does
A conversational widget that helps patients book appointments, find the right service, and answer FAQs — available 24/7.

### Placement
- Floating chat widget (bottom-right) on all public pages
- Replaces or sits alongside the WhatsApp button

### Conversation Flow
```
Bot: "Hi! I'm the Physioflex assistant. How can I help you today?"

Patient options:
  → "Book an appointment"       → guides through service → date → /book
  → "I have a question about…" → searches FAQ, conditions content
  → "What services do you offer?" → lists services with links
  → "Where are you located?"    → returns address + map link
  → "Talk to a human"           → links to WhatsApp

On "Book an appointment":
  Bot: "What type of treatment are you looking for?"
  [Sports injury] [Back pain] [Post-surgery] [Not sure]
  → Recommends a service based on selection
  → "Would you like to book for yourself or someone else?"
  → Collects preferred date/time → hands off to /book with pre-filled params
```

### Implementation
- Use **Claude API** (`claude-sonnet-4-6`) with a system prompt scoped to Physioflex context
- Keep conversation context in local state (no database for Phase 1)
- Tool use: `searchFAQ(query)`, `getServices()`, `getAvailableSlots(date)`, `createBookingLink(params)`
- Streaming responses for natural feel
- Fallback to WhatsApp if bot cannot answer

```ts
// System prompt excerpt
const systemPrompt = `
You are the Physioflex booking assistant. Physioflex is a physiotherapy clinic 
in Swakopmund, Namibia. Your job is to help patients book appointments, 
answer questions about services, and provide general information about the clinic.

IMPORTANT: You are NOT a medical diagnosis tool. Never diagnose conditions. 
Always recommend patients consult with a physiotherapist for medical advice.

Services offered: Sports Rehabilitation, Pain Management, Manual Therapy, 
Post-Surgery Recovery, Dry Needling, Paediatric Physiotherapy.

Location: Swakopmund, Erongo Region, Namibia.
Hours: Mon–Fri 08:00–17:00, Sat 08:00–13:00.
Phone: +264 64 000 0000
`;
```

---

## Feature 2: Symptom Guidance Tool

### What it does
A simple guided questionnaire that helps patients identify which service they need and whether physiotherapy is appropriate — or whether they should see a doctor first.

### Route: `/symptom-check`

### Flow
```
Step 1: "Where is your pain or discomfort?"
  [Body diagram — click region: head/neck, shoulder, back, hip, knee, ankle, other]

Step 2: "How long have you had this pain?"
  [< 1 week] [1–4 weeks] [1–3 months] [3+ months]

Step 3: "How would you describe it?"
  [Sharp/sudden] [Dull/aching] [Stiffness] [Weakness] [Numbness/tingling]

Step 4: "Did it follow an injury or accident?"
  [Yes] [No] [Not sure]

→ Result card:
  "Based on your answers, physiotherapy may help. We recommend booking a 
   Manual Therapy or Sports Rehabilitation consultation."
  [Book Now →]

  Disclaimer: "This tool is for guidance only and does not replace a 
  medical assessment. If you have severe pain, numbness in limbs, or loss 
  of bladder/bowel control, seek emergency care immediately."
```

### Implementation
- Pure client-side logic (no AI needed — decision tree)
- Or: Claude API for more nuanced responses based on symptom combination
- Always end with a disclaimer and booking CTA

---

## Feature 3: Personalised Recovery Suggestions (Patient Portal)

### What it does
After each session, suggests relevant exercises from the Resource Library based on the patient's condition and treatment notes.

### Placement
- Patient Portal → Progress page → "Recommended for you" section

### Implementation
- Claude API with patient's condition, recent treatment notes, and available exercise library
- Input: anonymised condition + body area + session notes summary
- Output: 3 recommended exercises from the existing resource library
- Never sends raw clinical notes to the API — only derived, anonymised summaries

---

## Feature 4: Automated Follow-up Messages

### What it does
AI-drafted (but clinic-reviewed) WhatsApp messages sent to patients 3 days after a session, personalised by treatment type.

### Implementation
- Triggered by a cron job 3 days post-appointment
- Generate message draft using Claude API based on: service type, session number in course, patient first name
- Admin reviews and approves drafts in bulk in `/admin/content`
- Approved → sent via Twilio WhatsApp
- Phase 2: auto-send without review for low-risk message types

---

## Ethical Guidelines for All AI Features

1. **Never diagnose** — AI features provide guidance, not diagnoses
2. **Always disclaim** — every AI output includes a disclaimer
3. **Human escalation** — always offer a path to speak with a real therapist
4. **Data minimisation** — send only what's needed to the Claude API; never full patient records
5. **Transparency** — label all AI-generated content clearly as "AI-assisted"
6. **Emergency routing** — if patient describes emergency symptoms (chest pain, stroke signs, loss of sensation), immediately direct to emergency services

---

## Dependencies
- `@anthropic-ai/sdk` — Claude API client
- Model: `claude-sonnet-4-6` (best balance of cost and quality)
- Prompt caching: enabled for system prompts (reduces cost on repeated calls)
- Environment variable: `ANTHROPIC_API_KEY`
- Streaming: use `stream: true` for chatbot responses
