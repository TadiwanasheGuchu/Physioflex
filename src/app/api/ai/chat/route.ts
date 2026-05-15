import { getGroq, GROQ_MODEL } from "@/lib/groq";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are a helpful assistant for Physioflex, a physiotherapy clinic in Swakopmund, Namibia.

Your role is to:
- Answer questions about physiotherapy services, conditions, and treatments
- Help patients understand what to expect from their first appointment
- Guide patients toward booking an appointment when appropriate
- Explain common conditions we treat: back pain, sports injuries, post-surgery recovery, neck pain, arthritis, and more
- Provide general health and movement advice (but always recommend consulting a physiotherapist for specific medical advice)

Clinic details:
- Location: Swakopmund, Namibia
- Services: Manual Therapy, Sports Rehabilitation, Post-Surgery Recovery, Pain Management, Dry Needling, Paediatric Physio
- Booking: Patients can book online at /book or call the clinic
- Medical aid accepted: Discovery, Momentum, Namibia Medical Care, NMC, and others

Tone: Warm, professional, and reassuring. Keep responses concise (2–4 sentences unless more detail is clearly needed). Never diagnose conditions — always recommend a proper assessment.

If asked about pricing or availability, direct them to book online or contact the clinic directly as these change regularly.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request", { status: 400 });
    }

    const groq = getGroq();

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-10), // keep last 10 messages for context
      ],
      max_tokens: 400,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("[ai/chat]", err);
    return new Response("AI service unavailable", { status: 503 });
  }
}
