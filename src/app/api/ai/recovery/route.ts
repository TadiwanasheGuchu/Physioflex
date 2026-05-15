import { getGroq, GROQ_MODEL } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const { patientId, recentServices, painTrend, sessionCount } = await request.json();

    const prompt = `You are a physiotherapy recovery coach. A patient has the following profile:

- Recent treatments: ${recentServices?.join(", ") || "General physiotherapy"}
- Number of sessions completed: ${sessionCount ?? "Unknown"}
- Pain trend: ${painTrend ?? "Not tracked"}

Provide 3 personalised, practical recovery tips they can do at home between sessions. Each tip should be:
- Specific and actionable (not generic)
- Safe to do without supervision
- Related to their treatment type

Format: 3 short paragraphs, each starting with the tip name in bold. Keep it warm and encouraging. Total response under 200 words.`;

    const groq = getGroq();
    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
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
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("[ai/recovery]", err);
    return new Response("AI service unavailable", { status: 503 });
  }
}
