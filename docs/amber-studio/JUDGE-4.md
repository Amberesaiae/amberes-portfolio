# JUDGE-4

Subject: `origin/svelte-rebuild` @ `b90c40e` (head merged all builder tips; dock icon mocks on `dock-icons` ignored as instructed). Clean `npm install`, `vite build` green, vitest 11/11. Same harness (Chromium, 1x). Screenshots: `judge/r4-home-1440.jpg`, `r4-home-390.jpg`, `r4-gravity-1440.jpg`.

## Scorecard (Δ vs JUDGE-3)

| # | Criterion | R3 | R4 | Reason |
| --- | --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | 8 | **9** (+1) | Grid 358.1px squares, pitch 370.1 (25.7%), 12px gap exact; house 1.39 (x23), portrait 160x220 (x11), hero 16:9 now in first viewport (top y=289, 1.5° tilt); status column (Taking work / Accra time / Now building) added. Menubar 48px still not present |
| 2 | Collage feel | 5 | **8** (+3) | **0 overlapping pairs** (was 32), centred hero is a real focal point with shadow, labels legible, varied rotation. Remaining: art is flat placeholder (no paper texture/contact shadow variance), only 35 collage cards |
| 3 | Intro film vs teardown | 7 | **8** (+1) | play 0.13–1.63s, reveal 1.63–2.44s, removed at **2.44s**; skip hint, neutral palette, smear, inert page. Not 9: still no photographic plates/hands (placeholder), paper/dust layers not visible |
| 4 | Dock | 6 | **8** (+2) | No dead links: `#work/#about/#contact` resolve to real ids, scroll-spy active dot, Terminal/Reel/Games/Archive rendered disabled (`aria-disabled`, 0.45 opacity) instead of silently dead. Not 9: 4 of 7 items still inert; two `nav "Dock"` landmarks (one `display:none`) |
| 5 | Physics | 6 | **8** (+2) | Lazy engine (JS 148.8 KB at load; 240 KB only after first Gravity click); gravity makes cards fall (y 363→840…1205, rest at the floor); Reset returns to exact start (0px diff); reduced motion: card y unchanged (363.27→363.27) |
| 6 | Mobile layout | 6 | **8** (+2) | 390: no overflow, CLS 0, **0 targets <44px**, "Work" h2, status block, varied tile heights (358/448/286/448), dock active dot. No hero card on mobile; H1 breaks "real-/world" at the hyphen |
| 7 | Typography / spacing | 6 | **8** (+2) | `Engineering real-world solutions.` ✔, Geist Variable loaded (29 KB), tracking-caps eyebrow, right column aligned. Card labels 11px (floor, still small), body copy under 12px for owner line (~12px) |
| 8 | Motion / reduced motion | 6 | **8** (+2) | Reduced motion: no film, no physics movement, no animations. Dock magnification under reduced motion not re-verified |
| 9 | Accessibility | 7 | **9** (+2) | axe **0 violations** (heading-order fixed: h1 → h2 "Work" → h3), skip link, 1 main, inert film, targets ≥44px at 390, disabled dock items announced |
| 10 | Performance | 6 | **9** (+3) | JS 148.8 KB raw / 16 scripts at load (was 235 KB), CLS 0.000 desktop+mobile, font 29 KB, images 0; engine deferred |
| 11 | Code quality | 8 | **8** (=) | 31 components, one per file, typed props, data in `lib/data`, no `any`/`@ts-ignore`, no module-level `$state`, vitest 11 green, zero shipped raster (only favicon.svg). 9 would need `PillButton` dedupe and DockDesktop/Mobile landmark merge |

Criteria at 9+: geometry, accessibility, performance. Remaining at 8: collage, intro, dock, physics, mobile, typography, motion, code.

## Evidence (selected)
- Intro polling (40ms): `[133 play, 1633 reveal, 2440 none]`; revisit: none; reduced motion: none.
- Overlap census: 0 pairs of 35 cards; collage abs y 289–2284; grid starts y=2360.
- Anchors: `#work`, `#about`, `#contact` all exist; dock items 4–7 `aria-disabled=true`.
- Headings: H1, H2, H3 x12, H2, H2 — monotonic.
- Gravity 3s: all cards dropped out of the first viewport to the collage floor (`r4-gravity-1440.jpg`): reads as gravity. (The header band is left empty above the pile; acceptable.)
- Mobile tap-target scan: 0 elements under 44x44.
- Bundle: 148,840 B JS, 36.7 KB CSS, 29.4 KB font, 82 KB HTML/payload.

## Remaining punch list (to reach 9+ everywhere)
1. **[board-mobile]** Placeholder art → add paper-grain overlay + contact-shadow variation (two shadow tiers by rotation/z) so the collage reads as prints on a desk, not flat cards (collage 8→9).
2. **[board-mobile]** Add the 48px menubar from HOMEPAGE.md (Work Reel About Talk + status) or document why it is deferred; prevent `real-/world` break with `text-wrap: balance` and a non-breaking hyphen (U+2011) in the H1 on mobile (typography 8→9).
3. **[board-mobile]** Card label floor 11px → 12px and owner line 12px → 13px (typography).
4. **[board-mobile]** Mobile hero: add a full-width 16:9 "Now building" card before the work tiles (mobile 8→9).
5. **[intro-film]** Show visible paper-grain and dust layers per teardown §2 (blend modes verbatim: hard-light .22, screen .7) and replace ink gradients with the photo stand-ins as soon as assets land (intro 8→9).
6. **[dock]** Either wire the four actions (even to a "coming soon" popover) or hide them on mobile; merge the two `nav "Dock"` landmarks into one (dock 8→9). Verify magnification is disabled under reduced motion with a test.
7. **[physics-gravity]** Add a Playwright/vitest assertion for "no simulation under reduced motion" so it stays fixed; make Gravity's resting pile stay inside the viewport-height collage floor (currently falls ~900px below the controls, leaving a blank band) (physics 8→9).
8. **[a11y-pass/head]** Extract `PillButton.svelte` for the three identical control buttons (code 8→9); keep a smoke script asserting overlap=0, intro ≤3s, 0 dead links, axe 0.

## Pending
Round 5 (last): will re-run on the next commit to `svelte-rebuild`, then send the final table to the head.
