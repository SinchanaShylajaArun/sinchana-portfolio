# Sinchana S. Arun · Portfolio

My personal portfolio site, with a small **retrieval-augmented generation (RAG)** assistant that answers questions about my work and cites its sources.

Built with Next.js 15 (App Router), TypeScript, and the Claude API.

## Pages

| Route | What's there |
|---|---|
| `/` | Intro, about, and highlights |
| `/projects` | Projects and hackathons, filterable, each card expands in place |
| `/experience` | Work, education, leadership, and skills |
| `/ask` | The AI assistant |
| `/contact` | Contact links and a message form |

All content comes from one file, [`data/resume.ts`](data/resume.ts). Editing it updates every page **and** what the assistant knows.

## How the assistant works

```
question → retrieve (BM25 over résumé chunks) → Claude answers from those passages only → streamed back with citations
```

1. **Chunking** ([`lib/rag/chunks.ts`](lib/rag/chunks.ts)): the résumé is split into 16 self-contained passages, one per project, role, degree, and so on.
2. **Retrieval** ([`lib/rag/retrieve.ts`](lib/rag/retrieve.ts)): BM25 keyword ranking with light stemming and a synonym list picks the top 4 passages for each question.
3. **Generation** ([`lib/rag/answer.ts`](lib/rag/answer.ts)): Claude answers using only those passages, cites them as `[1]`, `[2]`, and says so when the answer isn't there.
4. **API route** ([`app/api/ask/route.ts`](app/api/ask/route.ts)): runs server-side so the API key never reaches the browser, and streams the answer to the chat UI ([`components/Chat.tsx`](components/Chat.tsx)).

**Safeguards:** per-visitor and site-wide rate limits ([`lib/rateLimit.ts`](lib/rateLimit.ts)), a same-site check, input size caps, a short output cap, and a monthly spend limit on the Anthropic account.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Useful scripts for the RAG pipeline:

```bash
npm run chunks                                  # print every passage the assistant searches
npm run search -- "Where has she interned?"     # see which passages a question retrieves
npm run ask -- "Where has she interned?"        # full answer from Claude in the terminal
npm run ask -- --show-prompt "…"                # also print exactly what Claude receives
```

## Deploy

Hosted on Vercel. Set `ANTHROPIC_API_KEY` as an environment variable in the Vercel project settings.
