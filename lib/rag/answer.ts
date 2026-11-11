// =============================================================================
// RAG step 3 of 3: GENERATION
//
// Send Claude the question plus ONLY the retrieved chunks, numbered [1], [2]…
// The system prompt tells it to answer from those passages alone and to cite
// them. That's what makes RAG trustworthy: every claim points to a source.
// =============================================================================

import Anthropic from "@anthropic-ai/sdk";
import { retrieve, type Hit } from "./retrieve";
import { profile } from "@/data/resume";

export const MODEL = "claude-opus-5-5";

// The system prompt: Claude's standing instructions for every question.
export const SYSTEM_PROMPT = `You answer questions about ${profile.name} on her portfolio website. Visitors are usually recruiters, hiring managers, or engineers.

Rules:
- Answer ONLY from the numbered passages in the user's message. If they don't contain the answer, say you don't have that information and suggest emailing ${profile.email}. Never guess or invent employers, dates, numbers, or links.
- Cite the passages you used inline, like [1] or [2][3], right after the fact they support.
- Refer to her as Sinchana (she/her). Be warm, direct, and brief: 2 to 4 sentences, or a few short bullets when listing several things.
- Plain text only: no headings, no bold, no tables.
- If a question isn't about Sinchana, politely say you can only answer questions about her background.`;

export type Turn = { role: "user" | "assistant"; content: string };
export type Source = { n: number; title: string; href: string };

// Builds what we send: the passages are numbered so Claude can cite them.
export function buildRequest(question: string, history: Turn[] = []) {
  // Include the previous question in the search so follow-ups like
  // "what tech did that use?" still find the right chunks.
  const lastQuestion = [...history].reverse().find((t) => t.role === "user")?.content ?? "";
  const hits: Hit[] = retrieve(`${question} ${lastQuestion}`.trim(), 4);

  const passages = hits.map((h, i) => `[${i + 1}] ${h.section}: ${h.title}\n${h.text}`).join("\n\n");
  const sources: Source[] = hits.map((h, i) => ({ n: i + 1, title: h.title, href: h.href }));

  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.slice(-6), // the last few turns, so the conversation can continue
    { role: "user", content: `<passages>\n${passages}\n</passages>\n\nQuestion: ${question}` },
  ];

  return { messages, sources, hits };
}

let client: Anthropic | null = null;

// Starts a streaming answer. Text arrives word by word, so the visitor sees
// the answer appear immediately instead of waiting for the whole thing.
export function streamAnswer(question: string, history: Turn[] = []) {
  client ??= new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  const { messages, sources } = buildRequest(question, history);

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 1500, // answers are short; this caps cost on a public site
    output_config: { effort: "low" }, // short factual answers don't need deep thinking
    // If Claude declines a request, the API automatically retries it on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    // cache_control lets repeated requests reuse the system prompt more cheaply
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages,
  });

  return { stream, sources };
}
