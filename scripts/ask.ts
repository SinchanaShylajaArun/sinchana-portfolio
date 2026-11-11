// Ask the assistant from the terminal.
//   npm run ask -- "Where has she interned?"
//   npm run ask -- --show-prompt "Where has she interned?"   (also prints exactly what Claude receives)

import Anthropic from "@anthropic-ai/sdk";
import { buildRequest, streamAnswer, SYSTEM_PROMPT, MODEL } from "@/lib/rag/answer";

const args = process.argv.slice(2);
const showPrompt = args.includes("--show-prompt");
const question = args.filter((a) => a !== "--show-prompt").join(" ") || "What has she built with RAG?";

async function main() {
  console.log(`\nQ: ${question}\n`);

  if (showPrompt) {
    const { messages } = buildRequest(question);
    console.log("──── SYSTEM PROMPT ────\n" + SYSTEM_PROMPT);
    console.log("\n──── USER MESSAGE ────\n" + messages.at(-1)!.content + "\n");
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log("No ANTHROPIC_API_KEY found. Add it to .env.local, then run this again.");
    console.log("(Use --show-prompt to see what would be sent without calling Claude.)");
    process.exit(1);
  }

  const { stream, sources } = streamAnswer(question);
  process.stdout.write(`A (${MODEL}): `);
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      process.stdout.write(event.delta.text);
    }
  }
  const final = await stream.finalMessage();
  if (final.stop_reason === "refusal") console.log("\n(Claude declined to answer this one.)");

  // Show only the sources the answer actually cited.
  const answer = final.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const cited = new Set([...answer.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])));
  console.log("\n\nSources:");
  for (const s of sources.filter((s) => cited.has(s.n))) console.log(`  [${s.n}] ${s.title}  (${s.href})`);
  console.log(`\nTokens: ${final.usage.input_tokens} in, ${final.usage.output_tokens} out`);
}

main().catch((err) => {
  if (err instanceof Anthropic.AuthenticationError) console.error("\nThat API key was rejected. Check it in .env.local.");
  else if (err instanceof Anthropic.RateLimitError) console.error("\nRate limited. Wait a moment and try again.");
  else if (err instanceof Anthropic.APIError) console.error(`\nAPI error ${err.status}: ${err.message}`);
  else console.error(err);
  process.exit(1);
});
