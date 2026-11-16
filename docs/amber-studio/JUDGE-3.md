# JUDGE-3

Subject: scratch merge of `origin/svelte-rebuild` @ `bc2e43d` (head merged round-2 builders) + latest builder tips: `intro-film` `40770de`, `board-mobile` `8f45b8f`, `physics-gravity` `63c39e4` (unchanged), `dock` `866ea1d`, `a11y-pass` `e4896fe`. Merge clean; `npm install` + `vite build` green. Same harness (Chromium, 1x). Screenshot: `judge/r3-home-1440.jpg`.

## Scorecard (Δ vs JUDGE-2)

| # | Criterion | R2 | R3 | Reason |
| --- | --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | 8 | **8** (=) | Grid 358 / 25.7% pitch exact; house 1.39 x24, portrait 160x220 x11, hero 665x374; hero still hidden below fold (abs y=890 top edge at 890 of 900) and no menubar/status column |
| 2 | Collage feel | 4 | **5** (+1) | Denser, varied art/tone/labels, reads more like a pile of prints; but **32 of 36 cards overlap another**, labels clipped ("…ss", "Reel" under Queue), hero not visible in first viewport |
| 3 | Intro film vs teardown | 5 | **7** (+2) | `data-intro`: play 0.1–1.6s, reveal 1.6–2.5s, gone at **2.52s** (target ≤3.0 ✔). Inert page during film, no flash. Still gradient plates / no photographic hands, no smear confirmed |
| 4 | Dock | 6 | **6** (=) | Visual restyle (active pill, inactive icons 0.45 opacity) but `#work/#about/#contact` still match no element, 4/7 items have no handler, no `aria-current` |
| 5 | Physics | 6 | **6** (=) | No new commits on `physics-gravity`; matter-js still eager, reduced-motion still moves cards (y 478→688), restore diff ≤4px now |
| 6 | Mobile layout | 6 | **6** (=) | 390: no overflow, CLS 0, 10 targets <44px, 12 identical tiles, doc 4888px |
| 7 | Typography / spacing | 5 | **6** (+1) | Geist Variable now loads (29 KB woff2 ✔), spaced-caps eyebrow, better header rhythm. H1 still `engineering real world solutions` + `capitalize` (no hyphen/full stop); card labels still 10.08px |
| 8 | Motion / reduced motion | 6 | **6** (=) | Reduced motion skips film; gravity still simulates under reduced motion |
| 9 | Accessibility | 7 | **7** (=) | axe: heading-order (1 moderate) remains; added intro `inert`, focus-ring occlusion check, scroll-padding for dock (+). Dead dock anchors, 2 `nav` "Dock" |
| 10 | Performance | 6 | **6** (=) | JS 235 KB raw / 18 scripts at load (matter-js eager, also at 390), font 29 KB, CLS 0.000 desktop+mobile, images 0 |
| 11 | Code quality | 8 | **8** (=) | Vitest added; still one component/file, typed, no `any`, no shipped images |

## Evidence
- Intro timeline (50ms polling): `play`@105ms → `reveal`@1638ms → removed@2516ms. Revisit: no film. Reduced-motion: no film, opacity 1.
- Overlap census at 1440 (pairs with >6px intersect on both axes): R1 11 → R2 20 → **R3 32** of 36 cards. Collage now spans abs y 403–1752, work grid starts y=1777 (page 3374px high).
- Hero: abs y 890 (top). In a 900px viewport only a 10px sliver peeks above the dock; there is still no focal hero in screen 1.
- Fonts: `document.fonts` loaded = `Geist Variable`; h1 text content `engineering real world solutions` (CSS capitalize → "Engineering Real World Solutions").
- Dock: hrefs `#work/#about/#contact`, `grep id="work|about|contact"` in `web/src` = 0 matches → still dead. `+layout.svelte` has no `active`/`onaction`. Hover magnification unchanged (1.7 max).
- Physics: Gravity displaces cards by 0–200px over 2.5s; Reset returns within 1–4px. Under `reducedMotion: reduce` card 0 still moved 478 → 688.
- JS at load 235,225 B (was 231,369). Matter chunk `CKauFWtN.js` still in the first-load script list at 1440 and 390.

## Punch list status
**Closed since R2:** 18 (intro ≤3.0s: 2.52s), 23 (font loaded), 36 (intro budget), intro inert/keyboard filter.
**Still open, ranked by impact**
1. **[board-mobile]** H1 → `Engineering real-world solutions.` (drop `capitalize`; fix `studio.motto`). One-line fix, open since R1.
2. **[board-mobile] + [dock]** Give anchors: `id="work"` (WorkGrid), `id="about"`, `id="contact"`; wire `active`/`onaction` from `+layout.svelte`; set `aria-current="location"` on the active dock item. Open since R1 (#10–12).
3. **[physics-gravity]** Dynamic-import matter on first click (#28): JS back to ≤140 KB, nothing physics-related on mobile.
4. **[physics-gravity]** Reduced motion: no simulation (#29).
5. **[board-mobile]** Collage legibility: cap overlap (32/36 now): enforce label never covered; bring hero to abs y ≤ 300 (#32, #33).
6. **[board-mobile]** Label size floor `max(11px, 0.7cqw)`; tile h3 → h2 or add "Work" h2 (#4, #8).
7. **[a11y-pass]** Touch targets ≥44px (10 at 390), merge duplicate `nav "Dock"` landmarks (#15, #25).
8. **[intro-film]** Replace saturated gradient plates with the ink/paper palette; add smear (#19, #20).
9. **[dock]** Reduced-motion for magnification; wire or hide dead action buttons (#11, #14).
10. **[board-mobile]** Mobile tiles: add rhythm (no 12 identical squares), hero card on mobile (#6 round 1).

## Pending
Round 4 triggers on the next commit to any builder branch or `svelte-rebuild`.
