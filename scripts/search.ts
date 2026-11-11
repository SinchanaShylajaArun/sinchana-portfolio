// Try the retrieval step from the terminal.
//   npm run search -- "What has she done with computer vision?"
// With no question, it runs a set of sample recruiter questions.

import { retrieve, tokenize } from "@/lib/rag/retrieve";

const samples = [
  "What has she built with RAG?",
  "Where has she interned?",
  "What computer vision work has she done?",
  "Which hackathons has she won?",
  "Does she know Docker and AWS?",
  "What does she teach?",
  "What was her GPA?",
  "How can I contact her?",
  "Who is she?",
];

const questions = process.argv.slice(2).length ? [process.argv.slice(2).join(" ")] : samples;

for (const q of questions) {
  console.log(`\nQ: ${q}`);
  console.log(`   search words: ${tokenize(q).join(", ") || "(none)"}`);
  for (const [i, h] of retrieve(q).entries()) {
    console.log(`   ${i + 1}. ${h.score.toFixed(2).padStart(5)}  ${h.section.padEnd(10)} ${h.title}`);
  }
}
