# JUDGE-6 (extra round, authorised by head)

Subject: `origin/svelte-rebuild` @ `a144419` (board r7 grain/shadows, dock 7 items + sheet stub, roydenso mock icons dev-only). Clean install, `vite build` green. Two builds judged: (A) clean production build, no mocks; (B) mocks synced (`npm run mock-icons`) and built with `MOCKS_OK=1`, for the icon look only. Screenshots: `judge/r6-home-1440.jpg`, `r6-dock-prod.jpg`, `r6-dock-mock.jpg`, `r6-dock-mock-hover.jpg`, `r6-dock-sheet.jpg`.

## Scorecard

| # | Criterion | R5 | R6 | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | 9 | **9** | Grid 358.1px / pitch 25.7% unchanged, house 1.39, portrait 160x220, hero 665 16:9 at y=289 (1.5°). 48px menubar still absent |
| 2 | Collage feel | 8 | **9** (+1) | 0 overlaps, hero focal, visible paper grain on every card and two-tier shadows (hero has a long ambient shadow, small cards a contact shadow); reads as prints on a desk. Not 10: art is still flat placeholder glyphs |
| 3 | Intro film vs teardown | 9 | **9** | play 0.23–1.91s, reveal 1.91–2.72s, removed at **2.72s** (≤3.0) |
| 4 | Dock | 8 | **8** | 7 items back (3 anchors + 4 actions), one `nav`, scroll-spy, 56px tiles, 4 actions open an accessible stub sheet (dialog, focus moves in, Escape closes, focus returns). **But a production build requests 7 icons that 404** (see below), and the 4 actions are stubs |
| 5 | Physics | 9 | **9** | lazy engine (158.5 KB JS at load), reduced motion: card y 363.27→363.27, Reset exact |
| 6 | Mobile layout | 9 | **9** | hero card, 0 targets <44px, no overflow, CLS 0 (unchanged) |
| 7 | Typography / spacing | 9 | **9** | unchanged |
| 8 | Motion / reduced motion | 9 | **9** | unchanged |
| 9 | Accessibility | 9 | **9** | axe 0 violations; headings H1,H2,H3…,H2,H2,H2 (monotonic); sheet is a real dialog |
| 10 | Performance | 9 | **8** (−1) | JS 158.5 KB, CLS 0, 0 images, **but 7 failed requests (`/_mock/dock/*.png` → 404) on every cold load of a clean production build**, plus 7 console errors |
| 11 | Code quality | 9 | **9** | New `DockSheet.svelte` (one component), typed; guard script; tests still green |

Now ≥9: 9 of 11 (collage joined). Below 9: dock 8, performance 8 (new regression, one-line fix).

## Mock images vs production output (head's question)
- **Guard works.** With `web/static/_mock` present, `npm run build` (prebuild `--guard`) refuses: `[guard] web/static/_mock exists: temporary mock images would ship in this build`. `MOCKS_OK=1` lets the build through and then `.svelte-kit/output/client/_mock/dock/*.png` (7 PNGs) **is** emitted: the env var is the only protection, so it must never be set in CI/deploy.
- **Clean build is clean.** Build (A): 0 `.png` files and nothing named `_mock` in `.svelte-kit/output`. `git ls-files` shows no raster under `web/`; `static/_mock/` is gitignored.
- **But the path string ships.** `data/dock.ts` has `iconSrc: mock(k)` for all 7 items unconditionally, so the client bundle contains `/_mock/dock/*.png` and the browser requests all seven (404) on each load in production. Fallback to Lucide works (dock renders fine, `r6-dock-prod.jpg`), so users see no breakage, but it is 7 wasted requests and 7 red console errors.
- Tracked in git: `reference/roydenso-dock/*.png` (7 icons + ATTRIBUTION, 244 KB) is committed, outside `web/`, not in any build output. Acceptable under STATUS ("reference only"); just keep it out of any deploy path.

## Dock icon look (mock, build B)
- All seven PNGs load (256x256 natural, rendered 56px). Look (`r6-dock-mock.jpg`): Work/Archive = orange/ochre folders, About = black "R" glyph on a white square (Royden's own mark: this is the clearest reason the mock must not ship), Talk = red badge card, Terminal = blue Framer-like glyph, Reel = yellow, Games = orange.
- Silhouettes are inconsistent: folders are wide rectangles, About is a square tile, Talk/Reel/Games are flat landscape cards, so the row has uneven visual weight and uneven baselines; saturated primaries fight the neutral ink/paper board palette. Magnification (`r6-dock-mock-hover.jpg`, 1.0→1.7) is smooth and the tooltip ("Talk") sits cleanly above, no clipping.
- For the real set: one squircle plate (same mask, 56px, 28% radius as the Lucide fallback), one glyph weight, a palette limited to ink/paper/amber so the dock belongs to the board.

## Punch list
1. **[dock] (blocks 9 on dock and perf)** Gate icon URLs: set `iconSrc` only when `import.meta.env.DEV` (or when `import.meta.env.VITE_MOCKS === '1'`), e.g. `const mock = (k) => import.meta.env.DEV ? \`/_mock/dock/${k}.png\` : undefined;`, so a production bundle neither contains the path nor makes the requests. Acceptance: clean `vite build` + preview → 0 responses with status ≥400, 0 `_mock` strings in `.svelte-kit/output/client`.
2. **[dock]** The four actions (Terminal/Reel/Games/Archive) open "…opens here once its window is built" stubs. Fine for now; to reach 9 give at least Reel and Archive a real destination (anchor to a section or a populated sheet) so the dock does not advertise things that do not exist.
3. **[dock]** Real icon set per the notes above (single squircle plate, ink/paper/amber palette); replace the Royden "R" mark before anything is public.
4. **[head]** CI: assert `MOCKS_OK` is unset on any deploy job and add a post-build check `find .svelte-kit/output -path '*_mock*'` = 0.
5. **[board-mobile]** (non-blocking) 48px menubar, or record the deferral in STATUS.md.
6. **[board-mobile]** (non-blocking) Collage art is still glyph placeholders: swap for flat-lay photographs when assets arrive.

## Score history

| Criterion | R1 | R2 | R3 | R4 | R5 | R6 |
| --- | --- | --- | --- | --- | --- | --- |
| Geometry | 8 | 8 | 8 | 9 | 9 | 9 |
| Collage | 4 | 4 | 5 | 8 | 8 | 9 |
| Intro | 5 | 5 | 7 | 8 | 9 | 9 |
| Dock | 6 | 6 | 6 | 8 | 8 | 8 |
| Physics | 2 | 6 | 6 | 8 | 9 | 9 |
| Mobile | 6 | 6 | 6 | 8 | 9 | 9 |
| Typography | 5 | 5 | 6 | 8 | 9 | 9 |
| Motion | 7 | 6 | 6 | 8 | 9 | 9 |
| Accessibility | 7 | 7 | 7 | 9 | 9 | 9 |
| Performance | 8 | 6 | 6 | 9 | 9 | 8 |
| Code quality | 8 | 8 | 8 | 8 | 9 | 9 |
