import type { Env } from './index';
import { requireAdmin } from './content';
import { overBudget, rateLimitedResponse } from './ratelimit';

type MediaKind = 'image' | 'video' | 'favicon';

/** Per-kind upload policy. Video cap stays well under isolate memory: the
 *  whole multipart body is buffered to parse it, so Studio is for web-sized
 *  assets — anything bigger goes up via `wrangler r2 object put`. */
const POLICY: Record<MediaKind, { maxBytes: number; mime: string[]; ext: string[] }> = {
  image: {
    maxBytes: 12 * 1024 * 1024,
    mime: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'],
    ext: ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif'],
  },
  video: {
    maxBytes: 50 * 1024 * 1024,
    mime: ['video/mp4', 'video/webm'],
    ext: ['mp4', 'webm'],
  },
  favicon: {
    maxBytes: 2 * 1024 * 1024,
    mime: ['image/png', 'image/webp', 'image/svg+xml', 'image/x-icon'],
    ext: ['png', 'webp', 'svg', 'ico'],
  },
};

export interface MediaRecord {
  id: string;
  key: string;
  url: string;
  kind: MediaKind;
  slug: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  uploadedAt: string;
}

function sanitizeSlug(raw: string | null): string {
  const slug = (raw ?? 'asset').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return (slug || 'asset').slice(0, 60);
}

function extOf(filename: string): string {
  const parts = filename.toLowerCase().split('.');
  return parts.length > 1 ? parts.pop()! : '';
}

/**
 * POST /api/media/upload — multipart {kind, slug, file} (admin only).
 * Stores the object in R2 under media/<kind>/ and logs a `media` row in
 * D1 so Studio can list, preview, and reference-check deletes.
 */
export async function handleMediaUpload(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (request.method !== 'POST' || url.pathname !== '/api/media/upload') return null;

  const session = await requireAdmin(request, env);
  if (!session) return Response.json({ error: 'forbidden' }, { status: 403 });
  if (!env.CONTENT_DB) return Response.json({ error: 'content_unavailable' }, { status: 503 });
  if (overBudget(request, 'media-upload', 20, 60)) return rateLimitedResponse();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: 'bad_form' }, { status: 400 });
  }

  const kindValue = form.get('kind');
  if (kindValue !== 'image' && kindValue !== 'video' && kindValue !== 'favicon') {
    return Response.json({ error: 'bad_kind' }, { status: 400 });
  }
  const policy = POLICY[kindValue];
  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: 'no_file' }, { status: 400 });
  }
  if (file.size > policy.maxBytes) {
    return Response.json({ error: 'too_large', maxBytes: policy.maxBytes }, { status: 413 });
  }
  const ext = extOf(file.name);
  if (!policy.ext.includes(ext) || !policy.mime.includes(file.type)) {
    return Response.json({ error: 'bad_type' }, { status: 415 });
  }

  const slug = sanitizeSlug(typeof form.get('slug') === 'string' ? (form.get('slug') as string) : null);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const key = `media/${kindValue}/${slug}-${stamp}.${ext}`;
  const recordId = `media:${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  const record: MediaRecord = {
    id: recordId,
    key,
    url: `/${key}`,
    kind: kindValue,
    slug,
    size: file.size,
    contentType: file.type,
    uploadedBy: session.email,
    uploadedAt: new Date().toISOString(),
  };
  await env.CONTENT_DB.prepare(
    `INSERT INTO content (id, kind, data, updated_at) VALUES (?, 'media', ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
  )
    .bind(recordId, JSON.stringify(record))
    .run();

  return Response.json({ ok: true, ...record });
}

/** GET /api/media — newest-first media ledger (admin only). */
export async function handleMediaList(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (request.method !== 'GET' || url.pathname !== '/api/media') return null;

  const session = await requireAdmin(request, env);
  if (!session) return Response.json({ error: 'forbidden' }, { status: 403 });
  if (!env.CONTENT_DB) return Response.json({ error: 'content_unavailable' }, { status: 503 });

  const { results } = await env.CONTENT_DB.prepare(
    `SELECT data FROM content WHERE kind = 'media' ORDER BY rowid DESC LIMIT 100`,
  ).all<{ data: string }>();
  const items: MediaRecord[] = [];
  for (const row of results ?? []) {
    try {
      items.push(JSON.parse(row.data) as MediaRecord);
    } catch {
      /* skip the bad row */
    }
  }
  return Response.json({ items });
}

/**
 * DELETE /api/media/:recordId — remove object + ledger row (admin only).
 * Refuses when live content references the key unless ?force=1, so a
 * delete can never silently break a published image or video.
 */
export async function handleMediaDelete(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (request.method !== 'DELETE' || !url.pathname.startsWith('/api/media/')) return null;

  const session = await requireAdmin(request, env);
  if (!session) return Response.json({ error: 'forbidden' }, { status: 403 });
  if (!env.CONTENT_DB) return Response.json({ error: 'content_unavailable' }, { status: 503 });
  if (overBudget(request, 'media-delete', 30, 60)) return rateLimitedResponse();

  const recordId = decodeURIComponent(url.pathname.slice('/api/media/'.length));
  const row = await env.CONTENT_DB.prepare(`SELECT data FROM content WHERE id = ? AND kind = 'media'`)
    .bind(recordId)
    .first<{ data: string }>();
  if (!row) return Response.json({ error: 'not_found' }, { status: 404 });

  let record: MediaRecord;
  try {
    record = JSON.parse(row.data) as MediaRecord;
  } catch {
    return Response.json({ error: 'bad_row' }, { status: 500 });
  }

  if (url.searchParams.get('force') !== '1') {
    const refs = await env.CONTENT_DB.prepare(
      `SELECT id FROM content WHERE kind != 'media' AND data LIKE ? LIMIT 10`,
    )
      .bind(`%${record.key}%`)
      .all<{ id: string }>();
    const referencedBy = (refs.results ?? []).map((r) => r.id);
    if (referencedBy.length > 0) {
      return Response.json({ error: 'referenced', referencedBy }, { status: 409 });
    }
  }

  await env.MEDIA_BUCKET.delete(record.key);
  await env.CONTENT_DB.prepare(`DELETE FROM content WHERE id = ?`).bind(recordId).run();
  return Response.json({ ok: true, deleted: recordId });
}
