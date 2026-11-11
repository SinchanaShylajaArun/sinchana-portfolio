// Prints every chunk so you can see exactly what the assistant will search.
// Run with:  npm run chunks

import { buildChunks } from "@/lib/rag/chunks";

const chunks = buildChunks();

for (const [i, c] of chunks.entries()) {
  const words = c.text.split(/\s+/).length;
  console.log(`\n[${i + 1}] ${c.section.toUpperCase()} · ${c.title}  (${words} words, id: ${c.id})`);
  console.log(`    ${c.text}`);
}

const total = chunks.reduce((n, c) => n + c.text.split(/\s+/).length, 0);
console.log(`\n${chunks.length} chunks, ${total} words in total.`);
