// =============================================================================
// Rate limiting: stops one visitor (or a bot) from sending endless questions
// and running up your Anthropic bill.
//
// Three limits, checked on every request to /api/ask:
//   • per visitor, per minute  → stops rapid-fire spam
//   • per visitor, per day     → stops one person using it as a free chatbot
//   • whole site, per day      → a ceiling on total questions, whoever sends them
//
// Visitors are identified by IP address.
//
// LIMITATION, worth knowing: these counters live in the server's memory. On a
// host like Vercel, the site can run as several copies at once, and each copy
// keeps its own counts, which reset when a copy restarts. So treat this as a
// strong first line of defence, not an exact guarantee. The real backstop is
// the monthly spend limit you set in the Anthropic Console. For exact limits
// across all copies, swap this for a shared store such as Upstash Redis.
// =============================================================================

export const LIMITS = {
  perMinute: 8,
  perDay: 40,
  sitePerDay: 500,
};

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

// The counters live on globalThis. In development, Next.js reloads route code
// between requests, which would otherwise reset plain module variables (and
// silently disable the limit). globalThis survives those reloads.
type Store = { visitors: Map<string, number[]>; siteCount: number; siteWindowStart: number };
const g = globalThis as typeof globalThis & { __askRateLimit?: Store };
const store: Store = (g.__askRateLimit ??= { visitors: new Map(), siteCount: 0, siteWindowStart: Date.now() });
const visitors = store.visitors; // ip -> timestamps of recent requests

export type LimitResult = { ok: true } | { ok: false; message: string; retryAfterSeconds: number };

export function checkRateLimit(ip: string, now = Date.now()): LimitResult {
  // Site-wide daily counter
  if (now - store.siteWindowStart > DAY) {
    store.siteCount = 0;
    store.siteWindowStart = now;
  }
  if (store.siteCount >= LIMITS.sitePerDay) {
    return {
      ok: false,
      message: "The assistant has reached its daily limit. Please email Sinchana instead, or try again tomorrow.",
      retryAfterSeconds: Math.ceil((store.siteWindowStart + DAY - now) / 1000),
    };
  }

  // This visitor's requests in the last 24 hours
  const recent = (visitors.get(ip) ?? []).filter((t) => now - t < DAY);
  const lastMinute = recent.filter((t) => now - t < MINUTE);

  if (lastMinute.length >= LIMITS.perMinute) {
    visitors.set(ip, recent);
    return {
      ok: false,
      message: "You're asking quickly! Please wait a minute and try again.",
      retryAfterSeconds: Math.ceil((lastMinute[0] + MINUTE - now) / 1000),
    };
  }
  if (recent.length >= LIMITS.perDay) {
    visitors.set(ip, recent);
    return {
      ok: false,
      message: "You've reached today's question limit. For more, email Sinchana directly.",
      retryAfterSeconds: Math.ceil((recent[0] + DAY - now) / 1000),
    };
  }

  recent.push(now);
  visitors.set(ip, recent);
  store.siteCount++;

  // Keep memory small: forget visitors with no requests in the last day.
  if (visitors.size > 5000) {
    for (const [key, times] of visitors) if (times.every((t) => now - t >= DAY)) visitors.delete(key);
  }
  return { ok: true };
}

// Behind a host like Vercel, the visitor's real IP is in x-forwarded-for.
export function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}
