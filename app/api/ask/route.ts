// =============================================================================
// API route: POST /api/ask
//
// The browser can't call Claude directly: that would expose your API key to
// every visitor. Instead the chat sends the question HERE, this code runs on
// the server (where the key lives), and streams the answer back.
//
// Request:  { "question": "…", "history": [{ "role": "user"|"assistant", "content": "…" }] }
// Response: the answer as streamed plain text, plus an "X-Sources" header
//           listing the passages that were given to Claude.
// =============================================================================

import Anthropic from "@anthropic-ai/sdk";
import { streamAnswer, type Turn } from "@/lib/rag/answer";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const MAX_QUESTION_CHARS = 500;
const MAX_HISTORY_TURNS = 6; // older turns are dropped; also caps what Claude reads
const MAX_TURN_CHARS = 1500;

export async function POST(req: Request) {
  // ---- 0. Only accept requests from this website -------------------------------
  // Browsers attach an Origin header to requests. If another site tries to call
  // your API from its own pages (to use your Claude credits), the origin won't match.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    let sameSite = false;
    try {
      sameSite = new URL(origin).host === host;
    } catch {} // e.g. origin "null" from a sandboxed page
    if (!sameSite) return new Response("Not allowed.", { status: 403 });
  }

  // ---- 1. Rate limit, before doing anything that costs money ------------------
  const limit = checkRateLimit(getClientIp(req));
  if (!limit.ok) {
    return new Response(limit.message, {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfterSeconds) },
    });
  }

  // ---- 2. Read and check the request -------------------------------------------
  let body: { question?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Send JSON with a question.", { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) return new Response("Ask a question first.", { status: 400 });
  if (question.length > MAX_QUESTION_CHARS) {
    return new Response(`Keep questions under ${MAX_QUESTION_CHARS} characters.`, { status: 400 });
  }

  // Only accept well-formed history turns; never trust what the browser sends.
  // Keeping only the last few, each trimmed, means nobody can stuff a huge
  // fake "conversation" into one request to make it expensive.
  const history: Turn[] = Array.isArray(body.history)
    ? (body.history as Turn[])
        .filter((t) => (t?.role === "user" || t?.role === "assistant") && typeof t.content === "string")
        .slice(-MAX_HISTORY_TURNS)
        .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_TURN_CHARS) }))
    : [];
  // The conversation must start with a user turn and alternate after that.
  while (history.length && history[0].role !== "user") history.shift();

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("The assistant isn't set up yet (missing API key).", { status: 503 });
  }

  // ---- 2. Retrieve + start Claude's answer ---------------------------------------
  const { stream, sources } = streamAnswer(question, history);

  // ---- 3. Stream text to the browser as it arrives -------------------------------
  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("Sorry, I can't help with that one."));
        }
      } catch (err) {
        console.error("[/api/ask]", err);
        const message =
          err instanceof Anthropic.RateLimitError
            ? "The assistant is busy right now. Please try again in a moment."
            : "Something went wrong on my side. Please try again.";
        controller.enqueue(encoder.encode(message));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Sources": encodeURIComponent(JSON.stringify(sources)),
    },
  });
}
