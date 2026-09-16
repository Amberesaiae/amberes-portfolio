import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, TriangleAlert } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import Meta from '../components/Meta';
import {
  deleteMedia,
  fetchLiveProjects,
  listMedia,
  saveProject,
  uploadMedia,
  type MediaItem,
} from '@/hooks/useContent';
import { projects as staticProjects, type ProjectData } from '@/data/projects';

interface MeResponse {
  authenticated: boolean;
  user?: { id: string; email: string };
  isAdmin?: boolean;
}

type Status =
  | { state: 'loading' }
  | { state: 'signed-out'; error: string | null }
  | { state: 'denied'; email: string }
  | { state: 'admin'; email: string };

const ERROR_COPY: Record<string, string> = {
  bad_callback: 'LOGIN_HANDSHAKE_MISMATCH // TRY_AGAIN',
  exchange_failed: 'WORKOS_CODE_EXCHANGE_FAILED // TRY_AGAIN',
  no_user: 'NO_USER_ON_WORKOS_RESPONSE // CONTACT_ADMIN',
  not_configured: 'AUTH_NOT_CONFIGURED_ON_WORKER // SEE_DEPLOY_NOTES',
};

/**
 * Studio gate + editors. The worker owns the session (sealed HttpOnly
 * cookie) and the admin allowlist; this page only renders what the APIs
 * report. Projects tab edits live D1 docs; Media tab runs the R2 pipeline
 * (upload -> ledger -> preview -> reference-checked delete).
 */
export default function Studio() {
  const [status, setStatus] = useState<Status>({ state: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
    fetch('/api/auth/me')
      .then((res) => (res.ok ? (res.json() as Promise<MeResponse>) : null))
      .then((me) => {
        if (cancelled) return;
        if (!me?.authenticated || !me.user) {
          setStatus({ state: 'signed-out', error: params.get('error') });
        } else if (!me.isAdmin) {
          setStatus({ state: 'denied', email: me.user.email });
        } else {
          setStatus({ state: 'admin', email: me.user.email });
        }
      })
      .catch(() => {
        if (!cancelled) setStatus({ state: 'signed-out', error: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageWrapper>
      <Meta title="Studio // Admin" description="Private content studio. Admins only." />
      <main className="bg-transparent min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8 text-center">
          {status.state === 'loading' && (
            <p className="text-[#444] text-[10px] uppercase tracking-[0.5em] font-mono animate-pulse">
              Verifying_Session…
            </p>
          )}

          {status.state === 'signed-out' && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 border border-white/10 flex items-center justify-center">
                  <Lock className="text-[#FFB000] w-6 h-6" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-white font-serif text-4xl tracking-tighter">STUDIO</h1>
                <p className="text-[#444] text-[10px] uppercase tracking-[0.5em] font-mono">
                  Restricted_Area // Admins_Only
                </p>
                {status.error && (
                  <p className="text-[#ff4d4d] text-[10px] uppercase tracking-[0.2em] font-mono">
                    {ERROR_COPY[status.error] ?? 'LOGIN_FAILED // TRY_AGAIN'}
                  </p>
                )}
              </div>
              <a
                href="/api/auth/login"
                className="inline-flex items-center gap-4 group text-[#FFB000] hover:text-white transition-all"
              >
                <div className="w-10 h-10 border border-[#FFB000]/30 flex items-center justify-center group-hover:border-white transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.5em]">Sign_In_With_WorkOS</span>
              </a>
            </>
          )}

          {status.state === 'denied' && (
            <>
              <div className="flex justify-center">
                <div className="w-16 h-16 border border-[#ff4d4d]/20 flex items-center justify-center">
                  <TriangleAlert className="text-[#ff4d4d] w-6 h-6" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-white font-serif text-4xl tracking-tighter">ACCESS_DENIED</h1>
                <p className="text-[#444] text-[10px] uppercase tracking-[0.2em] font-mono">
                  {status.email} // NOT_ON_ADMIN_ALLOWLIST
                </p>
              </div>
              <a
                href="/api/auth/logout"
                className="text-xs font-mono uppercase tracking-[0.5em] text-[#FFB000] hover:text-white transition-all"
              >
                Sign_Out
              </a>
            </>
          )}

          {status.state === 'admin' && <AdminStudio email={status.email} />}

          <Link
            to="/"
            className="inline-flex items-center gap-4 group text-[#666] hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-mono uppercase tracking-[0.5em]">Return_to_Nexus</span>
          </Link>
        </div>
      </main>
    </PageWrapper>
  );
}

type Tab = 'projects' | 'media';

function AdminStudio({ email }: { email: string }) {
  const [tab, setTab] = useState<Tab>('projects');

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-white font-serif text-4xl tracking-tighter">STUDIO</h1>
        <p className="text-[#444] text-[10px] uppercase tracking-[0.2em] font-mono">
          {email} // SESSION_LIVE
        </p>
      </div>

      <div className="flex justify-center gap-6">
        {(['projects', 'media'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs font-mono uppercase tracking-[0.5em] transition-all ${
              tab === t ? 'text-[#FFB000]' : 'text-[#666] hover:text-white'
            }`}
          >
            {t === 'projects' ? 'Projects' : 'Media'}
          </button>
        ))}
      </div>

      {tab === 'projects' ? <ProjectEditor /> : <MediaManager />}

      <div>
        <a
          href="/api/auth/logout"
          className="text-xs font-mono uppercase tracking-[0.5em] text-[#FFB000] hover:text-white transition-all"
        >
          Sign_Out
        </a>
      </div>
    </>
  );
}

const EDITABLE_FIELDS = [
  { key: 'title', label: 'TITLE', multiline: false },
  { key: 'client', label: 'CLIENT', multiline: false },
  { key: 'year', label: 'YEAR', multiline: false },
  { key: 'description', label: 'DESCRIPTION', multiline: true },
  { key: 'challenge', label: 'CHALLENGE', multiline: true },
  { key: 'solution', label: 'SOLUTION', multiline: true },
] as const;

function ProjectEditor() {
  const [projects, setProjects] = useState<ProjectData[]>(staticProjects);
  const [live, setLive] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<ProjectData>>({});
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | string>('idle');

  useEffect(() => {
    let cancelled = false;
    fetchLiveProjects().then((items) => {
      if (cancelled || !items) return;
      setProjects(items);
      setLive(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = projects.find((p) => p.id === selectedId) ?? null;

  function select(id: string) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    setSelectedId(id);
    setDraft({
      title: project.title,
      client: project.client ?? '',
      year: project.year,
      description: project.description,
      challenge: project.challenge ?? '',
      solution: project.solution ?? '',
    });
    setSaveState('idle');
  }

  async function save() {
    if (!selected) return;
    setSaveState('saving');
    const updated: ProjectData = {
      ...selected,
      title: draft.title?.trim() || selected.title,
      client: draft.client?.trim() || undefined,
      year: draft.year?.trim() || selected.year,
      description: draft.description?.trim() || selected.description,
      challenge: draft.challenge?.trim() || undefined,
      solution: draft.solution?.trim() || undefined,
    };
    const result = await saveProject(updated);
    if (result.ok) {
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSaveState('saved');
    } else {
      setSaveState(result.error);
    }
  }

  return (
    <div className="text-left space-y-4">
      {!live && (
        <p className="text-[#FFB000] text-[10px] uppercase tracking-[0.2em] font-mono text-center">
          Static_Fallback // Worker_Unseeded_Or_Offline
        </p>
      )}
      <ul className="font-mono text-[10px] text-[#888] space-y-1 bg-black/50 p-6 border border-white/5">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => select(p.id)}
              className={`flex justify-between gap-4 w-full text-left transition-colors ${
                p.id === selectedId ? 'text-[#FFB000]' : 'hover:text-white'
              }`}
            >
              <span>{p.title}</span>
              <span className="shrink-0">{p.year}</span>
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="space-y-3 bg-black/50 p-6 border border-white/5">
          {EDITABLE_FIELDS.map(({ key, label, multiline }) => (
            <label key={key} className="block space-y-1">
              <span className="text-[#444] text-[10px] uppercase tracking-[0.2em] font-mono">
                {label}
              </span>
              {multiline ? (
                <textarea
                  value={(draft[key] as string) ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs text-white/90 focus:border-[#FFB000]/50 focus:outline-none"
                />
              ) : (
                <input
                  value={(draft[key] as string) ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs text-white/90 focus:border-[#FFB000]/50 focus:outline-none"
                />
              )}
            </label>
          ))}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={save}
              disabled={saveState === 'saving'}
              className="text-xs font-mono uppercase tracking-[0.5em] text-[#FFB000] hover:text-white transition-all disabled:opacity-50"
            >
              {saveState === 'saving' ? 'Saving…' : 'Save_Live'}
            </button>
            {saveState === 'saved' && (
              <span className="text-emerald-400 text-[10px] uppercase tracking-[0.2em] font-mono">
                Saved_To_D1
              </span>
            )}
            {typeof saveState === 'string' && !['idle', 'saving', 'saved'].includes(saveState) && (
              <span className="text-[#ff4d4d] text-[10px] uppercase tracking-[0.2em] font-mono">
                Save_Failed // {saveState}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaManager() {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [kind, setKind] = useState<MediaItem['kind']>('image');
  const [slug, setSlug] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{ id: string; referencedBy: string[] } | null>(null);

  async function refresh() {
    setItems(await listMedia());
  }

  useEffect(() => {
    let cancelled = false;
    listMedia().then((result) => {
      if (!cancelled) setItems(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function upload() {
    if (!file) {
      setNote('NO_FILE_SELECTED');
      return;
    }
    setBusy(true);
    setNote(null);
    const result = await uploadMedia(kind, slug || file.name.replace(/\.[^.]+$/, ''), file);
    setBusy(false);
    if (result.ok) {
      setFile(null);
      setSlug('');
      setNote(`UPLOADED // ${result.item.url}`);
      refresh();
    } else {
      setNote(`UPLOAD_FAILED // ${result.error}`);
    }
  }

  async function remove(id: string, force: boolean) {
    const result = await deleteMedia(id, force);
    if (result.ok) {
      setConflict(null);
      setNote('DELETED');
      refresh();
    } else if (result.error === 'referenced') {
      setConflict({ id, referencedBy: result.referencedBy ?? [] });
      setNote(null);
    } else {
      setNote(`DELETE_FAILED // ${result.error}`);
    }
  }

  return (
    <div className="text-left space-y-4">
      <div className="space-y-3 bg-black/50 p-6 border border-white/5">
        <div className="flex gap-4">
          {(['image', 'video', 'favicon'] as MediaItem['kind'][]).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-all ${
                kind === k ? 'text-[#FFB000]' : 'text-[#666] hover:text-white'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug (optional — defaults to filename)"
          className="w-full bg-white/5 border border-white/10 p-3 font-mono text-xs text-white/90 focus:border-[#FFB000]/50 focus:outline-none"
        />
        <input
          type="file"
          accept={kind === 'video' ? 'video/mp4,video/webm' : 'image/*,.ico,.svg'}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full font-mono text-xs text-[#888] file:mr-4 file:bg-white/5 file:border file:border-white/10 file:p-2 file:font-mono file:text-xs file:text-white/80"
        />
        <button
          onClick={upload}
          disabled={busy || !file}
          className="text-xs font-mono uppercase tracking-[0.5em] text-[#FFB000] hover:text-white transition-all disabled:opacity-50"
        >
          {busy ? 'Uploading…' : 'Upload_To_R2'}
        </button>
        {note && (
          <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#888] break-all">
            {note}
          </p>
        )}
        {conflict && (
          <div className="border border-[#ff4d4d]/30 p-3 space-y-2">
            <p className="text-[#ff4d4d] text-[10px] uppercase tracking-[0.2em] font-mono">
              Referenced_By // {conflict.referencedBy.join(', ')}
            </p>
            <button
              onClick={() => remove(conflict.id, true)}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ff4d4d] hover:text-white transition-all"
            >
              Force_Delete_Anyway
            </button>
          </div>
        )}
      </div>

      {items === null ? (
        <p className="text-[#444] text-[10px] uppercase tracking-[0.2em] font-mono text-center">
          Ledger_Unreachable // Worker_Offline
        </p>
      ) : items.length === 0 ? (
        <p className="text-[#444] text-[10px] uppercase tracking-[0.2em] font-mono text-center">
          No_Uploads_Yet
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <li key={item.id} className="bg-black/50 border border-white/5 p-3 space-y-2">
              {item.kind === 'video' ? (
                <video src={item.url} className="w-full aspect-video object-cover" preload="metadata" />
              ) : (
                <img src={item.url} alt={item.slug} className="w-full aspect-video object-contain bg-white/5" loading="lazy" />
              )}
              <p className="font-mono text-[10px] text-[#888] break-all">{item.url}</p>
              <div className="flex justify-between font-mono text-[10px]">
                <button
                  onClick={() => navigator.clipboard?.writeText(item.url).catch(() => {})}
                  className="uppercase tracking-[0.2em] text-[#FFB000] hover:text-white transition-all"
                >
                  Copy_URL
                </button>
                <button
                  onClick={() => remove(item.id, false)}
                  className="uppercase tracking-[0.2em] text-[#666] hover:text-[#ff4d4d] transition-all"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
