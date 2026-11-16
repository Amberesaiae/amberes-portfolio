# JUDGE-2

Subject: scratch merge (no conflicts) of `origin/svelte-rebuild` @ `fe296fd` + `intro-film` (+2: `a653629`, `c1b4d6a`) + `board-mobile` (+2: `2510893`, `542ae67`) + `physics-gravity` (+1: `63c39e4`). `dock` and `a11y-pass` had no new commits, so every dock/a11y/typography finding from JUDGE-1 stands unchanged. Same harness as round 1 (Chromium, 1x, 1440x900 / 390x844). Screenshots: `judge/r2-*.jpg`.

Note on `svelte-check`: in my scratch worktree it reports `./$types` not found because node_modules is symlinked; I am not scoring that, the head's check is the authority.

## Scorecard (Δ vs JUDGE-1)

| # | Criterion | R1 | R2 | Reason |
| --- | --- | --- | --- | --- |
| 1 | Board geometry vs measured numbers | 8 | **8** (=) | Sizes/pitch identical; hero still not in the first viewport (abs y=927, was 1124); menubar/right column still absent |
| 2 | Collage feel | 4 | **4** (=) | Denser + more rotation variety, but overlapping pairs rose 11 → **20**; hero now at 927 (still below the fold); dark-card labels still invisible |
| 3 | Intro film vs teardown | 5 | **5** (=) | Still ~5.0s total (play 3.5 + reveal 1.5); gradient plates, no smear/skip hint; storage-throw + key filtering fixed (good) |
| 4 | Dock | 6 | **6** (=) | No change: 4/7 dead buttons, dead anchors, no `active` |
| 5 | Physics | 2 | **6** (+4) | Mounted with Gravity/Scatter/Reset + live status + aria-pressed; cards react. But eager matter-js (+94 KB JS), reduced-motion still moves cards, tiny displacement, imperfect restore |
| 6 | Mobile layout | 6 | **6** (=) | Collage + controls correctly absent at 390 (0x0), no overflow, CLS 0; same 12 identical squares, 10 targets <44px (was 7) |
| 7 | Typography / spacing | 5 | **5** (=) | Untouched: no font loaded, "Engineering Real World Solutions", cqw labels still 10px |
| 8 | Motion / reduced motion | 7 | **6** (-1) | Reduced motion skips film, but gravity still animates under `prefers-reduced-motion` (card y moved 390.8 → 407.2) despite the "(instant, reduced motion)" label |
| 9 | Accessibility | 7 | **7** (=) | New controls are real buttons with aria-pressed + announcer (+); still heading-order, dead dock links, controls <44px, 2 `nav` "Dock" |
| 10 | Performance | 8 | **6** (-2) | JS at load 137 KB → **231 KB raw** (18 scripts) because matter-js loads eagerly even on mobile where the collage is `display:none`; CLS still 0 |
| 11 | Code quality | 8 | **8** (=) | New `CollageControls.svelte` is one component, typed; physics hardened with unit tests (good). Duplicated button class string x3 |

No criterion is 9+. Net: physics fixed; perf regressed; collage layout got worse.

## Evidence

### Collage / geometry (1440)
- Sizes: house 250x180 x12 (was 10), 206x148 x13, portrait 160x220 x10 (was 12), hero 665x374 x1; total still 36. Ratios unchanged: 1.389 / 1.392. Work grid unchanged: 358.1px squares at x=164.9/535/905, pitch 370.1 (=25.7%).
- Collage compressed `COLLAGE_HEIGHT` 2200 → 1560 and band pitch 200 → 150 with the same 44 slots, which is why overlapping pairs went 11 → **20** of 36. Page height 4037 → 3524.
- Hero `y` 820 → 560 (collage-relative) = abs 927 at 1440: its top edge is 27px beneath the 900px fold. Still not in the first viewport (`r2-home-1440.jpg` shows no hero).
- Rotation now `±8°` on 1 in 4 cards, `±4.5°` on the rest: more variety, but cards overlap each other and clip labels ("Fie…", "Book…", "Offline" over "Booking").
- Gravity/Reset: Gravity moves cards by 40–110 px over 2.5s (no fall to a floor visible in `r2-gravity-1440.jpg`: cards separate/rotate and stack, the page bottom is still empty). Reset returns within ~8px, not exactly (card 0: 391 → 399).

### Intro
- `data-intro`: play 0–3.5s, reveal 3.5–5.0s, removed by ~5.3s. Deltas: pan 1700→1500, veil 400→350, tail 1700→1500 (−0.45s total). Target ≤3.0s. Still **~1.7x over**.
- New: `c1b4d6a` covers the page from first paint (removes pre-hydration flash; screenshot at 155ms shows no flash). `a653629` guards sessionStorage throw and filters keydown to real keys (good: Tab/Shift no longer skip the film). Reduced-motion and revisit gate still correct.
- Film still gradient plates in saturated purple/teal/brown, no hands/photograph, no skip hint (`intro-1440.jpg` unchanged in content).

### Physics
- Home now renders `<PhysicsLayer>` around the collage and `CollageControls` (Gravity / Scatter / Reset + `data-testid=physics-state`, `announce()` polite). Controls: `aria-pressed` on Gravity, visible focus ring. Good.
- **Perf**: JS at load is 231,369 B across 18 scripts vs 137,337 B / 13 in round 1: `CKauFWtN.js` (matter-js, 83 KB) now loads on `/` before any interaction, and also on 390px where the layer is `display:none`. The comment says "Physics is idle until a control is used" but the module is statically imported (`PhysicsLayer` → `action.js` → `engine.js`).
- **Reduced motion**: with `reducedMotion: 'reduce'`, clicking Gravity still displaced card 0 from y=390.8 to 407.2 while the UI says "(instant, reduced motion)". "Instant" movement of cards is still movement; it also contradicts the status copy. The expected behaviour is no simulation at all (or a static re-layout).
- Controls row is `hidden md:flex` so mobile has none: correct. Buttons are 28px tall (py-1.5 text-sm) < 44px target.

### Mobile (390)
- Collage wrapper measures 0x0, controls hidden, scrollWidth 390, CLS 0, doc height 4880 (+64). Interactive elements under 44px: **10** (was 7) — the new desktop-only buttons don't count on mobile, so the extra three are the dock "More" row and tiles inside the pb-32 change; investigate.
- Unchanged: 12 identical 358x358 tiles, no hero card on mobile, no "Gravity"-style interaction.

### What I could not re-verify because nothing changed
Dock (hover magnification still 1.0126/1.397/1.700/1.264, dead hrefs `#work/#about/#contact`, no `active`/`onaction`), a11y-pass (fonts, contrast, targets), board typography (title case, 10px labels).

## Punch list (carried + new; numbering continues from JUDGE-1, ✔ = fixed in R2)

**New in R2**
28. **[physics-gravity]** Lazy-load the engine: `await import('./engine.js')` inside the action on first Gravity/Scatter click (or `IntersectionObserver` + idle), so `/` returns to ≤140 KB JS and mobile never fetches matter-js. Measure: scripts at load on 390 must not include `CKauFWtN`.
29. **[physics-gravity]** `prefers-reduced-motion`: do not run the engine. Controls should either be disabled with "Disabled (reduced motion)" or perform a one-frame static layout without simulation. Today cards still translate and the label lies ("instant").
30. **[physics-gravity]** Make Gravity read as gravity: cards should fall to the collage floor (bottom of `data-board-collage`) and rest; currently they move 40–110px in 2.5s and push each other sideways. Show a floor, set restitution/friction, run to sleep in ≤2.5s.
31. **[physics-gravity]** Reset must restore the exact CSS positions (diff 0px, not ~8px): store initial offsets in `data-*` and tween back.
32. **[board-mobile]** Overlaps went 11 → 20 after the density change. Hold collage height 1560 but reduce items or cap overlap area per pair to ≤8% of the smaller card; assert 0 label-covering overlaps (a label's bbox must not intersect any card above it).
33. **[board-mobile]** Hero is now abs y=927. Set to `y ≤ 300` so it renders between the controls row and the dock at 1440x900, rotated 1–2°.
34. **[board-mobile]** Controls: raise to `min-h-[44px]` on touch/coarse pointers and dedupe the 3 identical class strings into a `PillButton.svelte` (one component per file, typed).
35. **[board-mobile]** Controls row and header should not push the collage start to y=376; header band's right 55% is still empty at 1440. Place controls in that right-hand column (HOMEPAGE.md status column) instead.
36. **[intro-film]** Total still 5.0s. New budget: `pan ≤ 1100`, `cutHold ≤ 140`, `veil ≤ 250`, `revealTail ≤ 900` → `data-intro` removed ≤ 3.0s. Measure with the same polling script; target value for the head's smoke test: `t(none) ≤ 3000ms`.

**Carried from JUDGE-1 unchanged (still open):** 1, 3–15, 17 (superseded by 28), 18–27. Most urgent by impact: 5 (motto text), 10/11/12 (dead dock + anchors), 23 (fonts not loaded), 7 (tile contrast), 19 (gradient intro), 21 (skip hint).

## Pending
Builder branches ahead of `svelte-rebuild`: `intro-film` +2, `board-mobile` +2, `physics-gravity` +1, `dock` 0, `a11y-pass` 0. JUDGE-3 will re-merge on the next commits.
