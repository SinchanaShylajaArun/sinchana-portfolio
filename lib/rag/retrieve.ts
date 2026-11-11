// =============================================================================
// RAG step 2 of 3: RETRIEVAL
//
// Given a question, score every chunk and return the best few.
//
// We use BM25, the classic keyword-ranking formula behind search engines like
// Elasticsearch. For each word in the question it rewards a chunk when:
//   • the word appears in the chunk (more often = better, with diminishing returns)
//   • the word is RARE across all chunks ("pgvector" matters more than "built")
//   • the chunk is short (a match in a short chunk is more focused)
//
// Why not embeddings (vector search)? With 16 short chunks, BM25 plus a small
// synonym list is fast, free, needs no extra API, and is easy to understand.
// Embeddings are a good upgrade later for paraphrased questions.
// =============================================================================

import { buildChunks, type Chunk } from "./chunks";

// ---- 1. Tokenizing: text -> list of comparable words ---------------------------

// Common words that carry no meaning for search.
const STOPWORDS = new Set(
  ("a an and are as at be been but by can could did do does for from had has have her hers him his how i if in " +
    "into is it its me my of on or our she so that the their them they this to was we were what when where which " +
    "who whom why will with would you your about tell any some sinchana sinchana's arun " +
    // Vague verbs: "work" matched every job chunk ("Work experience: …") and
    // drowned out the real topic in "what computer vision work has she done?"
    "work done know")
    .split(" "),
);

// A tiny "stemmer": strips common endings so that intern / interned / internship
// and project / projects all become the same word.
function stem(word: string): string {
  if (word.length > 6 && word.endsWith("ship")) return word.slice(0, -4); // internship -> intern
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3); // building -> build
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2); // interned -> intern
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y"; // studies -> study
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1); // projects -> project
  return word;
}

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9+#.\-]*/g) ?? [])
    .map((w) => w.replace(/[.\-]+$/, "")) // drop trailing punctuation ("aws." -> "aws")
    .filter((w) => w && !STOPWORDS.has(w))
    .map(stem);
}

// ---- 2. Synonyms: bridge the gap between how people ask and how a resume reads --

const SYNONYMS: Record<string, string[]> = {
  ml: ["machine", "learn"],
  ai: ["ml", "llm", "model"],
  llm: ["gemini", "rag", "language"],
  cv: ["computer", "vision"],
  vision: ["opencv", "yolo", "mediapipe", "image"],
  job: ["experience", "intern"],
  employ: ["experience", "intern"],
  school: ["education", "university"],
  study: ["education", "coursework"],
  degree: ["education", "m.s", "b.e"],
  grade: ["gpa"],
  teach: ["lecturer", "recitation"],
  award: ["result", "runner-up", "hackathon"],
  win: ["result", "runner-up", "award"],
  won: ["result", "runner-up", "award"],
  stack: ["skill", "tech"],
  language: ["python", "c++", "javascript"],
  contact: ["email", "linkedin"],
  reach: ["email", "contact"],
  frontend: ["react", "next.js"],
  backend: ["fastapi", "api", "postgresql"],
  database: ["postgresql", "mysql", "mongodb", "schema"],
  cloud: ["aws", "docker"],
  deploy: ["aws", "docker", "ci/cd"],
  rag: ["retrieval", "pgvector", "document"],
  search: ["retrieval", "rag"],
  research: ["benchmark", "evaluation", "analysis"],
  location: ["based"],
  live: ["based"],
};

// Returns each search word with a weight: words the visitor typed count fully,
// synonyms we added count half, so they help without taking over.
function expand(terms: string[]): Map<string, number> {
  const weights = new Map<string, number>();
  for (const t of terms) weights.set(t, 1);
  for (const t of terms) {
    for (const s of SYNONYMS[t] ?? []) {
      for (const w of tokenize(s)) if (!weights.has(w)) weights.set(w, 0.5);
    }
  }
  return weights;
}

// ---- 3. Indexing: count words in every chunk, once -----------------------------

type Index = {
  chunks: Chunk[];
  termCounts: Map<string, number>[]; // per chunk: word -> how many times it appears
  lengths: number[]; // per chunk: number of words
  avgLength: number;
  docFreq: Map<string, number>; // word -> how many chunks contain it
};

let cached: Index | null = null;

function getIndex(): Index {
  if (cached) return cached;
  const chunks = buildChunks();
  const termCounts = chunks.map((c) => {
    const counts = new Map<string, number>();
    // The title is added twice, so a chunk's own subject weighs more.
    for (const t of [...tokenize(c.text), ...tokenize(c.title), ...tokenize(c.title)]) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return counts;
  });
  const lengths = termCounts.map((m) => [...m.values()].reduce((a, b) => a + b, 0));
  const docFreq = new Map<string, number>();
  for (const m of termCounts) for (const t of m.keys()) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);
  cached = { chunks, termCounts, lengths, avgLength: lengths.reduce((a, b) => a + b, 0) / lengths.length, docFreq };
  return cached;
}

// ---- 4. Scoring with BM25 --------------------------------------------------------

const K1 = 1.4; // how quickly repeated words stop adding score
const B = 0.75; // how much long chunks are penalised

export type Hit = Chunk & { score: number };

export function retrieve(question: string, k = 4): Hit[] {
  const { chunks, termCounts, lengths, avgLength, docFreq } = getIndex();
  const N = chunks.length;
  const terms = expand(tokenize(question));

  const scored: Hit[] = chunks.map((chunk, i) => {
    let score = 0;
    for (const [term, weight] of terms) {
      const tf = termCounts[i].get(term) ?? 0;
      if (tf === 0) continue;
      const df = docFreq.get(term) ?? 0;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5)); // rare word = high value
      score += weight * idf * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * lengths[i]) / avgLength)));
    }
    return { ...chunk, score: Math.round(score * 100) / 100 };
  });

  const ranked = scored.filter((h) => h.score > 0).sort((a, b) => b.score - a.score);
  // Drop weak tail matches: keep results scoring at least 30% of the best one.
  const best = ranked[0]?.score ?? 0;
  const hits = ranked.filter((h) => h.score >= best * 0.3).slice(0, k);

  // Broad questions ("who is she?") match few keywords: fall back to the profile.
  if (hits.length === 0 || best < 2) {
    const profile = scored.find((h) => h.id === "profile")!;
    if (!hits.some((h) => h.id === "profile")) hits.unshift(profile);
  }
  return hits;
}
