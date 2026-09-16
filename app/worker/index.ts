import { handleAuth } from './auth';
import { handleChat } from './chat';
import { handleContact } from './contact';
import { handleContentPut } from './content';
import { handleMediaDelete, handleMediaList, handleMediaUpload } from './media';

export interface Env {
  MEDIA_BUCKET: R2Bucket;
  CONTENT_DB: D1Database;
  /** Static-asset manifest binding, used for the SPA fallback below. */
  ASSETS: Fetcher;
  WORKOS_CLIENT_ID?: string;
  WORKOS_API_KEY?: string;
  WORKOS_REDIRECT_URI?: string;
  SESSION_SECRET?: string;
  /** Comma-separated admin emails or WorkOS user IDs. */
  ADMIN_USERS?: string;
  /** Contact form — see worker/contact.ts. Set with `wrangler secret put`. */
  RESEND_API_KEY?: string;
  CONTACT_EMAIL?: string;
  CONTACT_FROM?: string;
  /** Talk assistant — see worker/chat.ts. Set with `wrangler secret put`. */
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
  SITE_URL?: string;
}

/**
 * Edge entry. Static assets (dist/) serve the desktop; this worker answers
 * /api/* and /vids/* + /media/* — media lives in R2 (single files may exceed
 * the 25 MiB Workers asset cap), everything else falls through to the static
 * site.
 *
 * Content reads come from D1 (see migrations/); an empty table returns empty
 * arrays and the frontend falls back to its static bundle. Studio auth is
 * WorkOS AuthKit (/api/auth/*); content writes (/api/content PUT) and media
 * uploads (/api/media/*) require the admin session verified in auth.ts.
 */

/**
 * Serve one R2 object with HTTP range support, so video scrubs and
 * resumable image loads work. Shared by /vids/* (legacy) and /media/*.
 */
async function serveR2Object(
  bucket: R2Bucket,
  key: string,
  request: Request,
  ctx: ExecutionContext,
): Promise<Response> {
  // Edge-cache reads: without this every PoP pays Worker -> R2 origin
  // latency (~1s TTFB measured) on first hit. Keys are content-addressed
  // in practice (hashed media), and immutable cache-control below makes
  // stale reads a non-issue. (Cast: DOM lib's CacheStorage shadows the
  // workers type, which is the one that declares `default`.)
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(new URL(request.url).toString(), request);
  const hasRange = request.headers.has('range');
  if (!hasRange) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }
  const obj = await bucket.get(key, hasRange ? { range: request.headers } : undefined);
  if (!obj) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('accept-ranges', 'bytes');
  headers.set('cache-control', 'public, max-age=31536000, immutable');

  const range = obj.range;
  if (range && 'offset' in range && typeof range.offset === 'number') {
    const end = range.length != null ? range.offset + range.length - 1 : obj.size - 1;
    headers.set('content-range', `bytes ${range.offset}-${end}/${obj.size}`);
    return new Response(obj.body, { status: 206, headers });
  }
  const res = new Response(obj.body, { headers });
  // waitUntil so the origin fetch never blocks the response itself.
  ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true, service: 'amber-portfolio' });
    }

    const contact = await handleContact(request, env, url);
    if (contact) return contact;

    const chat = await handleChat(request, env, url);
    if (chat) return chat;

    const auth = await handleAuth(request, env, url);
    if (auth) return auth;

    const contentPut = await handleContentPut(request, env, url);
    if (contentPut) return contentPut;

    const mediaUpload = await handleMediaUpload(request, env, url);
    if (mediaUpload) return mediaUpload;

    const mediaList = await handleMediaList(request, env, url);
    if (mediaList) return mediaList;

    const mediaDelete = await handleMediaDelete(request, env, url);
    if (mediaDelete) return mediaDelete;

    if (url.pathname === '/api/content' && request.method === 'GET') {
      // No binding locally / table not seeded yet -> frontend uses statics.
      if (!env.CONTENT_DB) return Response.json({ projects: [], copy: {} });
      const { results } = await env.CONTENT_DB.prepare(
        'SELECT kind, data FROM content',
      ).all<{ kind: string; data: string }>();
      const projects: unknown[] = [];
      const copy: Record<string, unknown> = {};
      for (const row of results ?? []) {
        try {
          const doc = JSON.parse(row.data) as { id?: string };
          if (row.kind === 'project') projects.push(doc);
          else if (row.kind === 'copy' && doc.id) copy[doc.id] = doc;
        } catch {
          /* one bad row never breaks the whole feed */
        }
      }
      return Response.json(
        { projects, copy },
        { headers: { 'cache-control': 'public, max-age=60' } },
      );
    }

    if (url.pathname.startsWith('/vids/')) {
      return serveR2Object(env.MEDIA_BUCKET, url.pathname.slice(1), request, ctx);
    }

    if (url.pathname.startsWith('/media/')) {
      return serveR2Object(env.MEDIA_BUCKET, url.pathname.slice(1), request, ctx);
    }

    // SPA fallback: deep links (/#/... paths arrive here as their path part)
    // load the desktop shell; hashed assets and files with extensions 404.
    if (!url.pathname.startsWith('/api/') && !url.pathname.split('/').pop()?.includes('.')) {
      url.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(url, request));
    }

    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
