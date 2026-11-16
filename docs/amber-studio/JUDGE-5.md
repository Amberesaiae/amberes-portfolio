# JUDGE-5 (final round)

Subject: `origin/svelte-rebuild` @ `eec81c2` (all builder tips merged: intro round 8, board round 6, physics R3, dock reduced-motion e2e). Clean install, `vite build` green, vitest 17/17. Same harness (Chromium, 1x). Screenshots: `judge/r5-home-1440.jpg`, `r5-home-390.jpg`, `r5-intro-1440.jpg`.

## Final scorecard

| # | Criterion | R4 | R5 | Evidence |
| --- | --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | 9 | **9** | Grid 358.1px squares, x=164.9/535/905 (pitch 370.1 = 25.7%), house 1.39, portrait 160x220, hero 665 16:9 in first viewport (top y=289, 1.5°); status column present. Missing: the 48px menubar |
| 2 | Collage feel | 8 | **8** | 0 overlapping pairs of 35, centred tilted hero focal point, labels 12px. Still flat placeholder art: no paper grain or varied contact shadows on cards |
| 3 | Intro film vs teardown | 8 | **9** | play 0.13–1.79s, reveal 1.79–2.60s, removed at **2.60s** (≤3.0 ✔). Film now shows flat-lay stand-ins with paper tooth, dust, directional smear (feGaussianBlur present), 10 blend-mode layers, visible "Click or press any key to skip", inert page. Remaining gap to a 10: stand-ins are SVG, not photographs (asset-dependent) |
| 4 | Dock | 8 | **8** | One `nav` landmark ✔, scroll-spy anchors ✔, magnification peaks 1.63 (cursor-adjacent), reduced-motion: scale stays `matrix(1,0,0,1…)` ✔. But handlerless actions were *hidden*, so the dock is now **3 icons** (Work/About/Talk) vs the 7-item spec in DOCK-AND-BRAND.md; it no longer reads as a dock. Also a duplicate hidden mobile set of 3 links (0x0) remains in DOM |
| 5 | Physics | 8 | **9** | Lazy engine (156.6 KB JS at load → 248 KB only after first Gravity click), cards fall to a viewport-aware floor, Reset restores exact positions (diff 0px), reduced motion: no displacement (363.27→363.27), unit tests added |
| 6 | Mobile layout | 8 | **9** | 390: no overflow, CLS 0, 0 touch targets <44px, "Now building" hero card ahead of "Work" h2, status block, varied tile heights, dock with active dot |
| 7 | Typography / spacing | 8 | **9** | H1 `Engineering real‑world solutions.` with U+2011 hyphen, balanced 2-line wrap at 1440 and 390 (no "real-/world"), Geist Variable loaded (29 KB), labels 12px |
| 8 | Motion / reduced motion | 8 | **9** | Reduced motion: no film, no physics motion, no dock magnification (all verified); film skip on any key/click |
| 9 | Accessibility | 9 | **9** | axe 0 violations; headings H1,H2,H3…,H2; one main, one nav; skip link; 44px targets; inert film with live skip hint |
| 10 | Performance | 9 | **9** | JS 156.6 KB raw / 15 scripts, CLS 0.000 desktop and mobile, 0 images, 29 KB font, DOM 714 nodes |
| 11 | Code quality | 8 | **9** | 32 components, one per file, `PillButton.svelte` extracted, typed props, data in `lib/data`, no `any`/`@ts-ignore`, no module `$state`, no `_mock` references, no tracked raster/video under `web/`, vitest 17 green |

**Status: 9 of 11 at ≥9. Two below: collage feel (8) and dock (8).**

## Remaining fixes to reach 9+ (only two)
1. **[board-mobile] Collage 8→9:** give collage cards paper grain (subtle noise overlay, mix-blend-mode multiply ~.08) and two shadow tiers (contact shadow `0 1px 2px` + ambient `0 14px 30px` scaled by rotation), so the pile reads as prints on a desk. Verify with a before/after of `judge/r5-home-1440.jpg`.
2. **[dock] Dock 8→9:** restore the 7-item dock without dead buttons: wire Terminal/Reel/Games/Archive to real targets (even a lightweight `<dialog>` window or anchor to a stub section) rather than hiding them, so the dock keeps the evidence/stack groups and separators from DOCK-AND-BRAND.md. Remove the hidden 0x0 mobile link duplicates from the desktop DOM.
3. (non-blocking) **[board-mobile]** Add the 48px menubar from HOMEPAGE.md or record its deferral in STATUS.md; geometry is 9 only because every measured number matches.

## Score history

| Criterion | R1 | R2 | R3 | R4 | R5 |
| --- | --- | --- | --- | --- | --- |
| Geometry | 8 | 8 | 8 | 9 | 9 |
| Collage | 4 | 4 | 5 | 8 | 8 |
| Intro | 5 | 5 | 7 | 8 | 9 |
| Dock | 6 | 6 | 6 | 8 | 8 |
| Physics | 2 | 6 | 6 | 8 | 9 |
| Mobile | 6 | 6 | 6 | 8 | 9 |
| Typography | 5 | 5 | 6 | 8 | 9 |
| Motion | 7 | 6 | 6 | 8 | 9 |
| Accessibility | 7 | 7 | 7 | 9 | 9 |
| Performance | 8 | 6 | 6 | 9 | 9 |
| Code quality | 8 | 8 | 8 | 8 | 9 |
