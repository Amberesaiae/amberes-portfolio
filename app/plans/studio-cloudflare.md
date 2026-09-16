# Studio + Cloudflare plan

One domain serves the desktop (`dist/`) and the `/api/*` surface.
Content lives in D1, media in R2, Studio gated by WorkOS AuthKit.

## Phase 0 — Cloudflare cutover (no auth) [IN PROGRESS]

1. D1 `amber-content` + `CONTENT_DB` binding in `wrangler.toml`.
   Migration `migrations/0001_content.sql`: `content(id TEXT PK, kind TEXT,
   data JSON, updated_at)`.
2. Seed from `src/data/projects.ts` + site copy (`scripts/seed-content.mts`,
   outputs `migrations/0002_seed.sql`).
3. Worker `GET /api/content` reads D1, returns `{ projects, copy }`.
   Empty table → 200 with empty arrays (frontend falls back to static).
4. Frontend `src/hooks/useContent.ts`: fetch `/api/content`, fall back to
   static `projects` import on error/empty. `WorkPane` adopts it first;
   other consumers migrate incrementally.
5. `tsc -b` + `vite build` clean. Vercel stays as rollback until DNS moves.

Needs human: `wrangler login`, `wrangler d1 create amber-content`
(paste `database_id` into `wrangler.toml`), `wrangler d1 execute --file`,
`./scripts/deploy-cloudflare.sh`. Plus WorkOS/hosting setup:
1. Dashboard → Staging env → Authentication → add redirect URL
   `https://<your-domain>/api/auth/callback` (and the workers.dev URL
   for first smoke test).
2. `wrangler secret put WORKOS_API_KEY` (Staging API key),
   `wrangler secret put SESSION_SECRET` (32+ random chars).
3. Update `WORKOS_REDIRECT_URI` in `wrangler.toml` to the real domain,
   deploy, open `/​#/studio`, sign in.

## Phase 1 — WorkOS admin login [CODE DONE, needs deploy + dashboard]

Worker `worker/auth.ts`: `/api/auth/login → /callback → /me → /logout`.
Code exchanged via `user_management/authenticate` (per WorkOS docs);
session sealed AES-GCM (WebCrypto, zero deps) in HttpOnly Secure cookie,
7-day TTL. Admin rights from `ADMIN_USERS` allowlist only.
App `/#/studio` (HashRouter route, outside the desktop): loading /
signed-out (WorkOS sign-in) / denied / admin shell with read-only project
inventory. Worker also gained an SPA fallback (extensionless non-/api
paths serve `/index.html` via `ASSETS`) so deep links load the shell.

## Phase 2 — Live content editing [CODE DONE]

`PUT /api/content/:id` (`worker/content.ts`, admin session via
`requireAdmin`, 60/min/IP): full-row upsert, id/kind cross-checked, project
docs must carry id + title — bad shapes rejected, never stored.
Studio Projects tab: select → edit title/client/year/description/
challenge/solution → Save_Live, local list updates. Public feed unaffected
by failures (static fallback stands).

## Phase 3 — Media pipeline [CODE DONE]

`POST /api/media/upload` (admin, multipart kind/slug/file, 20/min/IP):
per-kind policy (image 12MB, video 50MB, favicon 2MB; ext+MIME whitelist),
R2 key `media/<kind>/<slug>-<ts>.<ext>`, `media` ledger row in D1.
`GET /api/media` ledger, `DELETE /api/media/:id` refuses when live content
references the key unless `?force=1`. `/media/*` served from R2 with the
same range/immutable-cache path as `/vids/*`; R2 range logic factored into
`serveR2Object`. Studio Media tab: kind/slug/file upload, previews,
copy-URL, delete with conflict display. Big videos: `wrangler r2 object
put amber-portfolio-media media/video/<name>.mp4 <file>` (Studio caps at
50MB — isolate memory). Vercel Blob scripts retired from package.json.

## Phase 4 — Harden + decommission Vercel [CODE DONE, cutover is human]

Landed: per-isolate rate limits (`worker/ratelimit.ts` — auth-callback
20/min, content-put 60/min, media-upload 20/min, media-delete 30/min;
upgrade path is a Durable Object/KV counter), immutable cache on R2 media,
60s on `/api/content`, Vercel Blob npm scripts removed.

Still you, in order:
1. `wrangler login` (this sandbox has no route to Cloudflare's API).
2. `wrangler d1 create amber-content` → paste `database_id` in
   `wrangler.toml`; `wrangler d1 execute amber-content
   --file=migrations/0001_content.sql` then `0002_seed.sql`.
3. `wrangler r2 bucket create amber-portfolio-media` (if absent);
   big videos via `wrangler r2 object put`.
4. `wrangler secret put WORKOS_API_KEY` + `wrangler secret put
   SESSION_SECRET`.
5. `./scripts/deploy-cloudflare.sh`, smoke-test `/api/health`,
   `/api/content`, `/#/studio` login on the workers.dev URL.
6. DNS: nameservers moved to Cloudflare (duke/stella), zone Active in
   your account. workers.dev live: `amber-portfolio.glean-circular-passport`
   (resolves globally, 200). Custom-domain attach is dashboard-only
   (wrangler OAuth token lacks zone scope): Workers → amber-portfolio →
   Settings → Domains & Routes → Add Custom Domain → `amberesaiae.space`
   + `www.amberesaiae.space`. AuthKit callback for the apex is already
   registered via WorkOS MCP, so login lights up on attach.
7. After cutover: add the workers.dev callback URI, then delete Vercel
   project when stable. Optional upgrades: refresh-token rotation,
   `?width=` image variants via CF Image Resizing, Durable Object limits.
