import { useEffect, useState } from 'react';
import { projects as staticProjects, type ProjectData } from '@/data/projects';

interface ContentResponse {
  projects?: ProjectData[];
  copy?: Record<string, unknown>;
}

function validProject(p: unknown): p is ProjectData {
  return !!p && typeof (p as ProjectData).id === 'string' && typeof (p as ProjectData).title === 'string';
}

/** Live project feed, or null when the worker is unreachable / unseeded. */
export async function fetchLiveProjects(): Promise<ProjectData[] | null> {
  try {
    const res = await fetch('/api/content');
    if (!res.ok) return null;
    const body = (await res.json()) as ContentResponse;
    const live = (body.projects ?? []).filter(validProject);
    return live.length > 0 ? live : null;
  } catch {
    return null;
  }
}

/**
 * Live projects with a static safety net.
 *
 * Fetches /api/content (D1 via the worker). Any failure — local vite dev
 * with no worker, empty table, a bad row — falls back to the bundled
 * statics, so the desktop never renders empty. Validates the shape before
 * trusting it: an entry without id/title is discarded, not rendered.
 */
export function useProjects(): ProjectData[] {
  const [projects, setProjects] = useState<ProjectData[]>(staticProjects);

  useEffect(() => {
    let cancelled = false;
    fetchLiveProjects().then((live) => {
      if (!cancelled && live) setProjects(live);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return projects;
}

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Persist one project doc (admin session required). Sends the whole doc. */
export async function saveProject(project: ProjectData): Promise<SaveResult> {
  try {
    const res = await fetch(`/api/content/project:${project.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...project, kind: 'project' }),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: body?.error ?? `http_${res.status}` };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export interface MediaItem {
  id: string;
  key: string;
  url: string;
  kind: 'image' | 'video' | 'favicon';
  slug: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export async function listMedia(): Promise<MediaItem[] | null> {
  try {
    const res = await fetch('/api/media');
    if (!res.ok) return null;
    const body = (await res.json()) as { items?: MediaItem[] };
    return body.items ?? [];
  } catch {
    return null;
  }
}

export async function uploadMedia(
  kind: MediaItem['kind'],
  slug: string,
  file: File,
): Promise<{ ok: true; item: MediaItem } | { ok: false; error: string }> {
  try {
    const form = new FormData();
    form.set('kind', kind);
    form.set('slug', slug);
    form.set('file', file);
    const res = await fetch('/api/media/upload', { method: 'POST', body: form });
    const body = (await res.json().catch(() => null)) as (MediaItem & { error?: string }) | null;
    if (res.ok && body && 'url' in body) return { ok: true, item: body as MediaItem };
    return { ok: false, error: body?.error ?? `http_${res.status}` };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export async function deleteMedia(
  id: string,
  force = false,
): Promise<{ ok: true } | { ok: false; error: string; referencedBy?: string[] }> {
  try {
    const res = await fetch(`/api/media/${encodeURIComponent(id)}${force ? '?force=1' : ''}`, {
      method: 'DELETE',
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => null)) as {
      error?: string;
      referencedBy?: string[];
    } | null;
    return { ok: false, error: body?.error ?? `http_${res.status}`, referencedBy: body?.referencedBy };
  } catch {
    return { ok: false, error: 'network' };
  }
}
