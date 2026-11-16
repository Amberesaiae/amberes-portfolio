# JUDGE-7

Subject: `origin/svelte-rebuild` @ `f056e10` (dev-only `iconSrc`, `postbuild` leak check, uniform mock icon tiles with About = Lucide). Clean install, build + vitest (17/17) green. Production build = `npm run build` with no `static/_mock`, served by `vite preview`. Screenshots: `judge/r7-home-1440.jpg`, `r7-home-390.jpg`, `r7-dock-prod.jpg`, `r7-dock-mock-dev.jpg`, `r7-dock-mock-hover-dev.jpg` (mock look only exists under `vite dev`).

## Production verification (the head's questions)
- **0 `_mock` requests, 0 console errors/warnings, 0 responses ≥400** on a cold load at 1440x900 and at 390x844 (`mockReqs 0`, `bad []`, `errs []`). `nav img` count 0: the dock renders its Lucide glyphs.
- **Build output clean:** 0 `.png` or `*_mock*` files under `.svelte-kit/output`; `postbuild` leak check passes (`npm run build` exit 0). The only string match for `_mock` anywhere in the output is `server/entries/pages/_layout.svelte.js.map` (a server-side sourcemap carrying the dev-gated source text), not served to browsers; the check scans `.js/.html/.css` only, so consider adding `*.map` to it for completeness.
- **Guard** still blocks a build when `static/_mock` exists without `MOCKS_OK=1` (verified in JUDGE-6; script unchanged).

## Scorecard

| # | Criterion | R6 | R7 | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | 9 | **9** | Unchanged: grid 358.1px / 25.7% pitch, house 1.39, portrait 160x220, hero 16:9 at y=289. 48px menubar still absent |
| 2 | Collage feel | 9 | **9** | 0 overlaps of 35, grain + two-tier shadows, hero focal |
| 3 | Intro film vs teardown | 9 | **9** | play 0.22–1.90s, reveal 1.90–2.71s, removed at **2.71s** |
| 4 | Dock | 8 | **9** (+1) | 7 items at 56x56 (mobile: 4 at 44x57), one `nav`, scroll-spy anchors, actions open a dialog stub (focus in, Escape closes, focus returns to "Terminal"), 0 failing requests, uniform plate tiles. Held at 9 not higher: four actions are still stubs |
| 5 | Physics | 9 | **9** | JS 158.5 KB at load, reduced motion y 363.27→363.27, Reset exact |
| 6 | Mobile layout | 9 | **9** | 390: scrollWidth 390, CLS 0, hero card, 4-item dock with 44px targets |
| 7 | Typography / spacing | 9 | **9** | unchanged |
| 8 | Motion / reduced motion | 9 | **9** | unchanged |
| 9 | Accessibility | 9 | **9** | axe 0 violations |
| 10 | Performance | 8 | **9** (+1) | JS 158.5 KB raw, font 29.4 KB, 0 images, CLS 0.000 desktop and mobile, 0 failed requests |
| 11 | Code quality | 9 | **9** | dev-gated `iconSrc`, `postbuild` check, one component per file, typed, vitest 17 |

**Final: 11 of 11 criteria at ≥9.** (Geometry, collage, intro, dock, physics, mobile, typography, motion, accessibility, performance, code quality = 9 each.)

## Dock icon look (mock, dev only)
Uniform warm-cream plates with desaturated brown-grey glyphs (`r7-dock-mock-dev.jpg`): the row now has a consistent silhouette and fits the ink/paper board. Remaining nits, all for the real icon set (not blockers): glyphs on Talk/Terminal/Reel/Games are small and low-contrast inside the 56px plate (≈45% fill, contrast under 3:1), About is Lucide while the rest are mock PNGs (mixed styles, only 6 mocks), and the folder glyphs (Work/Archive) fill the plate far more than the others. Target for the real set: same glyph fill (~60%), ≥3:1 against the plate, one stroke weight.

## Remaining (non-blocking, none reduces a score below 9)
1. **[dock]** Give Reel and Archive real destinations (anchor sections or populated sheets) so the dock stops advertising stubs.
2. **[dock]** Real icon set per above.
3. **[board-mobile]** 48px menubar (HOMEPAGE.md) or record its deferral in STATUS.md.
4. **[board-mobile]** Replace glyph placeholder art with flat-lay photographs when assets land.
5. **[head]** Extend `postbuild` to include `*.map`, and keep `MOCKS_OK` out of every deploy job.

## Score history

| Criterion | R1 | R2 | R3 | R4 | R5 | R6 | R7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Geometry | 8 | 8 | 8 | 9 | 9 | 9 | 9 |
| Collage | 4 | 4 | 5 | 8 | 8 | 9 | 9 |
| Intro | 5 | 5 | 7 | 8 | 9 | 9 | 9 |
| Dock | 6 | 6 | 6 | 8 | 8 | 8 | 9 |
| Physics | 2 | 6 | 6 | 8 | 9 | 9 | 9 |
| Mobile | 6 | 6 | 6 | 8 | 9 | 9 | 9 |
| Typography | 5 | 5 | 6 | 8 | 9 | 9 | 9 |
| Motion | 7 | 6 | 6 | 8 | 9 | 9 | 9 |
| Accessibility | 7 | 7 | 7 | 9 | 9 | 9 | 9 |
| Performance | 8 | 6 | 6 | 9 | 9 | 8 | 9 |
| Code quality | 8 | 8 | 8 | 8 | 9 | 9 | 9 |
