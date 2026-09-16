/**
 * Best-effort per-isolate rate limiting for write/auth routes.
 *
 * Memory is per Worker isolate, so a burst spread across isolates can
 * exceed these caps — this stops casual abuse and accidents, not a
 * determined flood. Upgrade path: move the counters to a Durable Object
 * or Workers KV when the abuse case arrives.
 */

interface Bucket {
  hits: number[];
}

const buckets = new Map<string, Bucket>();

function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

/** True when the call is over budget and should get a 429. */
export function overBudget(request: Request, route: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;
  const key = `${route}:${clientIp(request)}`;
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }
  // Prune expired hits; drop the bucket entirely when empty.
  bucket.hits = bucket.hits.filter((t) => t > cutoff);
  if (bucket.hits.length === 0 && buckets.size > 5000) buckets.delete(key);
  if (bucket.hits.length >= limit) return true;
  bucket.hits.push(now);
  return false;
}

export function rateLimitedResponse(): Response {
  return Response.json(
    { error: 'rate_limited' },
    { status: 429, headers: { 'retry-after': '60' } },
  );
}
