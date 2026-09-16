import type { Env } from './index';
import { getSession, isAdmin, type StudioSession } from './auth';
import { overBudget, rateLimitedResponse } from './ratelimit';

/** Verified admin session, or null. Every write route goes through this. */
export async function requireAdmin(
  request: Request,
  env: Env,
): Promise<StudioSession | null> {
  const session = await getSession(request, env);
  if (!session || !isAdmin(session, env.ADMIN_USERS)) return null;
  return session;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * PUT /api/content/:id — upsert one content row (admin only).
 *
 * :id is the full row id (`project:<slug>` / `copy:<key>`); the body's
 * `kind` must match the prefix and project docs must carry id + title.
 * Unknown shapes are rejected rather than stored — a bad row must never
 * be able to blank the public feed.
 */
export async function handleContentPut(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (request.method !== 'PUT' || !url.pathname.startsWith('/api/content/')) return null;

  const session = await requireAdmin(request, env);
  if (!session) return Response.json({ error: 'forbidden' }, { status: 403 });
  if (!env.CONTENT_DB) return Response.json({ error: 'content_unavailable' }, { status: 503 });
  if (overBudget(request, 'content-put', 60, 60)) return rateLimitedResponse();

  const id = decodeURIComponent(url.pathname.slice('/api/content/'.length));
  const [kind, ...rest] = id.split(':');
  if ((kind !== 'project' && kind !== 'copy') || rest.length === 0 || rest.join(':') === '') {
    return Response.json({ error: 'bad_id' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'bad_json' }, { status: 400 });
  }
  if (!isRecord(body)) return Response.json({ error: 'bad_doc' }, { status: 400 });
  if (body['kind'] !== undefined && body['kind'] !== kind) {
    return Response.json({ error: 'kind_mismatch' }, { status: 400 });
  }
  if (kind === 'project') {
    if (typeof body['id'] !== 'string' || typeof body['title'] !== 'string') {
      return Response.json({ error: 'project_needs_id_title' }, { status: 400 });
    }
    if (`project:${body['id']}` !== id) {
      return Response.json({ error: 'id_mismatch' }, { status: 400 });
    }
  }

  const doc = { ...body, kind };
  await env.CONTENT_DB.prepare(
    `INSERT INTO content (id, kind, data, updated_at) VALUES (?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
     ON CONFLICT(id) DO UPDATE SET kind = excluded.kind, data = excluded.data,
       updated_at = excluded.updated_at`,
  )
    .bind(id, kind, JSON.stringify(doc))
    .run();

  return Response.json({ ok: true, id, updatedBy: session.email });
}
