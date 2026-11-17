# Amber Studio SvelteKit rebuild: HANDOFF (continue locally)

Written 2026-11-17 by the cloud head session (`session_012MfFGngt89yPui2KERCKeB`).
Repo: `Amberesaiae/amberes-portfolio`. Read this first, then `STATUS.md`, `PIXEL-1.md`, `JUDGE-8.md`.

## 1. What this is
Amber Studio is Lamptey Odartei Isaiah's studio-of-one portfolio (motto "engineering real world solutions", "we" voice).
Target: a close structural clone of roydenso.com's **Playground** (grey scrolling board of about 48 cards: loose collage on top, rigid grid below) plus roydenso's opening **intro film**, rebuilt in **SvelteKit** (runes) + Tailwind v4 + shadcn-svelte-style components in `web/`.
`app/` (Vite React) and `site/` (Next scaffold) are REFERENCE ONLY.
Garaje GIFs are dropped. Only the gravity/scatter physics idea is ported (Matter.js).
Fonts: Geist stand-in until PP Neue Montreal is licensed.

## 2. Where the work is (branches, full refs)
Work is on **`origin/svelte-rebuild` @ `faf5952`**. This is the branch to continue from.

| Ref | Tip | What |
| --- | --- | --- |
| `origin/main` | `e17731a` | Merged SvelteKit rebuild **without `reference/`** (user approved merge; mocks excluded on purpose). Older than svelte-rebuild: does not have the mock-media, pixel-diff or latest intro/board work. |
| `origin/svelte-rebuild` | `faf5952` | Integrated head branch (all workers merged, checks green). |
| `origin/intro-film` | `c3841eb` | Old intro worker branch. **Do not merge**: conflicts with `intro-mock-media` in 5 files. Superseded. |
| `origin/intro-mock-media` | `a641965` | Intro with roydenso mock assets, 3-layer hold geometry. Merged. |
| `origin/board-mobile` | `1e77231` | Board + mobile + physics hookup. Merged. |
| `origin/board-mock-media` | `fffd83e` | Board with mock images/video, scrims, 358-square mobile tiles, 665x374 hero. Merged. |
| `origin/physics-gravity` | `efa8f56` | Matter.js gravity/scatter/reset. Merged. |
| `origin/dock` | `d479e33` | Dock (7 items, sheet stubs). Merged. |
| `origin/dock-icons` | `f056e10` | Dev-only mock dock icons. Merged. |
| `origin/a11y-pass` | `e4896fe` | Skip link, focus tokens, axe audit, A11Y.md. Merged. |
| `origin/judge-reports` | `85ecbe0` | `JUDGE-1..8.md` + screenshots in `docs/amber-studio/judge/`. Not merged into svelte-rebuild (docs only; `git show origin/judge-reports:docs/amber-studio/JUDGE-8.md`). |
| `origin/pixel-fidelity` | `f5015ac` | Pixel-diff harness (`web/scripts/pixel/`), `PIXEL-1.md`. Merged. |

Nothing is open as a PR. Never merge to main without the user's say-so.

## 3. Run it locally
```bash
git clone https://github.com/Amberesaiae/amberes-portfolio.git && cd amberes-portfolio
git checkout svelte-rebuild
cd web && npm install
```
With the roydenso mock assets (dev only, needs `reference/` which exists on `svelte-rebuild`, NOT on `main`):
```bash
MOCKS_OK=1 node scripts/sync-mock-icons.mjs   # runs dock icons + intro + board media sync
npm run dev                                   # http://localhost:5173
```
Checks:
```bash
npm run check          # svelte-check, 0 errors at faf5952
npx vitest run         # 20 tests passing
npm run build          # prebuild guard + postbuild leak check
```
The intro plays once per tab (sessionStorage). Open a new tab to replay. `/physics-demo` and `/dock-demo` are extra routes.
Node 22 / npm 10 were used. Pointer-heavy checks use Playwright (`npx playwright install chromium` locally).

## 4. Mock-asset rules (important)
- Roydenso images/media are **temporary mocks** the user explicitly authorised for PREVIEW ONLY. They must never reach a production build and must be replaced by Codex-made assets (`ASSET-WORKORDER.md`).
- Source of truth: committed only under `reference/` (roydenso-playground, roydenso-intro, roydenso-dock). `reference/` is deliberately **not** on `main`.
- Dev copies go to `web/static/_mock/` (gitignored). Components set `mockSrc`/`iconSrc` only when `import.meta.env.DEV`, so no `_mock` string exists in a production bundle; neutral placeholders/Lucide glyphs are the fallback.
- `prebuild` runs `scripts/sync-mock-icons.mjs --guard`: a production build **fails if `web/static/_mock/` exists unless `MOCKS_OK=1`**. Never set `MOCKS_OK` in CI/deploy. Delete `web/static/_mock` before a real build.
- `postbuild` greps `.svelte-kit/output` (js/html/css) for `_mock` and for `*_mock*` files. The server sourcemap still contains the source text (not served, accepted).
- `reference/` includes Royden So's copyrighted work and the About "R" mark. Do not make the repo public with it in history without a decision (see section 8).

## 5. Architecture and rules
- One component per file, typed props, content in `web/src/lib/data/`, no global mutable state outside stores, reduced-motion respected everywhere. Import alias is `#lib/...` (package.json imports), not `$lib`, in `components.json`.
- `web/src/routes/+layout.svelte` mounts `Intro`, `SkipLink`, `Dock`; `+page.svelte` renders `Board`.
- Areas: `lib/components/intro/**`, `lib/components/board/**`, `lib/physics/**` + `lib/components/physics/**`, `lib/components/dock/**`, `lib/a11y/**`, `lib/data/{intro,board,dock}.ts`, `lib/stores/intro.ts`.
- shadcn-svelte: the "maia" preset exists in CLI 1.8.1 (`init --preset maia`) but its registry host was blocked in the cloud sandbox, so `components.json`, `cn`, and tokens in `routes/layout.css` were written by hand. **Locally, run `npx shadcn-svelte@latest init --preset maia --base-color neutral --css src/routes/layout.css` with aliases `#lib/...` and pull real components** (button, dialog, tooltip, etc.); this was never done.
- Measured board spec: house aspect 1.39 at widths 206 and 250; portrait 160x220; one 665x374 16:9 hero; rigid 3-up grid of 358 squares at 25.7% pitch (x about 165/535/905 at 1440); mobile drops the collage and shows tiles in one column (all 358x358).

## 6. State of quality (honest)
- Judge round 7 (before mocks) scored 11/11 at 9+, but that was a 1-10 scale on **measured numbers**, not a pixel diff. User said it is **not pixel perfect**. Judge round 8 with mocks on: board fidelity 7/10, intro 8/10, a11y 8 (white text on busy images; scrims added since), intro 8 (timing; since fixed).
- Real pixel numbers exist **only for the intro**, against the live roydenso intro film (still live): hold frames 16 to 26% mismatch, hands crop 13.3% (1440) / 17.6% (390). Our hand cut-outs are pinch poses vs the live pose; only position/size match.
- **The board, dock, physics have never been pixel-compared.** `roydenso.com` today is a different, newer site (dark, PP Neue York, "Product and Brand Designer"). The Playground exists only in the Wayback archive (`https://web.archive.org/web/20260122225324/https://roydenso.com/`), which the cloud sandbox could not reach (egress reset even after allowlisting). **First job locally: capture the archived Playground and diff.**
- Clean prod: 0 `_mock` requests, 0 console errors, axe 0, JS about 164 KB, CLS 0, intro about 2.0 to 2.7 s.

## 7. Next steps (in order)
1. **Capture the Playground reference** (the blocker). Locally, with normal internet:
   ```bash
   cd web/scripts/pixel && npm install
   cd ../.. && node scripts/pixel/capture.mjs --site live --url "https://web.archive.org/web/20260122225324id_/https://roydenso.com/" --out pixel-out/playground
   ```
   (check `capture.mjs --help`; strip Wayback toolbar; 1440x900 and 390x844 at scroll 0/900/1800/2700 + full page). Capture ours into `pixel-out/ours` with the dev server running, then `node scripts/pixel/diff.mjs --a pixel-out/playground --b pixel-out/ours`, plus `compare-dom.mjs` for rects/type. Write `PIXEL-3.md`.
2. Fix the board by exact px deltas (card x/y/size/rotation, gaps, label type, hero position in first viewport, grid start), then dock, then physics feel. Loop: diff, fix, diff. Target numbers: report mismatch % per region, not 1-10 scores.
3. Intro: replace pinch-pose hand cut-outs to match live pose, remove ~0.9 s dev hydration lag effect in measurement, verify timeline vs live frames at 250 ms steps.
4. Pull real shadcn-svelte (maia) components; swap hand-written bits where it makes sense.
5. Dock: 4 actions (Terminal, Reel, Games, Archive) are stub dialogs; wire real targets or hide. About/Talk anchors `#about`, `#contact` need real sections on the page. 48px top menubar is deferred.
6. Fonts: license PP Neue Montreal; swap Geist.
7. Replace all mocks with Codex-made assets per `ASSET-WORKORDER.md`; then delete `reference/` from the working tree and history if the repo goes public.
8. Header/heading findings in PIXEL-1 section 4 (items 6-8) target the live site's NEW design, not the Playground; ignore until a Playground reference exists.
9. Extend `postbuild` to ignore server `.map` consciously (already excluded) and add a CI step: delete `web/static/_mock`, `npm run build`, assert no `png/webp/mp4/webm` in output.

## 8. Decisions waiting on the user
- Whether to keep `reference/` (153 files, about 14 MB, Royden's copyrighted work) tracked on `svelte-rebuild`/worker branches or scrub history before the repo or a preview is public. It is not on `main`.
- Whether `main` should also get the later `svelte-rebuild` work (mock-media, pixel harness, latest intro/board). Currently it has only the first merge (`e17731a`), and without `reference/`.
- Page ground: the plan uses a light grey board; live roydenso's new site is dark. Kept light on purpose (art direction).
- Environment: the cloud Default environment network allows `roydenso.com`, `www.roydenso.com`, `media.roydenso.com`, `framerusercontent.com`, `web.archive.org` (added at user's request; revert if unwanted).

## 9. Sessions (all cloud, idle or finished; none need resuming)
Head `session_012MfFGngt89yPui2KERCKeB`. Workers: Intro `…kLgPVG4zRxF2SYSHz` (old), Board `…pHpr8APB1PDRYQmHn`, Physics `…mopJp1AFNnXEX5dDa`, Dock `…kPwbbn76iRd3sHcup`, A11y `…kZGRYqf8rfayqFEWY`, Judge `…pR69vWMkpSx8SwauS`, Dock icons `…mh3X1t2XASdoiwjrc`, Board mock `…mnE4YHCxLuzPDGsWn`, Intro mock `…p31cwSqEQkGanqceW`, Pixel `…mNUJpoBgRzBf1r9HA`, Archive capture `…np4EADX9uoUVxfBQ5` (blocked, stop it). Scheduled loop ticks may still fire; they are harmless but can be deleted.
Workers declined relayed approvals for the roydenso mocks until the instruction was in their own starting brief; if you start new worker sessions, put the user's decisions in the first prompt.

## 10. Gotchas
- Dev adds about 0.9 s Vite hydration before the intro mounts; measure intro timing against a built preview with mocks, not raw dev.
- `data-reveal="hands"` must be on the board hero (done) for the intro hand-off.
- `npm run build` fails if `web/static/_mock` exists and `MOCKS_OK` is unset (by design).
- Two competing intro implementations existed (`intro-film` r9 vs `intro-mock-media`); only the latter is on `svelte-rebuild`.
- `STATUS.md` has the full worker history; `docs/amber-studio/judge/` and `pixel/` hold small evidence screenshots.
